#!/usr/bin/env node
import process from 'node:process'
import { debuglog, promisify, styleText } from 'node:util'
import child_process from 'node:child_process'
import information  from './index.js'

const { bin, salutation, firstName, fullName, socials, humanRightsMessage } = information

// utils:
const exec = promisify(child_process.exec);
const debug = debuglog('pw')
const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms))

debug('start cli code')

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
      $ npx ${bin}

    With full speaking audio:
      $ npx ${bin} --read-out-loud

    Without speaking audio:
      $ npx ${bin} --silent

    Without animation:
      $ npx ${bin} --reduced-motion
`;

const say = async (inputText) => {
	const text = inputText ?? `${salutation}, I'm ${firstName}`
	try {
		await exec(`say "${text}"`)
	} catch (error) {
		debug('say: could not run the "say" command.')
	}
}

const mainMessage = `
${Object.entries(socials).map(([key, value]) => `${key}: ${value}`).join('\r\n')}
`;

const humanRights = humanRightsMessage.split('').map((c, i) => styleText(i % 2 ? 'blueBright' : 'magentaBright', c)).join('')

const main = async () => {
	debug('run cli program')
	const args = process.argv.slice(2)
	if (args.includes('--help')) {
		console.info(usageMessage)
		return
	}
	if (!args.includes('--no-audio') && !args.includes('--silent')) {
		if (args.includes('--read-out-loud')) {
			const audioString = `${salutation}, i'm ${fullName}. You can find me online at: ${Object.values(socials).join('. Or at ').replaceAll('https://', '')}. Oh, and: ${humanRightsMessage}`
			say(audioString)
		} else {
			say()
		}
	}
	const greeting = `${salutation}, I'm ${styleText('bold', fullName)}`
	if (args.includes('--no-animation') || args.includes('--reduced-motion')) {
		console.log(greeting, '👋')
	} else {
		await type(greeting)
	}
	// console.table(socials) // could work as well
	console.log(mainMessage)
	console.log(humanRights, '🏳️‍⚧️')
}

main()
	.then(() => debug('ran the cli successfully'))
	.catch(error => debug('error:', error))
