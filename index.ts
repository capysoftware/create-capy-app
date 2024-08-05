import { intro, note, outro, text } from "@clack/prompts";
import { $, write } from "bun";
import pc from "picocolors";
import { COMPONENT_JSON, LAYOUT, SAAS_DASHBOARD } from "./templates";

intro(pc.bgCyan(`next-scaffold`));

const projectName = await text({
	message: "What is your project name?",
	placeholder: "project-name",
	validate(value) {
		if (value.length === 0) return `Please enter a project name.`;
	},
});

await $`bun create next-app@latest ${projectName} --ts --tailwind --eslint --app --src-dir --use-bun --import-alias '@/*'`;

await write(`./${projectName.toString()}/components.json`, COMPONENT_JSON);

await $`cd ${projectName} && bunx --bun shadcn-ui@latest init -y -d && bunx --bun shadcn-ui@latest add -y badge button card dropdown-menu input sheet`;

await write(`./${projectName.toString()}/src/app/layout.tsx`, LAYOUT);

await write(`./${projectName.toString()}/src/app/page.tsx`, SAAS_DASHBOARD);

note(`
${pc.green("cd " + projectName.toString())} to get into your next js app
${pc.green("bun dev")} to start the development server`);

outro(`You're all set!`);
