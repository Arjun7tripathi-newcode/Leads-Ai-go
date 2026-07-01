import mongoose, { Schema, Document, models } from 'mongoose';

export interface IProspect extends Document {
  name: string;
  jobTitle: string;
  company: {
    name: string;
    website?: string;
    logo?: string;
    size?: string;
    industry?: string;
  };
  email: string;
  isEmailVerified: boolean;
  phone: string;
  location: string;
  category: string;
  googleRating: number;
  reviewCount: number;

  // === OPPORTUNITY ENGINE ===
  websiteStatus: 'No Website' | 'Poor Website' | 'Outdated Website' | 'Good Website' | 'Excellent Website';
  seoScore: number | null;
  opportunityScore: number;
  recommendedService: string;
  estimatedDealValue: string;

  // === SEO ANALYSIS ===
  seoAnalysis: {
    hasTitle: boolean;
    hasMetaDescription: boolean;
    hasH1: boolean;
    hasSchema: boolean;
    hasSSL: boolean;
    hasMobileViewport: boolean;
    hasContactForm: boolean;
    hasOpenGraph: boolean;
    imageCount: number;
    wordCount: number;
    lastAnalyzed: Date;
  };

  // === WEBSITE ANALYSIS ===
  websiteAnalysis: {
    isResponsive: boolean;
    hasLiveChat: boolean;
    hasBookingSystem: boolean;
    hasTrustSignals: boolean;
    hasSocialMedia: boolean;
    designQuality: 'Poor' | 'Average' | 'Good' | 'Excellent';
  };

  leadScore: number;
  status: 'New' | 'Qualified' | 'Contacted' | 'Interested' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost';
  tags: string[];
  aiAnalysis: {
    intent: 'Low' | 'Medium' | 'High';
    healthScore: number;
    summary: string;
    growthOpportunities: string[];
    outreachAngle: string;
  };
  socials: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  isAnalyzed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProspectSchema = new Schema({
  name: { type: String, required: true },
  jobTitle: { type: String, default: 'Owner / Manager' },
  company: {
    name: { type: String },
    website: { type: String },
    logo: { type: String },
    size: { type: String },
    industry: { type: String }
  },
  email: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  phone: { type: String },
  location: { type: String },
  category: { type: String },
  googleRating: { type: Number },
  reviewCount: { type: Number, default: 0 },

  websiteStatus: {
    type: String,
    enum: ['No Website', 'Poor Website', 'Outdated Website', 'Good Website', 'Excellent Website'],
    default: 'No Website',
  },
  seoScore: { type: Number, default: null },
  opportunityScore: { type: Number, default: 50 },
  recommendedService: { type: String, default: 'Website Development' },
  estimatedDealValue: { type: String, default: '₹15,000 – ₹50,000' },

  seoAnalysis: {
    hasTitle: { type: Boolean },
    hasMetaDescription: { type: Boolean },
    hasH1: { type: Boolean },
    hasSchema: { type: Boolean },
    hasSSL: { type: Boolean },
    hasMobileViewport: { type: Boolean },
    hasContactForm: { type: Boolean },
    hasOpenGraph: { type: Boolean },
    imageCount: { type: Number },
    wordCount: { type: Number },
    lastAnalyzed: { type: Date },
  },

  websiteAnalysis: {
    isResponsive: { type: Boolean },
    hasLiveChat: { type: Boolean },
    hasBookingSystem: { type: Boolean },
    hasTrustSignals: { type: Boolean },
    hasSocialMedia: { type: Boolean },
    designQuality: { type: String, enum: ['Poor', 'Average', 'Good', 'Excellent'] },
  },

  leadScore: { type: Number, default: 50 },
  status: {
    type: String,
    enum: ['New', 'Qualified', 'Contacted', 'Interested', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'],
    default: 'New'
  },
  tags: [{ type: String }],
  aiAnalysis: {
    intent: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    healthScore: { type: Number, default: 50 },
    summary: { type: String },
    growthOpportunities: [{ type: String }],
    outreachAngle: { type: String },
  },
  socials: {
    linkedin: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    facebook: { type: String },
  },
  isAnalyzed: { type: Boolean, default: false },
}, { timestamps: true });

export const Prospect = models.Prospect || mongoose.model<IProspect>('Prospect', ProspectSchema);
