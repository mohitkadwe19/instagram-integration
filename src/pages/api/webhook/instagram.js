// This endpoint is specifically for handling Instagram webhook verifications
export default function handler(req, res) {
    // Handle webhook verification request
    if (req.method === "GET") {
      if (
        req.query["hub.mode"] === "subscribe" &&
        req.query["hub.challenge"]
      ) {
        console.log("Webhook verification received");
        // Return the challenge to verify the webhook
        return res.status(200).send(req.query["hub.challenge"]);
      }
      
      return res.status(400).json({ error: "Invalid verification request" });
    }
    
    // Handle actual webhook events
    if (req.method === "POST") {
      // Process webhook data
      console.log("Webhook event received:", req.body);
      return res.status(200).json({ success: true });
    }
  
    // Method not allowed
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }