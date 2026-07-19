const z = require('zod');
const z4core = require('zod/v4/core');

const schema = z.object({
  name: z.string().min(1, 'name required'),
}).superRefine((data, ctx) => {
  if (!data.name || data.name.length < 2) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['name'], message: 'too short' });
  }
});

(async () => {
  try {
    const result = await z4core.parseAsync(schema, { name: '' });
    console.log('resolved:', result);
  } catch(e) {
    console.log('error type:', e.constructor?.name);
    console.log('has issues:', Array.isArray(e.issues));
    console.log('issues:', JSON.stringify(e.issues, null, 2));
  }
})();
