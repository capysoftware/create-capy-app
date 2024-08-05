import {
	intro,
	note,
	outro,
	text,
	confirm,
	cancel,
	isCancel,
} from "@clack/prompts";
import { $, write } from "bun";
import pc from "picocolors";
import { COMPONENT_JSON, LAYOUT, SAAS_DASHBOARD } from "./templates";
import template from "lodash.template";
import { hypenToCapitalCase } from "./lib/utils";
import { rm, exists } from "node:fs/promises";

intro(pc.bgCyan(`Create Capy App`));

const projectName = await text({
	message: "What is your project name?",
	placeholder: "project-name",
	validate(value) {
		const regex = new RegExp("^[a-zA-Z-]+$");
		if (value.trim().length === 0) {
			return "Directory name is required.";
		} else if (!regex.test(value)) {
			return "Directory name may only contain letters and dashes!";
		}
	},
});

const directoryAlreadyExists = await exists(`./${projectName.toString()}`);

if (directoryAlreadyExists) {
	const confirmDeleteProject = await confirm({
		message: pc.red(
			`${projectName.toString()} already exists. Do you want to delete it?`
		),
	});

	if (!confirmDeleteProject) {
		outro(`You must delete ${projectName.toString()} before continuing.`);
		process.exit(0);
	}

	if (isCancel(confirmDeleteProject)) {
		cancel("Operation cancelled.");
		process.exit(0);
	}

	await rm(`./${projectName.toString()}`, { recursive: true, force: true });
}

await $`bun create next-app@latest ${projectName} --ts --tailwind --eslint --app --src-dir --use-bun --import-alias '@/*'`;

await write(`./${projectName.toString()}/components.json`, COMPONENT_JSON);

await $`cd ${projectName} && bunx --bun shadcn-ui@latest init -y -d && bunx --bun shadcn-ui@latest add -y badge button card dropdown-menu input sheet`;

const capitalCaseProjectName = hypenToCapitalCase(projectName.toString());
await write(
	`./${projectName.toString()}/src/app/layout.tsx`,
	template(LAYOUT)({ projectName: capitalCaseProjectName })
);

await write(
	`./${projectName.toString()}/src/app/page.tsx`,
	template(SAAS_DASHBOARD)({ projectName: capitalCaseProjectName })
);

note(`
${pc.green("cd " + projectName.toString())} to get into your next js app
${pc.green("bun dev")} to start the development server`);

outro(`You're all set!`);
