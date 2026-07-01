import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Lead } from '@/models/Lead';
import { Prospect } from '@/models/Prospect';
import { ProspectList } from '@/models/ProspectList';

export async function GET() {
  try {
    await connectToDatabase();

    const totalLeads = await Lead.countDocuments();
    const totalProspects = await Prospect.countDocuments();
    const totalLists = await ProspectList.countDocuments();

    // Calculate pipeline value
    // Assuming each prospect has an estimatedDealValue like '₹15,000 – ₹50,000'
    // We'll extract the lower bound just for a conservative total
    const prospects = await Prospect.find({ estimatedDealValue: { $exists: true } });
    let totalPipelineValue = 0;
    
    prospects.forEach(p => {
      if (p.estimatedDealValue) {
        const match = p.estimatedDealValue.match(/\d+(?:,\d+)?/);
        if (match) {
          const val = parseInt(match[0].replace(/,/g, ''), 10);
          totalPipelineValue += val;
        }
      }
    });

    const statusCounts = await Prospect.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const statusMap = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        totalLeads,
        totalProspects,
        totalLists,
        totalPipelineValue,
        statusDistribution: [
          { name: 'New', value: statusMap['New'] || 0 },
          { name: 'Qualified', value: statusMap['Qualified'] || 0 },
          { name: 'Contacted', value: statusMap['Contacted'] || 0 },
          { name: 'Interested', value: statusMap['Interested'] || 0 },
          { name: 'Meeting', value: statusMap['Meeting Scheduled'] || 0 },
          { name: 'Proposal', value: statusMap['Proposal Sent'] || 0 },
          { name: 'Won', value: statusMap['Won'] || 0 },
          { name: 'Lost', value: statusMap['Lost'] || 0 }
        ]
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
