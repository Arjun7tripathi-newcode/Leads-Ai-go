const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://arjun7tripathi_db_user:PNBXSWuLMRHjbozX@leader-flow217.t3bvmdt.mongodb.net/?appName=Leader-Flow217";

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to DB");
  
  const accountSchema = new mongoose.Schema({}, { strict: false });
  const EmailAccount = mongoose.models.EmailAccount || mongoose.model("EmailAccount", accountSchema);
  
  const accounts = await EmailAccount.find({});
  console.log(`Found ${accounts.length} accounts`);
  
  for (const acc of accounts) {
    console.log(`Account: ${acc.emailAddress}`);
    console.log(`- has accessToken: ${!!acc.accessToken}`);
    console.log(`- has refreshToken: ${!!acc.refreshToken}`);
    console.log(`- refreshToken val: ${acc.refreshToken ? acc.refreshToken.substring(0,10) + '...' : 'empty'}`);
  }
  
  process.exit(0);
}
run().catch(console.error);
