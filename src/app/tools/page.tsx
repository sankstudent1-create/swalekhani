import { redirect } from 'next/navigation';

// Legacy tools index — retired. The template gallery lives at /templates
// and the studio at /tools/letterpad-generator.
export default function ToolsRedirect() {
  redirect('/');
}
