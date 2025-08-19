#!/usr/bin/env node
import process from 'node:process'
import { debuglog, promisify, styleText } from 'node:util';
import child_process from 'node:child_process';

// utils:
const exec = promisify(child_process.exec);
const debug = debuglog('pw')
const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function type(text, speed = 50) {
  for (const char of text) {
    process.stdout.write(char);
    await sleep(speed);
  }
  process.stdout.write('\n');
}

// text messages:
const usageMessage = `
    Usage
      $ npx pascalweiland

    Without speaking audio:
      $ npx pascalweiland --silent
`;

const say = async () => {
	try {
		await exec('say "hello stranger"')
	} catch (error) {
		debug('say: could not run the "say" command.')
	}
}

const greeting = `Hi, I'm ${styleText('bold', 'Pascal Weiland')} 👋`

const mainMessage = `
Website  https://pascal.codes
GitHub   https://github.com/weiland
Mastodon https://chaos.social/@pascal
`;

const humanRights = 'Trans rights are human rights!'.split('').map((c, i) => styleText(i % 2 ? 'blueBright' : 'magentaBright', c)).join('')

const main = async () => {
	const args = process.argv.slice(2)
	if (args.includes('--help')) {
		console.info(usageMessage)
		return
	}
	if (!args.includes('--no-audio') && !args.includes('--silent')) {
		say()
	}
	await type(greeting)
	console.log(mainMessage)
	console.log(humanRights)
}

main()
	.then(() => debug('ran the cli successfully'))
	.catch(error => debug('error:', error))
