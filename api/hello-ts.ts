
export const config = {
  runtime: "nodejs18.x"
};

export default function handler(req, res) {
  res.status(200).json({
    language: "TypeScript",
    message: "TS serverless function OK",
    time: new Date().toISOString()
  });
}
