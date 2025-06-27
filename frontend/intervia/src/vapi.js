// vapiClient.js
import Vapi from "@vapi-ai/web";

const vapi = new Vapi(import.meta.env.VITE_APP_VAPI_PUBLIC_API_KEY);
export default vapi;
