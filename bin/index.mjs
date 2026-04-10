#!/usr/bin/env node
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import path, { basename, dirname, join, resolve } from "node:path";
import fs, { existsSync, lstatSync, mkdirSync, readdirSync } from "node:fs";
import { copyFile, mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import fs$1 from "fs/promises";
import path$1 from "path";
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esmMin = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __toCommonJS = (mod) => __hasOwnProp.call(mod, "module.exports") ? mod["module.exports"] : __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
	if (typeof require !== "undefined") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + x + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
//#endregion
//#region node_modules/.pnpm/validate-npm-package-name@7.0.2/node_modules/validate-npm-package-name/lib/builtin-modules.json
var builtin_modules_exports = /* @__PURE__ */ __exportAll({ default: () => builtin_modules_default });
var builtin_modules_default;
var init_builtin_modules = __esmMin((() => {
	builtin_modules_default = [
		"_http_agent",
		"_http_client",
		"_http_common",
		"_http_incoming",
		"_http_outgoing",
		"_http_server",
		"_stream_duplex",
		"_stream_passthrough",
		"_stream_readable",
		"_stream_transform",
		"_stream_wrap",
		"_stream_writable",
		"_tls_common",
		"_tls_wrap",
		"assert",
		"assert/strict",
		"async_hooks",
		"buffer",
		"child_process",
		"cluster",
		"console",
		"constants",
		"crypto",
		"dgram",
		"diagnostics_channel",
		"dns",
		"dns/promises",
		"domain",
		"events",
		"fs",
		"fs/promises",
		"http",
		"http2",
		"https",
		"inspector",
		"inspector/promises",
		"module",
		"net",
		"os",
		"path",
		"path/posix",
		"path/win32",
		"perf_hooks",
		"process",
		"punycode",
		"querystring",
		"readline",
		"readline/promises",
		"repl",
		"stream",
		"stream/consumers",
		"stream/promises",
		"stream/web",
		"string_decoder",
		"sys",
		"timers",
		"timers/promises",
		"tls",
		"trace_events",
		"tty",
		"url",
		"util",
		"util/types",
		"v8",
		"vm",
		"wasi",
		"worker_threads",
		"zlib",
		"node:sea",
		"node:sqlite",
		"node:test",
		"node:test/reporters"
	];
}));
//#endregion
//#region src/helper/validate-npm-name.ts
var import_lib = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var builtins = (init_builtin_modules(), __toCommonJS(builtin_modules_exports).default);
	var scopedPackagePattern = /* @__PURE__ */ new RegExp("^(?:@([^/]+?)[/])?([^/]+?)$");
	var exclusionList = ["node_modules", "favicon.ico"];
	function validate(name) {
		var warnings = [];
		var errors = [];
		if (name === null) {
			errors.push("name cannot be null");
			return done(warnings, errors);
		}
		if (name === void 0) {
			errors.push("name cannot be undefined");
			return done(warnings, errors);
		}
		if (typeof name !== "string") {
			errors.push("name must be a string");
			return done(warnings, errors);
		}
		if (!name.length) errors.push("name length must be greater than zero");
		if (name.startsWith(".")) errors.push("name cannot start with a period");
		if (name.startsWith("-")) errors.push("name cannot start with a hyphen");
		if (name.match(/^_/)) errors.push("name cannot start with an underscore");
		if (name.trim() !== name) errors.push("name cannot contain leading or trailing spaces");
		exclusionList.forEach(function(excludedName) {
			if (name.toLowerCase() === excludedName) errors.push(excludedName + " is not a valid package name");
		});
		if (builtins.includes(name.toLowerCase())) warnings.push(name + " is a core module name");
		if (name.length > 214) warnings.push("name can no longer contain more than 214 characters");
		if (name.toLowerCase() !== name) warnings.push("name can no longer contain capital letters");
		if (/[~'!()*]/.test(name.split("/").slice(-1)[0])) warnings.push("name can no longer contain special characters (\"~'!()*\")");
		if (encodeURIComponent(name) !== name) {
			var nameMatch = name.match(scopedPackagePattern);
			if (nameMatch) {
				var user = nameMatch[1];
				var pkg = nameMatch[2];
				if (pkg.startsWith(".")) errors.push("name cannot start with a period");
				if (encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg) return done(warnings, errors);
			}
			errors.push("name can only contain URL-friendly characters");
		}
		return done(warnings, errors);
	}
	var done = function(warnings, errors) {
		var result = {
			validForNewPackages: errors.length === 0 && warnings.length === 0,
			validForOldPackages: errors.length === 0,
			warnings,
			errors
		};
		if (!result.warnings.length) delete result.warnings;
		if (!result.errors.length) delete result.errors;
		return result;
	};
	module.exports = validate;
})))(), 1);
function validateNpmName(name) {
	const nameValidation = (0, import_lib.default)(name);
	if (nameValidation.validForNewPackages) return { valid: true };
	return {
		valid: false,
		problems: [...nameValidation.errors ?? [], ...nameValidation.warnings ?? []]
	};
}
//#endregion
//#region src/utils/is.ts
var import_picocolors_browser = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var x = String;
	var create = function() {
		return {
			isColorSupported: false,
			reset: x,
			bold: x,
			dim: x,
			italic: x,
			underline: x,
			inverse: x,
			hidden: x,
			strikethrough: x,
			black: x,
			red: x,
			green: x,
			yellow: x,
			blue: x,
			magenta: x,
			cyan: x,
			white: x,
			gray: x,
			bgBlack: x,
			bgRed: x,
			bgGreen: x,
			bgYellow: x,
			bgBlue: x,
			bgMagenta: x,
			bgCyan: x,
			bgWhite: x,
			blackBright: x,
			redBright: x,
			greenBright: x,
			yellowBright: x,
			blueBright: x,
			magentaBright: x,
			cyanBright: x,
			whiteBright: x,
			bgBlackBright: x,
			bgRedBright: x,
			bgGreenBright: x,
			bgYellowBright: x,
			bgBlueBright: x,
			bgMagentaBright: x,
			bgCyanBright: x,
			bgWhiteBright: x
		};
	};
	module.exports = create();
	module.exports.createColors = create;
})))();
function isNull(value) {
	return value === null;
}
function isUndefined(value) {
	return value === void 0;
}
function isString(value) {
	return typeof value === "string";
}
//#endregion
//#region src/utils/option.ts
var basic$1 = {
	OPTION_SOME: "some",
	OPTION_NONE: "none"
};
var optionUtility = (function() {
	const { OPTION_SOME, OPTION_NONE } = basic$1;
	const createSome = (value) => {
		return Object.freeze({
			kind: OPTION_SOME,
			isSome: true,
			isNone: false,
			value
		});
	};
	const createNone = () => {
		return Object.freeze({
			kind: OPTION_NONE,
			isSome: false,
			isNone: true
		});
	};
	const optionConversion = (value) => {
		if (isNull(value) || isUndefined(value)) return createNone();
		return createSome(value);
	};
	return Object.freeze({
		createSome,
		createNone,
		optionConversion
	});
})();
//#endregion
//#region node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/error.js
var require_error$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* CommanderError class
	*/
	var CommanderError = class extends Error {
		/**
		* Constructs the CommanderError class
		* @param {number} exitCode suggested exit code which could be used with process.exit
		* @param {string} code an id string representing the error
		* @param {string} message human-readable description of the error
		*/
		constructor(exitCode, code, message) {
			super(message);
			Error.captureStackTrace(this, this.constructor);
			this.name = this.constructor.name;
			this.code = code;
			this.exitCode = exitCode;
			this.nestedError = void 0;
		}
	};
	/**
	* InvalidArgumentError class
	*/
	var InvalidArgumentError = class extends CommanderError {
		/**
		* Constructs the InvalidArgumentError class
		* @param {string} [message] explanation of why argument is invalid
		*/
		constructor(message) {
			super(1, "commander.invalidArgument", message);
			Error.captureStackTrace(this, this.constructor);
			this.name = this.constructor.name;
		}
	};
	exports.CommanderError = CommanderError;
	exports.InvalidArgumentError = InvalidArgumentError;
}));
//#endregion
//#region node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/argument.js
var require_argument = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { InvalidArgumentError } = require_error$1();
	var Argument = class {
		/**
		* Initialize a new command argument with the given name and description.
		* The default is that the argument is required, and you can explicitly
		* indicate this with <> around the name. Put [] around the name for an optional argument.
		*
		* @param {string} name
		* @param {string} [description]
		*/
		constructor(name, description) {
			this.description = description || "";
			this.variadic = false;
			this.parseArg = void 0;
			this.defaultValue = void 0;
			this.defaultValueDescription = void 0;
			this.argChoices = void 0;
			switch (name[0]) {
				case "<":
					this.required = true;
					this._name = name.slice(1, -1);
					break;
				case "[":
					this.required = false;
					this._name = name.slice(1, -1);
					break;
				default:
					this.required = true;
					this._name = name;
					break;
			}
			if (this._name.endsWith("...")) {
				this.variadic = true;
				this._name = this._name.slice(0, -3);
			}
		}
		/**
		* Return argument name.
		*
		* @return {string}
		*/
		name() {
			return this._name;
		}
		/**
		* @package
		*/
		_collectValue(value, previous) {
			if (previous === this.defaultValue || !Array.isArray(previous)) return [value];
			previous.push(value);
			return previous;
		}
		/**
		* Set the default value, and optionally supply the description to be displayed in the help.
		*
		* @param {*} value
		* @param {string} [description]
		* @return {Argument}
		*/
		default(value, description) {
			this.defaultValue = value;
			this.defaultValueDescription = description;
			return this;
		}
		/**
		* Set the custom handler for processing CLI command arguments into argument values.
		*
		* @param {Function} [fn]
		* @return {Argument}
		*/
		argParser(fn) {
			this.parseArg = fn;
			return this;
		}
		/**
		* Only allow argument value to be one of choices.
		*
		* @param {string[]} values
		* @return {Argument}
		*/
		choices(values) {
			this.argChoices = values.slice();
			this.parseArg = (arg, previous) => {
				if (!this.argChoices.includes(arg)) throw new InvalidArgumentError(`Allowed choices are ${this.argChoices.join(", ")}.`);
				if (this.variadic) return this._collectValue(arg, previous);
				return arg;
			};
			return this;
		}
		/**
		* Make argument required.
		*
		* @returns {Argument}
		*/
		argRequired() {
			this.required = true;
			return this;
		}
		/**
		* Make argument optional.
		*
		* @returns {Argument}
		*/
		argOptional() {
			this.required = false;
			return this;
		}
	};
	/**
	* Takes an argument and returns its human readable equivalent for help usage.
	*
	* @param {Argument} arg
	* @return {string}
	* @private
	*/
	function humanReadableArgName(arg) {
		const nameOutput = arg.name() + (arg.variadic === true ? "..." : "");
		return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
	}
	exports.Argument = Argument;
	exports.humanReadableArgName = humanReadableArgName;
}));
//#endregion
//#region node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/help.js
var require_help = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { humanReadableArgName } = require_argument();
	/**
	* TypeScript import types for JSDoc, used by Visual Studio Code IntelliSense and `npm run typescript-checkJS`
	* https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types
	* @typedef { import("./argument.js").Argument } Argument
	* @typedef { import("./command.js").Command } Command
	* @typedef { import("./option.js").Option } Option
	*/
	var Help = class {
		constructor() {
			this.helpWidth = void 0;
			this.minWidthToWrap = 40;
			this.sortSubcommands = false;
			this.sortOptions = false;
			this.showGlobalOptions = false;
		}
		/**
		* prepareContext is called by Commander after applying overrides from `Command.configureHelp()`
		* and just before calling `formatHelp()`.
		*
		* Commander just uses the helpWidth and the rest is provided for optional use by more complex subclasses.
		*
		* @param {{ error?: boolean, helpWidth?: number, outputHasColors?: boolean }} contextOptions
		*/
		prepareContext(contextOptions) {
			this.helpWidth = this.helpWidth ?? contextOptions.helpWidth ?? 80;
		}
		/**
		* Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
		*
		* @param {Command} cmd
		* @returns {Command[]}
		*/
		visibleCommands(cmd) {
			const visibleCommands = cmd.commands.filter((cmd) => !cmd._hidden);
			const helpCommand = cmd._getHelpCommand();
			if (helpCommand && !helpCommand._hidden) visibleCommands.push(helpCommand);
			if (this.sortSubcommands) visibleCommands.sort((a, b) => {
				return a.name().localeCompare(b.name());
			});
			return visibleCommands;
		}
		/**
		* Compare options for sort.
		*
		* @param {Option} a
		* @param {Option} b
		* @returns {number}
		*/
		compareOptions(a, b) {
			const getSortKey = (option) => {
				return option.short ? option.short.replace(/^-/, "") : option.long.replace(/^--/, "");
			};
			return getSortKey(a).localeCompare(getSortKey(b));
		}
		/**
		* Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
		*
		* @param {Command} cmd
		* @returns {Option[]}
		*/
		visibleOptions(cmd) {
			const visibleOptions = cmd.options.filter((option) => !option.hidden);
			const helpOption = cmd._getHelpOption();
			if (helpOption && !helpOption.hidden) {
				const removeShort = helpOption.short && cmd._findOption(helpOption.short);
				const removeLong = helpOption.long && cmd._findOption(helpOption.long);
				if (!removeShort && !removeLong) visibleOptions.push(helpOption);
				else if (helpOption.long && !removeLong) visibleOptions.push(cmd.createOption(helpOption.long, helpOption.description));
				else if (helpOption.short && !removeShort) visibleOptions.push(cmd.createOption(helpOption.short, helpOption.description));
			}
			if (this.sortOptions) visibleOptions.sort(this.compareOptions);
			return visibleOptions;
		}
		/**
		* Get an array of the visible global options. (Not including help.)
		*
		* @param {Command} cmd
		* @returns {Option[]}
		*/
		visibleGlobalOptions(cmd) {
			if (!this.showGlobalOptions) return [];
			const globalOptions = [];
			for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
				const visibleOptions = ancestorCmd.options.filter((option) => !option.hidden);
				globalOptions.push(...visibleOptions);
			}
			if (this.sortOptions) globalOptions.sort(this.compareOptions);
			return globalOptions;
		}
		/**
		* Get an array of the arguments if any have a description.
		*
		* @param {Command} cmd
		* @returns {Argument[]}
		*/
		visibleArguments(cmd) {
			if (cmd._argsDescription) cmd.registeredArguments.forEach((argument) => {
				argument.description = argument.description || cmd._argsDescription[argument.name()] || "";
			});
			if (cmd.registeredArguments.find((argument) => argument.description)) return cmd.registeredArguments;
			return [];
		}
		/**
		* Get the command term to show in the list of subcommands.
		*
		* @param {Command} cmd
		* @returns {string}
		*/
		subcommandTerm(cmd) {
			const args = cmd.registeredArguments.map((arg) => humanReadableArgName(arg)).join(" ");
			return cmd._name + (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") + (cmd.options.length ? " [options]" : "") + (args ? " " + args : "");
		}
		/**
		* Get the option term to show in the list of options.
		*
		* @param {Option} option
		* @returns {string}
		*/
		optionTerm(option) {
			return option.flags;
		}
		/**
		* Get the argument term to show in the list of arguments.
		*
		* @param {Argument} argument
		* @returns {string}
		*/
		argumentTerm(argument) {
			return argument.name();
		}
		/**
		* Get the longest command term length.
		*
		* @param {Command} cmd
		* @param {Help} helper
		* @returns {number}
		*/
		longestSubcommandTermLength(cmd, helper) {
			return helper.visibleCommands(cmd).reduce((max, command) => {
				return Math.max(max, this.displayWidth(helper.styleSubcommandTerm(helper.subcommandTerm(command))));
			}, 0);
		}
		/**
		* Get the longest option term length.
		*
		* @param {Command} cmd
		* @param {Help} helper
		* @returns {number}
		*/
		longestOptionTermLength(cmd, helper) {
			return helper.visibleOptions(cmd).reduce((max, option) => {
				return Math.max(max, this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option))));
			}, 0);
		}
		/**
		* Get the longest global option term length.
		*
		* @param {Command} cmd
		* @param {Help} helper
		* @returns {number}
		*/
		longestGlobalOptionTermLength(cmd, helper) {
			return helper.visibleGlobalOptions(cmd).reduce((max, option) => {
				return Math.max(max, this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option))));
			}, 0);
		}
		/**
		* Get the longest argument term length.
		*
		* @param {Command} cmd
		* @param {Help} helper
		* @returns {number}
		*/
		longestArgumentTermLength(cmd, helper) {
			return helper.visibleArguments(cmd).reduce((max, argument) => {
				return Math.max(max, this.displayWidth(helper.styleArgumentTerm(helper.argumentTerm(argument))));
			}, 0);
		}
		/**
		* Get the command usage to be displayed at the top of the built-in help.
		*
		* @param {Command} cmd
		* @returns {string}
		*/
		commandUsage(cmd) {
			let cmdName = cmd._name;
			if (cmd._aliases[0]) cmdName = cmdName + "|" + cmd._aliases[0];
			let ancestorCmdNames = "";
			for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) ancestorCmdNames = ancestorCmd.name() + " " + ancestorCmdNames;
			return ancestorCmdNames + cmdName + " " + cmd.usage();
		}
		/**
		* Get the description for the command.
		*
		* @param {Command} cmd
		* @returns {string}
		*/
		commandDescription(cmd) {
			return cmd.description();
		}
		/**
		* Get the subcommand summary to show in the list of subcommands.
		* (Fallback to description for backwards compatibility.)
		*
		* @param {Command} cmd
		* @returns {string}
		*/
		subcommandDescription(cmd) {
			return cmd.summary() || cmd.description();
		}
		/**
		* Get the option description to show in the list of options.
		*
		* @param {Option} option
		* @return {string}
		*/
		optionDescription(option) {
			const extraInfo = [];
			if (option.argChoices) extraInfo.push(`choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`);
			if (option.defaultValue !== void 0) {
				if (option.required || option.optional || option.isBoolean() && typeof option.defaultValue === "boolean") extraInfo.push(`default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`);
			}
			if (option.presetArg !== void 0 && option.optional) extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
			if (option.envVar !== void 0) extraInfo.push(`env: ${option.envVar}`);
			if (extraInfo.length > 0) {
				const extraDescription = `(${extraInfo.join(", ")})`;
				if (option.description) return `${option.description} ${extraDescription}`;
				return extraDescription;
			}
			return option.description;
		}
		/**
		* Get the argument description to show in the list of arguments.
		*
		* @param {Argument} argument
		* @return {string}
		*/
		argumentDescription(argument) {
			const extraInfo = [];
			if (argument.argChoices) extraInfo.push(`choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`);
			if (argument.defaultValue !== void 0) extraInfo.push(`default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`);
			if (extraInfo.length > 0) {
				const extraDescription = `(${extraInfo.join(", ")})`;
				if (argument.description) return `${argument.description} ${extraDescription}`;
				return extraDescription;
			}
			return argument.description;
		}
		/**
		* Format a list of items, given a heading and an array of formatted items.
		*
		* @param {string} heading
		* @param {string[]} items
		* @param {Help} helper
		* @returns string[]
		*/
		formatItemList(heading, items, helper) {
			if (items.length === 0) return [];
			return [
				helper.styleTitle(heading),
				...items,
				""
			];
		}
		/**
		* Group items by their help group heading.
		*
		* @param {Command[] | Option[]} unsortedItems
		* @param {Command[] | Option[]} visibleItems
		* @param {Function} getGroup
		* @returns {Map<string, Command[] | Option[]>}
		*/
		groupItems(unsortedItems, visibleItems, getGroup) {
			const result = /* @__PURE__ */ new Map();
			unsortedItems.forEach((item) => {
				const group = getGroup(item);
				if (!result.has(group)) result.set(group, []);
			});
			visibleItems.forEach((item) => {
				const group = getGroup(item);
				if (!result.has(group)) result.set(group, []);
				result.get(group).push(item);
			});
			return result;
		}
		/**
		* Generate the built-in help text.
		*
		* @param {Command} cmd
		* @param {Help} helper
		* @returns {string}
		*/
		formatHelp(cmd, helper) {
			const termWidth = helper.padWidth(cmd, helper);
			const helpWidth = helper.helpWidth ?? 80;
			function callFormatItem(term, description) {
				return helper.formatItem(term, termWidth, description, helper);
			}
			let output = [`${helper.styleTitle("Usage:")} ${helper.styleUsage(helper.commandUsage(cmd))}`, ""];
			const commandDescription = helper.commandDescription(cmd);
			if (commandDescription.length > 0) output = output.concat([helper.boxWrap(helper.styleCommandDescription(commandDescription), helpWidth), ""]);
			const argumentList = helper.visibleArguments(cmd).map((argument) => {
				return callFormatItem(helper.styleArgumentTerm(helper.argumentTerm(argument)), helper.styleArgumentDescription(helper.argumentDescription(argument)));
			});
			output = output.concat(this.formatItemList("Arguments:", argumentList, helper));
			this.groupItems(cmd.options, helper.visibleOptions(cmd), (option) => option.helpGroupHeading ?? "Options:").forEach((options, group) => {
				const optionList = options.map((option) => {
					return callFormatItem(helper.styleOptionTerm(helper.optionTerm(option)), helper.styleOptionDescription(helper.optionDescription(option)));
				});
				output = output.concat(this.formatItemList(group, optionList, helper));
			});
			if (helper.showGlobalOptions) {
				const globalOptionList = helper.visibleGlobalOptions(cmd).map((option) => {
					return callFormatItem(helper.styleOptionTerm(helper.optionTerm(option)), helper.styleOptionDescription(helper.optionDescription(option)));
				});
				output = output.concat(this.formatItemList("Global Options:", globalOptionList, helper));
			}
			this.groupItems(cmd.commands, helper.visibleCommands(cmd), (sub) => sub.helpGroup() || "Commands:").forEach((commands, group) => {
				const commandList = commands.map((sub) => {
					return callFormatItem(helper.styleSubcommandTerm(helper.subcommandTerm(sub)), helper.styleSubcommandDescription(helper.subcommandDescription(sub)));
				});
				output = output.concat(this.formatItemList(group, commandList, helper));
			});
			return output.join("\n");
		}
		/**
		* Return display width of string, ignoring ANSI escape sequences. Used in padding and wrapping calculations.
		*
		* @param {string} str
		* @returns {number}
		*/
		displayWidth(str) {
			return stripColor(str).length;
		}
		/**
		* Style the title for displaying in the help. Called with 'Usage:', 'Options:', etc.
		*
		* @param {string} str
		* @returns {string}
		*/
		styleTitle(str) {
			return str;
		}
		styleUsage(str) {
			return str.split(" ").map((word) => {
				if (word === "[options]") return this.styleOptionText(word);
				if (word === "[command]") return this.styleSubcommandText(word);
				if (word[0] === "[" || word[0] === "<") return this.styleArgumentText(word);
				return this.styleCommandText(word);
			}).join(" ");
		}
		styleCommandDescription(str) {
			return this.styleDescriptionText(str);
		}
		styleOptionDescription(str) {
			return this.styleDescriptionText(str);
		}
		styleSubcommandDescription(str) {
			return this.styleDescriptionText(str);
		}
		styleArgumentDescription(str) {
			return this.styleDescriptionText(str);
		}
		styleDescriptionText(str) {
			return str;
		}
		styleOptionTerm(str) {
			return this.styleOptionText(str);
		}
		styleSubcommandTerm(str) {
			return str.split(" ").map((word) => {
				if (word === "[options]") return this.styleOptionText(word);
				if (word[0] === "[" || word[0] === "<") return this.styleArgumentText(word);
				return this.styleSubcommandText(word);
			}).join(" ");
		}
		styleArgumentTerm(str) {
			return this.styleArgumentText(str);
		}
		styleOptionText(str) {
			return str;
		}
		styleArgumentText(str) {
			return str;
		}
		styleSubcommandText(str) {
			return str;
		}
		styleCommandText(str) {
			return str;
		}
		/**
		* Calculate the pad width from the maximum term length.
		*
		* @param {Command} cmd
		* @param {Help} helper
		* @returns {number}
		*/
		padWidth(cmd, helper) {
			return Math.max(helper.longestOptionTermLength(cmd, helper), helper.longestGlobalOptionTermLength(cmd, helper), helper.longestSubcommandTermLength(cmd, helper), helper.longestArgumentTermLength(cmd, helper));
		}
		/**
		* Detect manually wrapped and indented strings by checking for line break followed by whitespace.
		*
		* @param {string} str
		* @returns {boolean}
		*/
		preformatted(str) {
			return /\n[^\S\r\n]/.test(str);
		}
		/**
		* Format the "item", which consists of a term and description. Pad the term and wrap the description, indenting the following lines.
		*
		* So "TTT", 5, "DDD DDDD DD DDD" might be formatted for this.helpWidth=17 like so:
		*   TTT  DDD DDDD
		*        DD DDD
		*
		* @param {string} term
		* @param {number} termWidth
		* @param {string} description
		* @param {Help} helper
		* @returns {string}
		*/
		formatItem(term, termWidth, description, helper) {
			const itemIndent = 2;
			const itemIndentStr = " ".repeat(itemIndent);
			if (!description) return itemIndentStr + term;
			const paddedTerm = term.padEnd(termWidth + term.length - helper.displayWidth(term));
			const spacerWidth = 2;
			const remainingWidth = (this.helpWidth ?? 80) - termWidth - spacerWidth - itemIndent;
			let formattedDescription;
			if (remainingWidth < this.minWidthToWrap || helper.preformatted(description)) formattedDescription = description;
			else formattedDescription = helper.boxWrap(description, remainingWidth).replace(/\n/g, "\n" + " ".repeat(termWidth + spacerWidth));
			return itemIndentStr + paddedTerm + " ".repeat(spacerWidth) + formattedDescription.replace(/\n/g, `\n${itemIndentStr}`);
		}
		/**
		* Wrap a string at whitespace, preserving existing line breaks.
		* Wrapping is skipped if the width is less than `minWidthToWrap`.
		*
		* @param {string} str
		* @param {number} width
		* @returns {string}
		*/
		boxWrap(str, width) {
			if (width < this.minWidthToWrap) return str;
			const rawLines = str.split(/\r\n|\n/);
			const chunkPattern = /[\s]*[^\s]+/g;
			const wrappedLines = [];
			rawLines.forEach((line) => {
				const chunks = line.match(chunkPattern);
				if (chunks === null) {
					wrappedLines.push("");
					return;
				}
				let sumChunks = [chunks.shift()];
				let sumWidth = this.displayWidth(sumChunks[0]);
				chunks.forEach((chunk) => {
					const visibleWidth = this.displayWidth(chunk);
					if (sumWidth + visibleWidth <= width) {
						sumChunks.push(chunk);
						sumWidth += visibleWidth;
						return;
					}
					wrappedLines.push(sumChunks.join(""));
					const nextChunk = chunk.trimStart();
					sumChunks = [nextChunk];
					sumWidth = this.displayWidth(nextChunk);
				});
				wrappedLines.push(sumChunks.join(""));
			});
			return wrappedLines.join("\n");
		}
	};
	/**
	* Strip style ANSI escape sequences from the string. In particular, SGR (Select Graphic Rendition) codes.
	*
	* @param {string} str
	* @returns {string}
	* @package
	*/
	function stripColor(str) {
		return str.replace(/\x1b\[\d*(;\d*)*m/g, "");
	}
	exports.Help = Help;
	exports.stripColor = stripColor;
}));
//#endregion
//#region node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/option.js
var require_option = /* @__PURE__ */ __commonJSMin(((exports) => {
	var { InvalidArgumentError } = require_error$1();
	var Option = class {
		/**
		* Initialize a new `Option` with the given `flags` and `description`.
		*
		* @param {string} flags
		* @param {string} [description]
		*/
		constructor(flags, description) {
			this.flags = flags;
			this.description = description || "";
			this.required = flags.includes("<");
			this.optional = flags.includes("[");
			this.variadic = /\w\.\.\.[>\]]$/.test(flags);
			this.mandatory = false;
			const optionFlags = splitOptionFlags(flags);
			this.short = optionFlags.shortFlag;
			this.long = optionFlags.longFlag;
			this.negate = false;
			if (this.long) this.negate = this.long.startsWith("--no-");
			this.defaultValue = void 0;
			this.defaultValueDescription = void 0;
			this.presetArg = void 0;
			this.envVar = void 0;
			this.parseArg = void 0;
			this.hidden = false;
			this.argChoices = void 0;
			this.conflictsWith = [];
			this.implied = void 0;
			this.helpGroupHeading = void 0;
		}
		/**
		* Set the default value, and optionally supply the description to be displayed in the help.
		*
		* @param {*} value
		* @param {string} [description]
		* @return {Option}
		*/
		default(value, description) {
			this.defaultValue = value;
			this.defaultValueDescription = description;
			return this;
		}
		/**
		* Preset to use when option used without option-argument, especially optional but also boolean and negated.
		* The custom processing (parseArg) is called.
		*
		* @example
		* new Option('--color').default('GREYSCALE').preset('RGB');
		* new Option('--donate [amount]').preset('20').argParser(parseFloat);
		*
		* @param {*} arg
		* @return {Option}
		*/
		preset(arg) {
			this.presetArg = arg;
			return this;
		}
		/**
		* Add option name(s) that conflict with this option.
		* An error will be displayed if conflicting options are found during parsing.
		*
		* @example
		* new Option('--rgb').conflicts('cmyk');
		* new Option('--js').conflicts(['ts', 'jsx']);
		*
		* @param {(string | string[])} names
		* @return {Option}
		*/
		conflicts(names) {
			this.conflictsWith = this.conflictsWith.concat(names);
			return this;
		}
		/**
		* Specify implied option values for when this option is set and the implied options are not.
		*
		* The custom processing (parseArg) is not called on the implied values.
		*
		* @example
		* program
		*   .addOption(new Option('--log', 'write logging information to file'))
		*   .addOption(new Option('--trace', 'log extra details').implies({ log: 'trace.txt' }));
		*
		* @param {object} impliedOptionValues
		* @return {Option}
		*/
		implies(impliedOptionValues) {
			let newImplied = impliedOptionValues;
			if (typeof impliedOptionValues === "string") newImplied = { [impliedOptionValues]: true };
			this.implied = Object.assign(this.implied || {}, newImplied);
			return this;
		}
		/**
		* Set environment variable to check for option value.
		*
		* An environment variable is only used if when processed the current option value is
		* undefined, or the source of the current value is 'default' or 'config' or 'env'.
		*
		* @param {string} name
		* @return {Option}
		*/
		env(name) {
			this.envVar = name;
			return this;
		}
		/**
		* Set the custom handler for processing CLI option arguments into option values.
		*
		* @param {Function} [fn]
		* @return {Option}
		*/
		argParser(fn) {
			this.parseArg = fn;
			return this;
		}
		/**
		* Whether the option is mandatory and must have a value after parsing.
		*
		* @param {boolean} [mandatory=true]
		* @return {Option}
		*/
		makeOptionMandatory(mandatory = true) {
			this.mandatory = !!mandatory;
			return this;
		}
		/**
		* Hide option in help.
		*
		* @param {boolean} [hide=true]
		* @return {Option}
		*/
		hideHelp(hide = true) {
			this.hidden = !!hide;
			return this;
		}
		/**
		* @package
		*/
		_collectValue(value, previous) {
			if (previous === this.defaultValue || !Array.isArray(previous)) return [value];
			previous.push(value);
			return previous;
		}
		/**
		* Only allow option value to be one of choices.
		*
		* @param {string[]} values
		* @return {Option}
		*/
		choices(values) {
			this.argChoices = values.slice();
			this.parseArg = (arg, previous) => {
				if (!this.argChoices.includes(arg)) throw new InvalidArgumentError(`Allowed choices are ${this.argChoices.join(", ")}.`);
				if (this.variadic) return this._collectValue(arg, previous);
				return arg;
			};
			return this;
		}
		/**
		* Return option name.
		*
		* @return {string}
		*/
		name() {
			if (this.long) return this.long.replace(/^--/, "");
			return this.short.replace(/^-/, "");
		}
		/**
		* Return option name, in a camelcase format that can be used
		* as an object attribute key.
		*
		* @return {string}
		*/
		attributeName() {
			if (this.negate) return camelcase(this.name().replace(/^no-/, ""));
			return camelcase(this.name());
		}
		/**
		* Set the help group heading.
		*
		* @param {string} heading
		* @return {Option}
		*/
		helpGroup(heading) {
			this.helpGroupHeading = heading;
			return this;
		}
		/**
		* Check if `arg` matches the short or long flag.
		*
		* @param {string} arg
		* @return {boolean}
		* @package
		*/
		is(arg) {
			return this.short === arg || this.long === arg;
		}
		/**
		* Return whether a boolean option.
		*
		* Options are one of boolean, negated, required argument, or optional argument.
		*
		* @return {boolean}
		* @package
		*/
		isBoolean() {
			return !this.required && !this.optional && !this.negate;
		}
	};
	/**
	* This class is to make it easier to work with dual options, without changing the existing
	* implementation. We support separate dual options for separate positive and negative options,
	* like `--build` and `--no-build`, which share a single option value. This works nicely for some
	* use cases, but is tricky for others where we want separate behaviours despite
	* the single shared option value.
	*/
	var DualOptions = class {
		/**
		* @param {Option[]} options
		*/
		constructor(options) {
			this.positiveOptions = /* @__PURE__ */ new Map();
			this.negativeOptions = /* @__PURE__ */ new Map();
			this.dualOptions = /* @__PURE__ */ new Set();
			options.forEach((option) => {
				if (option.negate) this.negativeOptions.set(option.attributeName(), option);
				else this.positiveOptions.set(option.attributeName(), option);
			});
			this.negativeOptions.forEach((value, key) => {
				if (this.positiveOptions.has(key)) this.dualOptions.add(key);
			});
		}
		/**
		* Did the value come from the option, and not from possible matching dual option?
		*
		* @param {*} value
		* @param {Option} option
		* @returns {boolean}
		*/
		valueFromOption(value, option) {
			const optionKey = option.attributeName();
			if (!this.dualOptions.has(optionKey)) return true;
			const preset = this.negativeOptions.get(optionKey).presetArg;
			const negativeValue = preset !== void 0 ? preset : false;
			return option.negate === (negativeValue === value);
		}
	};
	/**
	* Convert string from kebab-case to camelCase.
	*
	* @param {string} str
	* @return {string}
	* @private
	*/
	function camelcase(str) {
		return str.split("-").reduce((str, word) => {
			return str + word[0].toUpperCase() + word.slice(1);
		});
	}
	/**
	* Split the short and long flag out of something like '-m,--mixed <value>'
	*
	* @private
	*/
	function splitOptionFlags(flags) {
		let shortFlag;
		let longFlag;
		const shortFlagExp = /^-[^-]$/;
		const longFlagExp = /^--[^-]/;
		const flagParts = flags.split(/[ |,]+/).concat("guard");
		if (shortFlagExp.test(flagParts[0])) shortFlag = flagParts.shift();
		if (longFlagExp.test(flagParts[0])) longFlag = flagParts.shift();
		if (!shortFlag && shortFlagExp.test(flagParts[0])) shortFlag = flagParts.shift();
		if (!shortFlag && longFlagExp.test(flagParts[0])) {
			shortFlag = longFlag;
			longFlag = flagParts.shift();
		}
		if (flagParts[0].startsWith("-")) {
			const unsupportedFlag = flagParts[0];
			const baseError = `option creation failed due to '${unsupportedFlag}' in option flags '${flags}'`;
			if (/^-[^-][^-]/.test(unsupportedFlag)) throw new Error(`${baseError}
- a short flag is a single dash and a single character
  - either use a single dash and a single character (for a short flag)
  - or use a double dash for a long option (and can have two, like '--ws, --workspace')`);
			if (shortFlagExp.test(unsupportedFlag)) throw new Error(`${baseError}
- too many short flags`);
			if (longFlagExp.test(unsupportedFlag)) throw new Error(`${baseError}
- too many long flags`);
			throw new Error(`${baseError}
- unrecognised flag format`);
		}
		if (shortFlag === void 0 && longFlag === void 0) throw new Error(`option creation failed due to no flags found in '${flags}'.`);
		return {
			shortFlag,
			longFlag
		};
	}
	exports.Option = Option;
	exports.DualOptions = DualOptions;
}));
//#endregion
//#region node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/suggestSimilar.js
var require_suggestSimilar = /* @__PURE__ */ __commonJSMin(((exports) => {
	var maxDistance = 3;
	function editDistance(a, b) {
		if (Math.abs(a.length - b.length) > maxDistance) return Math.max(a.length, b.length);
		const d = [];
		for (let i = 0; i <= a.length; i++) d[i] = [i];
		for (let j = 0; j <= b.length; j++) d[0][j] = j;
		for (let j = 1; j <= b.length; j++) for (let i = 1; i <= a.length; i++) {
			let cost = 1;
			if (a[i - 1] === b[j - 1]) cost = 0;
			else cost = 1;
			d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
			if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
		}
		return d[a.length][b.length];
	}
	/**
	* Find close matches, restricted to same number of edits.
	*
	* @param {string} word
	* @param {string[]} candidates
	* @returns {string}
	*/
	function suggestSimilar(word, candidates) {
		if (!candidates || candidates.length === 0) return "";
		candidates = Array.from(new Set(candidates));
		const searchingOptions = word.startsWith("--");
		if (searchingOptions) {
			word = word.slice(2);
			candidates = candidates.map((candidate) => candidate.slice(2));
		}
		let similar = [];
		let bestDistance = maxDistance;
		const minSimilarity = .4;
		candidates.forEach((candidate) => {
			if (candidate.length <= 1) return;
			const distance = editDistance(word, candidate);
			const length = Math.max(word.length, candidate.length);
			if ((length - distance) / length > minSimilarity) {
				if (distance < bestDistance) {
					bestDistance = distance;
					similar = [candidate];
				} else if (distance === bestDistance) similar.push(candidate);
			}
		});
		similar.sort((a, b) => a.localeCompare(b));
		if (searchingOptions) similar = similar.map((candidate) => `--${candidate}`);
		if (similar.length > 1) return `\n(Did you mean one of ${similar.join(", ")}?)`;
		if (similar.length === 1) return `\n(Did you mean ${similar[0]}?)`;
		return "";
	}
	exports.suggestSimilar = suggestSimilar;
}));
//#endregion
//#region node_modules/.pnpm/commander@14.0.3/node_modules/commander/lib/command.js
var require_command = /* @__PURE__ */ __commonJSMin(((exports) => {
	var EventEmitter$2 = __require("node:events").EventEmitter;
	var childProcess = __require("node:child_process");
	var path$11 = __require("node:path");
	var fs$5 = __require("node:fs");
	var process$1 = __require("node:process");
	var { Argument, humanReadableArgName } = require_argument();
	var { CommanderError } = require_error$1();
	var { Help, stripColor } = require_help();
	var { Option, DualOptions } = require_option();
	var { suggestSimilar } = require_suggestSimilar();
	var Command = class Command extends EventEmitter$2 {
		/**
		* Initialize a new `Command`.
		*
		* @param {string} [name]
		*/
		constructor(name) {
			super();
			/** @type {Command[]} */
			this.commands = [];
			/** @type {Option[]} */
			this.options = [];
			this.parent = null;
			this._allowUnknownOption = false;
			this._allowExcessArguments = false;
			/** @type {Argument[]} */
			this.registeredArguments = [];
			this._args = this.registeredArguments;
			/** @type {string[]} */
			this.args = [];
			this.rawArgs = [];
			this.processedArgs = [];
			this._scriptPath = null;
			this._name = name || "";
			this._optionValues = {};
			this._optionValueSources = {};
			this._storeOptionsAsProperties = false;
			this._actionHandler = null;
			this._executableHandler = false;
			this._executableFile = null;
			this._executableDir = null;
			this._defaultCommandName = null;
			this._exitCallback = null;
			this._aliases = [];
			this._combineFlagAndOptionalValue = true;
			this._description = "";
			this._summary = "";
			this._argsDescription = void 0;
			this._enablePositionalOptions = false;
			this._passThroughOptions = false;
			this._lifeCycleHooks = {};
			/** @type {(boolean | string)} */
			this._showHelpAfterError = false;
			this._showSuggestionAfterError = true;
			this._savedState = null;
			this._outputConfiguration = {
				writeOut: (str) => process$1.stdout.write(str),
				writeErr: (str) => process$1.stderr.write(str),
				outputError: (str, write) => write(str),
				getOutHelpWidth: () => process$1.stdout.isTTY ? process$1.stdout.columns : void 0,
				getErrHelpWidth: () => process$1.stderr.isTTY ? process$1.stderr.columns : void 0,
				getOutHasColors: () => useColor() ?? (process$1.stdout.isTTY && process$1.stdout.hasColors?.()),
				getErrHasColors: () => useColor() ?? (process$1.stderr.isTTY && process$1.stderr.hasColors?.()),
				stripColor: (str) => stripColor(str)
			};
			this._hidden = false;
			/** @type {(Option | null | undefined)} */
			this._helpOption = void 0;
			this._addImplicitHelpCommand = void 0;
			/** @type {Command} */
			this._helpCommand = void 0;
			this._helpConfiguration = {};
			/** @type {string | undefined} */
			this._helpGroupHeading = void 0;
			/** @type {string | undefined} */
			this._defaultCommandGroup = void 0;
			/** @type {string | undefined} */
			this._defaultOptionGroup = void 0;
		}
		/**
		* Copy settings that are useful to have in common across root command and subcommands.
		*
		* (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
		*
		* @param {Command} sourceCommand
		* @return {Command} `this` command for chaining
		*/
		copyInheritedSettings(sourceCommand) {
			this._outputConfiguration = sourceCommand._outputConfiguration;
			this._helpOption = sourceCommand._helpOption;
			this._helpCommand = sourceCommand._helpCommand;
			this._helpConfiguration = sourceCommand._helpConfiguration;
			this._exitCallback = sourceCommand._exitCallback;
			this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
			this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
			this._allowExcessArguments = sourceCommand._allowExcessArguments;
			this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
			this._showHelpAfterError = sourceCommand._showHelpAfterError;
			this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;
			return this;
		}
		/**
		* @returns {Command[]}
		* @private
		*/
		_getCommandAndAncestors() {
			const result = [];
			for (let command = this; command; command = command.parent) result.push(command);
			return result;
		}
		/**
		* Define a command.
		*
		* There are two styles of command: pay attention to where to put the description.
		*
		* @example
		* // Command implemented using action handler (description is supplied separately to `.command`)
		* program
		*   .command('clone <source> [destination]')
		*   .description('clone a repository into a newly created directory')
		*   .action((source, destination) => {
		*     console.log('clone command called');
		*   });
		*
		* // Command implemented using separate executable file (description is second parameter to `.command`)
		* program
		*   .command('start <service>', 'start named service')
		*   .command('stop [service]', 'stop named service, or all if no name supplied');
		*
		* @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
		* @param {(object | string)} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
		* @param {object} [execOpts] - configuration options (for executable)
		* @return {Command} returns new command for action handler, or `this` for executable command
		*/
		command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
			let desc = actionOptsOrExecDesc;
			let opts = execOpts;
			if (typeof desc === "object" && desc !== null) {
				opts = desc;
				desc = null;
			}
			opts = opts || {};
			const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);
			const cmd = this.createCommand(name);
			if (desc) {
				cmd.description(desc);
				cmd._executableHandler = true;
			}
			if (opts.isDefault) this._defaultCommandName = cmd._name;
			cmd._hidden = !!(opts.noHelp || opts.hidden);
			cmd._executableFile = opts.executableFile || null;
			if (args) cmd.arguments(args);
			this._registerCommand(cmd);
			cmd.parent = this;
			cmd.copyInheritedSettings(this);
			if (desc) return this;
			return cmd;
		}
		/**
		* Factory routine to create a new unattached command.
		*
		* See .command() for creating an attached subcommand, which uses this routine to
		* create the command. You can override createCommand to customise subcommands.
		*
		* @param {string} [name]
		* @return {Command} new command
		*/
		createCommand(name) {
			return new Command(name);
		}
		/**
		* You can customise the help with a subclass of Help by overriding createHelp,
		* or by overriding Help properties using configureHelp().
		*
		* @return {Help}
		*/
		createHelp() {
			return Object.assign(new Help(), this.configureHelp());
		}
		/**
		* You can customise the help by overriding Help properties using configureHelp(),
		* or with a subclass of Help by overriding createHelp().
		*
		* @param {object} [configuration] - configuration options
		* @return {(Command | object)} `this` command for chaining, or stored configuration
		*/
		configureHelp(configuration) {
			if (configuration === void 0) return this._helpConfiguration;
			this._helpConfiguration = configuration;
			return this;
		}
		/**
		* The default output goes to stdout and stderr. You can customise this for special
		* applications. You can also customise the display of errors by overriding outputError.
		*
		* The configuration properties are all functions:
		*
		*     // change how output being written, defaults to stdout and stderr
		*     writeOut(str)
		*     writeErr(str)
		*     // change how output being written for errors, defaults to writeErr
		*     outputError(str, write) // used for displaying errors and not used for displaying help
		*     // specify width for wrapping help
		*     getOutHelpWidth()
		*     getErrHelpWidth()
		*     // color support, currently only used with Help
		*     getOutHasColors()
		*     getErrHasColors()
		*     stripColor() // used to remove ANSI escape codes if output does not have colors
		*
		* @param {object} [configuration] - configuration options
		* @return {(Command | object)} `this` command for chaining, or stored configuration
		*/
		configureOutput(configuration) {
			if (configuration === void 0) return this._outputConfiguration;
			this._outputConfiguration = {
				...this._outputConfiguration,
				...configuration
			};
			return this;
		}
		/**
		* Display the help or a custom message after an error occurs.
		*
		* @param {(boolean|string)} [displayHelp]
		* @return {Command} `this` command for chaining
		*/
		showHelpAfterError(displayHelp = true) {
			if (typeof displayHelp !== "string") displayHelp = !!displayHelp;
			this._showHelpAfterError = displayHelp;
			return this;
		}
		/**
		* Display suggestion of similar commands for unknown commands, or options for unknown options.
		*
		* @param {boolean} [displaySuggestion]
		* @return {Command} `this` command for chaining
		*/
		showSuggestionAfterError(displaySuggestion = true) {
			this._showSuggestionAfterError = !!displaySuggestion;
			return this;
		}
		/**
		* Add a prepared subcommand.
		*
		* See .command() for creating an attached subcommand which inherits settings from its parent.
		*
		* @param {Command} cmd - new subcommand
		* @param {object} [opts] - configuration options
		* @return {Command} `this` command for chaining
		*/
		addCommand(cmd, opts) {
			if (!cmd._name) throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
			opts = opts || {};
			if (opts.isDefault) this._defaultCommandName = cmd._name;
			if (opts.noHelp || opts.hidden) cmd._hidden = true;
			this._registerCommand(cmd);
			cmd.parent = this;
			cmd._checkForBrokenPassThrough();
			return this;
		}
		/**
		* Factory routine to create a new unattached argument.
		*
		* See .argument() for creating an attached argument, which uses this routine to
		* create the argument. You can override createArgument to return a custom argument.
		*
		* @param {string} name
		* @param {string} [description]
		* @return {Argument} new argument
		*/
		createArgument(name, description) {
			return new Argument(name, description);
		}
		/**
		* Define argument syntax for command.
		*
		* The default is that the argument is required, and you can explicitly
		* indicate this with <> around the name. Put [] around the name for an optional argument.
		*
		* @example
		* program.argument('<input-file>');
		* program.argument('[output-file]');
		*
		* @param {string} name
		* @param {string} [description]
		* @param {(Function|*)} [parseArg] - custom argument processing function or default value
		* @param {*} [defaultValue]
		* @return {Command} `this` command for chaining
		*/
		argument(name, description, parseArg, defaultValue) {
			const argument = this.createArgument(name, description);
			if (typeof parseArg === "function") argument.default(defaultValue).argParser(parseArg);
			else argument.default(parseArg);
			this.addArgument(argument);
			return this;
		}
		/**
		* Define argument syntax for command, adding multiple at once (without descriptions).
		*
		* See also .argument().
		*
		* @example
		* program.arguments('<cmd> [env]');
		*
		* @param {string} names
		* @return {Command} `this` command for chaining
		*/
		arguments(names) {
			names.trim().split(/ +/).forEach((detail) => {
				this.argument(detail);
			});
			return this;
		}
		/**
		* Define argument syntax for command, adding a prepared argument.
		*
		* @param {Argument} argument
		* @return {Command} `this` command for chaining
		*/
		addArgument(argument) {
			const previousArgument = this.registeredArguments.slice(-1)[0];
			if (previousArgument?.variadic) throw new Error(`only the last argument can be variadic '${previousArgument.name()}'`);
			if (argument.required && argument.defaultValue !== void 0 && argument.parseArg === void 0) throw new Error(`a default value for a required argument is never used: '${argument.name()}'`);
			this.registeredArguments.push(argument);
			return this;
		}
		/**
		* Customise or override default help command. By default a help command is automatically added if your command has subcommands.
		*
		* @example
		*    program.helpCommand('help [cmd]');
		*    program.helpCommand('help [cmd]', 'show help');
		*    program.helpCommand(false); // suppress default help command
		*    program.helpCommand(true); // add help command even if no subcommands
		*
		* @param {string|boolean} enableOrNameAndArgs - enable with custom name and/or arguments, or boolean to override whether added
		* @param {string} [description] - custom description
		* @return {Command} `this` command for chaining
		*/
		helpCommand(enableOrNameAndArgs, description) {
			if (typeof enableOrNameAndArgs === "boolean") {
				this._addImplicitHelpCommand = enableOrNameAndArgs;
				if (enableOrNameAndArgs && this._defaultCommandGroup) this._initCommandGroup(this._getHelpCommand());
				return this;
			}
			const [, helpName, helpArgs] = (enableOrNameAndArgs ?? "help [command]").match(/([^ ]+) *(.*)/);
			const helpDescription = description ?? "display help for command";
			const helpCommand = this.createCommand(helpName);
			helpCommand.helpOption(false);
			if (helpArgs) helpCommand.arguments(helpArgs);
			if (helpDescription) helpCommand.description(helpDescription);
			this._addImplicitHelpCommand = true;
			this._helpCommand = helpCommand;
			if (enableOrNameAndArgs || description) this._initCommandGroup(helpCommand);
			return this;
		}
		/**
		* Add prepared custom help command.
		*
		* @param {(Command|string|boolean)} helpCommand - custom help command, or deprecated enableOrNameAndArgs as for `.helpCommand()`
		* @param {string} [deprecatedDescription] - deprecated custom description used with custom name only
		* @return {Command} `this` command for chaining
		*/
		addHelpCommand(helpCommand, deprecatedDescription) {
			if (typeof helpCommand !== "object") {
				this.helpCommand(helpCommand, deprecatedDescription);
				return this;
			}
			this._addImplicitHelpCommand = true;
			this._helpCommand = helpCommand;
			this._initCommandGroup(helpCommand);
			return this;
		}
		/**
		* Lazy create help command.
		*
		* @return {(Command|null)}
		* @package
		*/
		_getHelpCommand() {
			if (this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand("help"))) {
				if (this._helpCommand === void 0) this.helpCommand(void 0, void 0);
				return this._helpCommand;
			}
			return null;
		}
		/**
		* Add hook for life cycle event.
		*
		* @param {string} event
		* @param {Function} listener
		* @return {Command} `this` command for chaining
		*/
		hook(event, listener) {
			const allowedValues = [
				"preSubcommand",
				"preAction",
				"postAction"
			];
			if (!allowedValues.includes(event)) throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
			if (this._lifeCycleHooks[event]) this._lifeCycleHooks[event].push(listener);
			else this._lifeCycleHooks[event] = [listener];
			return this;
		}
		/**
		* Register callback to use as replacement for calling process.exit.
		*
		* @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
		* @return {Command} `this` command for chaining
		*/
		exitOverride(fn) {
			if (fn) this._exitCallback = fn;
			else this._exitCallback = (err) => {
				if (err.code !== "commander.executeSubCommandAsync") throw err;
			};
			return this;
		}
		/**
		* Call process.exit, and _exitCallback if defined.
		*
		* @param {number} exitCode exit code for using with process.exit
		* @param {string} code an id string representing the error
		* @param {string} message human-readable description of the error
		* @return never
		* @private
		*/
		_exit(exitCode, code, message) {
			if (this._exitCallback) this._exitCallback(new CommanderError(exitCode, code, message));
			process$1.exit(exitCode);
		}
		/**
		* Register callback `fn` for the command.
		*
		* @example
		* program
		*   .command('serve')
		*   .description('start service')
		*   .action(function() {
		*      // do work here
		*   });
		*
		* @param {Function} fn
		* @return {Command} `this` command for chaining
		*/
		action(fn) {
			const listener = (args) => {
				const expectedArgsCount = this.registeredArguments.length;
				const actionArgs = args.slice(0, expectedArgsCount);
				if (this._storeOptionsAsProperties) actionArgs[expectedArgsCount] = this;
				else actionArgs[expectedArgsCount] = this.opts();
				actionArgs.push(this);
				return fn.apply(this, actionArgs);
			};
			this._actionHandler = listener;
			return this;
		}
		/**
		* Factory routine to create a new unattached option.
		*
		* See .option() for creating an attached option, which uses this routine to
		* create the option. You can override createOption to return a custom option.
		*
		* @param {string} flags
		* @param {string} [description]
		* @return {Option} new option
		*/
		createOption(flags, description) {
			return new Option(flags, description);
		}
		/**
		* Wrap parseArgs to catch 'commander.invalidArgument'.
		*
		* @param {(Option | Argument)} target
		* @param {string} value
		* @param {*} previous
		* @param {string} invalidArgumentMessage
		* @private
		*/
		_callParseArg(target, value, previous, invalidArgumentMessage) {
			try {
				return target.parseArg(value, previous);
			} catch (err) {
				if (err.code === "commander.invalidArgument") {
					const message = `${invalidArgumentMessage} ${err.message}`;
					this.error(message, {
						exitCode: err.exitCode,
						code: err.code
					});
				}
				throw err;
			}
		}
		/**
		* Check for option flag conflicts.
		* Register option if no conflicts found, or throw on conflict.
		*
		* @param {Option} option
		* @private
		*/
		_registerOption(option) {
			const matchingOption = option.short && this._findOption(option.short) || option.long && this._findOption(option.long);
			if (matchingOption) {
				const matchingFlag = option.long && this._findOption(option.long) ? option.long : option.short;
				throw new Error(`Cannot add option '${option.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${matchingFlag}'
-  already used by option '${matchingOption.flags}'`);
			}
			this._initOptionGroup(option);
			this.options.push(option);
		}
		/**
		* Check for command name and alias conflicts with existing commands.
		* Register command if no conflicts found, or throw on conflict.
		*
		* @param {Command} command
		* @private
		*/
		_registerCommand(command) {
			const knownBy = (cmd) => {
				return [cmd.name()].concat(cmd.aliases());
			};
			const alreadyUsed = knownBy(command).find((name) => this._findCommand(name));
			if (alreadyUsed) {
				const existingCmd = knownBy(this._findCommand(alreadyUsed)).join("|");
				const newCmd = knownBy(command).join("|");
				throw new Error(`cannot add command '${newCmd}' as already have command '${existingCmd}'`);
			}
			this._initCommandGroup(command);
			this.commands.push(command);
		}
		/**
		* Add an option.
		*
		* @param {Option} option
		* @return {Command} `this` command for chaining
		*/
		addOption(option) {
			this._registerOption(option);
			const oname = option.name();
			const name = option.attributeName();
			if (option.negate) {
				const positiveLongFlag = option.long.replace(/^--no-/, "--");
				if (!this._findOption(positiveLongFlag)) this.setOptionValueWithSource(name, option.defaultValue === void 0 ? true : option.defaultValue, "default");
			} else if (option.defaultValue !== void 0) this.setOptionValueWithSource(name, option.defaultValue, "default");
			const handleOptionValue = (val, invalidValueMessage, valueSource) => {
				if (val == null && option.presetArg !== void 0) val = option.presetArg;
				const oldValue = this.getOptionValue(name);
				if (val !== null && option.parseArg) val = this._callParseArg(option, val, oldValue, invalidValueMessage);
				else if (val !== null && option.variadic) val = option._collectValue(val, oldValue);
				if (val == null) if (option.negate) val = false;
				else if (option.isBoolean() || option.optional) val = true;
				else val = "";
				this.setOptionValueWithSource(name, val, valueSource);
			};
			this.on("option:" + oname, (val) => {
				handleOptionValue(val, `error: option '${option.flags}' argument '${val}' is invalid.`, "cli");
			});
			if (option.envVar) this.on("optionEnv:" + oname, (val) => {
				handleOptionValue(val, `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`, "env");
			});
			return this;
		}
		/**
		* Internal implementation shared by .option() and .requiredOption()
		*
		* @return {Command} `this` command for chaining
		* @private
		*/
		_optionEx(config, flags, description, fn, defaultValue) {
			if (typeof flags === "object" && flags instanceof Option) throw new Error("To add an Option object use addOption() instead of option() or requiredOption()");
			const option = this.createOption(flags, description);
			option.makeOptionMandatory(!!config.mandatory);
			if (typeof fn === "function") option.default(defaultValue).argParser(fn);
			else if (fn instanceof RegExp) {
				const regex = fn;
				fn = (val, def) => {
					const m = regex.exec(val);
					return m ? m[0] : def;
				};
				option.default(defaultValue).argParser(fn);
			} else option.default(fn);
			return this.addOption(option);
		}
		/**
		* Define option with `flags`, `description`, and optional argument parsing function or `defaultValue` or both.
		*
		* The `flags` string contains the short and/or long flags, separated by comma, a pipe or space. A required
		* option-argument is indicated by `<>` and an optional option-argument by `[]`.
		*
		* See the README for more details, and see also addOption() and requiredOption().
		*
		* @example
		* program
		*     .option('-p, --pepper', 'add pepper')
		*     .option('--pt, --pizza-type <TYPE>', 'type of pizza') // required option-argument
		*     .option('-c, --cheese [CHEESE]', 'add extra cheese', 'mozzarella') // optional option-argument with default
		*     .option('-t, --tip <VALUE>', 'add tip to purchase cost', parseFloat) // custom parse function
		*
		* @param {string} flags
		* @param {string} [description]
		* @param {(Function|*)} [parseArg] - custom option processing function or default value
		* @param {*} [defaultValue]
		* @return {Command} `this` command for chaining
		*/
		option(flags, description, parseArg, defaultValue) {
			return this._optionEx({}, flags, description, parseArg, defaultValue);
		}
		/**
		* Add a required option which must have a value after parsing. This usually means
		* the option must be specified on the command line. (Otherwise the same as .option().)
		*
		* The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
		*
		* @param {string} flags
		* @param {string} [description]
		* @param {(Function|*)} [parseArg] - custom option processing function or default value
		* @param {*} [defaultValue]
		* @return {Command} `this` command for chaining
		*/
		requiredOption(flags, description, parseArg, defaultValue) {
			return this._optionEx({ mandatory: true }, flags, description, parseArg, defaultValue);
		}
		/**
		* Alter parsing of short flags with optional values.
		*
		* @example
		* // for `.option('-f,--flag [value]'):
		* program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
		* program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
		*
		* @param {boolean} [combine] - if `true` or omitted, an optional value can be specified directly after the flag.
		* @return {Command} `this` command for chaining
		*/
		combineFlagAndOptionalValue(combine = true) {
			this._combineFlagAndOptionalValue = !!combine;
			return this;
		}
		/**
		* Allow unknown options on the command line.
		*
		* @param {boolean} [allowUnknown] - if `true` or omitted, no error will be thrown for unknown options.
		* @return {Command} `this` command for chaining
		*/
		allowUnknownOption(allowUnknown = true) {
			this._allowUnknownOption = !!allowUnknown;
			return this;
		}
		/**
		* Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
		*
		* @param {boolean} [allowExcess] - if `true` or omitted, no error will be thrown for excess arguments.
		* @return {Command} `this` command for chaining
		*/
		allowExcessArguments(allowExcess = true) {
			this._allowExcessArguments = !!allowExcess;
			return this;
		}
		/**
		* Enable positional options. Positional means global options are specified before subcommands which lets
		* subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
		* The default behaviour is non-positional and global options may appear anywhere on the command line.
		*
		* @param {boolean} [positional]
		* @return {Command} `this` command for chaining
		*/
		enablePositionalOptions(positional = true) {
			this._enablePositionalOptions = !!positional;
			return this;
		}
		/**
		* Pass through options that come after command-arguments rather than treat them as command-options,
		* so actual command-options come before command-arguments. Turning this on for a subcommand requires
		* positional options to have been enabled on the program (parent commands).
		* The default behaviour is non-positional and options may appear before or after command-arguments.
		*
		* @param {boolean} [passThrough] for unknown options.
		* @return {Command} `this` command for chaining
		*/
		passThroughOptions(passThrough = true) {
			this._passThroughOptions = !!passThrough;
			this._checkForBrokenPassThrough();
			return this;
		}
		/**
		* @private
		*/
		_checkForBrokenPassThrough() {
			if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions) throw new Error(`passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`);
		}
		/**
		* Whether to store option values as properties on command object,
		* or store separately (specify false). In both cases the option values can be accessed using .opts().
		*
		* @param {boolean} [storeAsProperties=true]
		* @return {Command} `this` command for chaining
		*/
		storeOptionsAsProperties(storeAsProperties = true) {
			if (this.options.length) throw new Error("call .storeOptionsAsProperties() before adding options");
			if (Object.keys(this._optionValues).length) throw new Error("call .storeOptionsAsProperties() before setting option values");
			this._storeOptionsAsProperties = !!storeAsProperties;
			return this;
		}
		/**
		* Retrieve option value.
		*
		* @param {string} key
		* @return {object} value
		*/
		getOptionValue(key) {
			if (this._storeOptionsAsProperties) return this[key];
			return this._optionValues[key];
		}
		/**
		* Store option value.
		*
		* @param {string} key
		* @param {object} value
		* @return {Command} `this` command for chaining
		*/
		setOptionValue(key, value) {
			return this.setOptionValueWithSource(key, value, void 0);
		}
		/**
		* Store option value and where the value came from.
		*
		* @param {string} key
		* @param {object} value
		* @param {string} source - expected values are default/config/env/cli/implied
		* @return {Command} `this` command for chaining
		*/
		setOptionValueWithSource(key, value, source) {
			if (this._storeOptionsAsProperties) this[key] = value;
			else this._optionValues[key] = value;
			this._optionValueSources[key] = source;
			return this;
		}
		/**
		* Get source of option value.
		* Expected values are default | config | env | cli | implied
		*
		* @param {string} key
		* @return {string}
		*/
		getOptionValueSource(key) {
			return this._optionValueSources[key];
		}
		/**
		* Get source of option value. See also .optsWithGlobals().
		* Expected values are default | config | env | cli | implied
		*
		* @param {string} key
		* @return {string}
		*/
		getOptionValueSourceWithGlobals(key) {
			let source;
			this._getCommandAndAncestors().forEach((cmd) => {
				if (cmd.getOptionValueSource(key) !== void 0) source = cmd.getOptionValueSource(key);
			});
			return source;
		}
		/**
		* Get user arguments from implied or explicit arguments.
		* Side-effects: set _scriptPath if args included script. Used for default program name, and subcommand searches.
		*
		* @private
		*/
		_prepareUserArgs(argv, parseOptions) {
			if (argv !== void 0 && !Array.isArray(argv)) throw new Error("first parameter to parse must be array or undefined");
			parseOptions = parseOptions || {};
			if (argv === void 0 && parseOptions.from === void 0) {
				if (process$1.versions?.electron) parseOptions.from = "electron";
				const execArgv = process$1.execArgv ?? [];
				if (execArgv.includes("-e") || execArgv.includes("--eval") || execArgv.includes("-p") || execArgv.includes("--print")) parseOptions.from = "eval";
			}
			if (argv === void 0) argv = process$1.argv;
			this.rawArgs = argv.slice();
			let userArgs;
			switch (parseOptions.from) {
				case void 0:
				case "node":
					this._scriptPath = argv[1];
					userArgs = argv.slice(2);
					break;
				case "electron":
					if (process$1.defaultApp) {
						this._scriptPath = argv[1];
						userArgs = argv.slice(2);
					} else userArgs = argv.slice(1);
					break;
				case "user":
					userArgs = argv.slice(0);
					break;
				case "eval":
					userArgs = argv.slice(1);
					break;
				default: throw new Error(`unexpected parse option { from: '${parseOptions.from}' }`);
			}
			if (!this._name && this._scriptPath) this.nameFromFilename(this._scriptPath);
			this._name = this._name || "program";
			return userArgs;
		}
		/**
		* Parse `argv`, setting options and invoking commands when defined.
		*
		* Use parseAsync instead of parse if any of your action handlers are async.
		*
		* Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
		*
		* Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
		* - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
		* - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
		* - `'user'`: just user arguments
		*
		* @example
		* program.parse(); // parse process.argv and auto-detect electron and special node flags
		* program.parse(process.argv); // assume argv[0] is app and argv[1] is script
		* program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
		*
		* @param {string[]} [argv] - optional, defaults to process.argv
		* @param {object} [parseOptions] - optionally specify style of options with from: node/user/electron
		* @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
		* @return {Command} `this` command for chaining
		*/
		parse(argv, parseOptions) {
			this._prepareForParse();
			const userArgs = this._prepareUserArgs(argv, parseOptions);
			this._parseCommand([], userArgs);
			return this;
		}
		/**
		* Parse `argv`, setting options and invoking commands when defined.
		*
		* Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
		*
		* Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
		* - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
		* - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
		* - `'user'`: just user arguments
		*
		* @example
		* await program.parseAsync(); // parse process.argv and auto-detect electron and special node flags
		* await program.parseAsync(process.argv); // assume argv[0] is app and argv[1] is script
		* await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
		*
		* @param {string[]} [argv]
		* @param {object} [parseOptions]
		* @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
		* @return {Promise}
		*/
		async parseAsync(argv, parseOptions) {
			this._prepareForParse();
			const userArgs = this._prepareUserArgs(argv, parseOptions);
			await this._parseCommand([], userArgs);
			return this;
		}
		_prepareForParse() {
			if (this._savedState === null) this.saveStateBeforeParse();
			else this.restoreStateBeforeParse();
		}
		/**
		* Called the first time parse is called to save state and allow a restore before subsequent calls to parse.
		* Not usually called directly, but available for subclasses to save their custom state.
		*
		* This is called in a lazy way. Only commands used in parsing chain will have state saved.
		*/
		saveStateBeforeParse() {
			this._savedState = {
				_name: this._name,
				_optionValues: { ...this._optionValues },
				_optionValueSources: { ...this._optionValueSources }
			};
		}
		/**
		* Restore state before parse for calls after the first.
		* Not usually called directly, but available for subclasses to save their custom state.
		*
		* This is called in a lazy way. Only commands used in parsing chain will have state restored.
		*/
		restoreStateBeforeParse() {
			if (this._storeOptionsAsProperties) throw new Error(`Can not call parse again when storeOptionsAsProperties is true.
- either make a new Command for each call to parse, or stop storing options as properties`);
			this._name = this._savedState._name;
			this._scriptPath = null;
			this.rawArgs = [];
			this._optionValues = { ...this._savedState._optionValues };
			this._optionValueSources = { ...this._savedState._optionValueSources };
			this.args = [];
			this.processedArgs = [];
		}
		/**
		* Throw if expected executable is missing. Add lots of help for author.
		*
		* @param {string} executableFile
		* @param {string} executableDir
		* @param {string} subcommandName
		*/
		_checkForMissingExecutable(executableFile, executableDir, subcommandName) {
			if (fs$5.existsSync(executableFile)) return;
			const executableMissing = `'${executableFile}' does not exist
 - if '${subcommandName}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDir ? `searched for local subcommand relative to directory '${executableDir}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory"}`;
			throw new Error(executableMissing);
		}
		/**
		* Execute a sub-command executable.
		*
		* @private
		*/
		_executeSubCommand(subcommand, args) {
			args = args.slice();
			let launchWithNode = false;
			const sourceExt = [
				".js",
				".ts",
				".tsx",
				".mjs",
				".cjs"
			];
			function findFile(baseDir, baseName) {
				const localBin = path$11.resolve(baseDir, baseName);
				if (fs$5.existsSync(localBin)) return localBin;
				if (sourceExt.includes(path$11.extname(baseName))) return void 0;
				const foundExt = sourceExt.find((ext) => fs$5.existsSync(`${localBin}${ext}`));
				if (foundExt) return `${localBin}${foundExt}`;
			}
			this._checkForMissingMandatoryOptions();
			this._checkForConflictingOptions();
			let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
			let executableDir = this._executableDir || "";
			if (this._scriptPath) {
				let resolvedScriptPath;
				try {
					resolvedScriptPath = fs$5.realpathSync(this._scriptPath);
				} catch {
					resolvedScriptPath = this._scriptPath;
				}
				executableDir = path$11.resolve(path$11.dirname(resolvedScriptPath), executableDir);
			}
			if (executableDir) {
				let localFile = findFile(executableDir, executableFile);
				if (!localFile && !subcommand._executableFile && this._scriptPath) {
					const legacyName = path$11.basename(this._scriptPath, path$11.extname(this._scriptPath));
					if (legacyName !== this._name) localFile = findFile(executableDir, `${legacyName}-${subcommand._name}`);
				}
				executableFile = localFile || executableFile;
			}
			launchWithNode = sourceExt.includes(path$11.extname(executableFile));
			let proc;
			if (process$1.platform !== "win32") if (launchWithNode) {
				args.unshift(executableFile);
				args = incrementNodeInspectorPort(process$1.execArgv).concat(args);
				proc = childProcess.spawn(process$1.argv[0], args, { stdio: "inherit" });
			} else proc = childProcess.spawn(executableFile, args, { stdio: "inherit" });
			else {
				this._checkForMissingExecutable(executableFile, executableDir, subcommand._name);
				args.unshift(executableFile);
				args = incrementNodeInspectorPort(process$1.execArgv).concat(args);
				proc = childProcess.spawn(process$1.execPath, args, { stdio: "inherit" });
			}
			if (!proc.killed) [
				"SIGUSR1",
				"SIGUSR2",
				"SIGTERM",
				"SIGINT",
				"SIGHUP"
			].forEach((signal) => {
				process$1.on(signal, () => {
					if (proc.killed === false && proc.exitCode === null) proc.kill(signal);
				});
			});
			const exitCallback = this._exitCallback;
			proc.on("close", (code) => {
				code = code ?? 1;
				if (!exitCallback) process$1.exit(code);
				else exitCallback(new CommanderError(code, "commander.executeSubCommandAsync", "(close)"));
			});
			proc.on("error", (err) => {
				if (err.code === "ENOENT") this._checkForMissingExecutable(executableFile, executableDir, subcommand._name);
				else if (err.code === "EACCES") throw new Error(`'${executableFile}' not executable`);
				if (!exitCallback) process$1.exit(1);
				else {
					const wrappedError = new CommanderError(1, "commander.executeSubCommandAsync", "(error)");
					wrappedError.nestedError = err;
					exitCallback(wrappedError);
				}
			});
			this.runningCommand = proc;
		}
		/**
		* @private
		*/
		_dispatchSubcommand(commandName, operands, unknown) {
			const subCommand = this._findCommand(commandName);
			if (!subCommand) this.help({ error: true });
			subCommand._prepareForParse();
			let promiseChain;
			promiseChain = this._chainOrCallSubCommandHook(promiseChain, subCommand, "preSubcommand");
			promiseChain = this._chainOrCall(promiseChain, () => {
				if (subCommand._executableHandler) this._executeSubCommand(subCommand, operands.concat(unknown));
				else return subCommand._parseCommand(operands, unknown);
			});
			return promiseChain;
		}
		/**
		* Invoke help directly if possible, or dispatch if necessary.
		* e.g. help foo
		*
		* @private
		*/
		_dispatchHelpCommand(subcommandName) {
			if (!subcommandName) this.help();
			const subCommand = this._findCommand(subcommandName);
			if (subCommand && !subCommand._executableHandler) subCommand.help();
			return this._dispatchSubcommand(subcommandName, [], [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"]);
		}
		/**
		* Check this.args against expected this.registeredArguments.
		*
		* @private
		*/
		_checkNumberOfArguments() {
			this.registeredArguments.forEach((arg, i) => {
				if (arg.required && this.args[i] == null) this.missingArgument(arg.name());
			});
			if (this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic) return;
			if (this.args.length > this.registeredArguments.length) this._excessArguments(this.args);
		}
		/**
		* Process this.args using this.registeredArguments and save as this.processedArgs!
		*
		* @private
		*/
		_processArguments() {
			const myParseArg = (argument, value, previous) => {
				let parsedValue = value;
				if (value !== null && argument.parseArg) {
					const invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'.`;
					parsedValue = this._callParseArg(argument, value, previous, invalidValueMessage);
				}
				return parsedValue;
			};
			this._checkNumberOfArguments();
			const processedArgs = [];
			this.registeredArguments.forEach((declaredArg, index) => {
				let value = declaredArg.defaultValue;
				if (declaredArg.variadic) {
					if (index < this.args.length) {
						value = this.args.slice(index);
						if (declaredArg.parseArg) value = value.reduce((processed, v) => {
							return myParseArg(declaredArg, v, processed);
						}, declaredArg.defaultValue);
					} else if (value === void 0) value = [];
				} else if (index < this.args.length) {
					value = this.args[index];
					if (declaredArg.parseArg) value = myParseArg(declaredArg, value, declaredArg.defaultValue);
				}
				processedArgs[index] = value;
			});
			this.processedArgs = processedArgs;
		}
		/**
		* Once we have a promise we chain, but call synchronously until then.
		*
		* @param {(Promise|undefined)} promise
		* @param {Function} fn
		* @return {(Promise|undefined)}
		* @private
		*/
		_chainOrCall(promise, fn) {
			if (promise?.then && typeof promise.then === "function") return promise.then(() => fn());
			return fn();
		}
		/**
		*
		* @param {(Promise|undefined)} promise
		* @param {string} event
		* @return {(Promise|undefined)}
		* @private
		*/
		_chainOrCallHooks(promise, event) {
			let result = promise;
			const hooks = [];
			this._getCommandAndAncestors().reverse().filter((cmd) => cmd._lifeCycleHooks[event] !== void 0).forEach((hookedCommand) => {
				hookedCommand._lifeCycleHooks[event].forEach((callback) => {
					hooks.push({
						hookedCommand,
						callback
					});
				});
			});
			if (event === "postAction") hooks.reverse();
			hooks.forEach((hookDetail) => {
				result = this._chainOrCall(result, () => {
					return hookDetail.callback(hookDetail.hookedCommand, this);
				});
			});
			return result;
		}
		/**
		*
		* @param {(Promise|undefined)} promise
		* @param {Command} subCommand
		* @param {string} event
		* @return {(Promise|undefined)}
		* @private
		*/
		_chainOrCallSubCommandHook(promise, subCommand, event) {
			let result = promise;
			if (this._lifeCycleHooks[event] !== void 0) this._lifeCycleHooks[event].forEach((hook) => {
				result = this._chainOrCall(result, () => {
					return hook(this, subCommand);
				});
			});
			return result;
		}
		/**
		* Process arguments in context of this command.
		* Returns action result, in case it is a promise.
		*
		* @private
		*/
		_parseCommand(operands, unknown) {
			const parsed = this.parseOptions(unknown);
			this._parseOptionsEnv();
			this._parseOptionsImplied();
			operands = operands.concat(parsed.operands);
			unknown = parsed.unknown;
			this.args = operands.concat(unknown);
			if (operands && this._findCommand(operands[0])) return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
			if (this._getHelpCommand() && operands[0] === this._getHelpCommand().name()) return this._dispatchHelpCommand(operands[1]);
			if (this._defaultCommandName) {
				this._outputHelpIfRequested(unknown);
				return this._dispatchSubcommand(this._defaultCommandName, operands, unknown);
			}
			if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) this.help({ error: true });
			this._outputHelpIfRequested(parsed.unknown);
			this._checkForMissingMandatoryOptions();
			this._checkForConflictingOptions();
			const checkForUnknownOptions = () => {
				if (parsed.unknown.length > 0) this.unknownOption(parsed.unknown[0]);
			};
			const commandEvent = `command:${this.name()}`;
			if (this._actionHandler) {
				checkForUnknownOptions();
				this._processArguments();
				let promiseChain;
				promiseChain = this._chainOrCallHooks(promiseChain, "preAction");
				promiseChain = this._chainOrCall(promiseChain, () => this._actionHandler(this.processedArgs));
				if (this.parent) promiseChain = this._chainOrCall(promiseChain, () => {
					this.parent.emit(commandEvent, operands, unknown);
				});
				promiseChain = this._chainOrCallHooks(promiseChain, "postAction");
				return promiseChain;
			}
			if (this.parent?.listenerCount(commandEvent)) {
				checkForUnknownOptions();
				this._processArguments();
				this.parent.emit(commandEvent, operands, unknown);
			} else if (operands.length) {
				if (this._findCommand("*")) return this._dispatchSubcommand("*", operands, unknown);
				if (this.listenerCount("command:*")) this.emit("command:*", operands, unknown);
				else if (this.commands.length) this.unknownCommand();
				else {
					checkForUnknownOptions();
					this._processArguments();
				}
			} else if (this.commands.length) {
				checkForUnknownOptions();
				this.help({ error: true });
			} else {
				checkForUnknownOptions();
				this._processArguments();
			}
		}
		/**
		* Find matching command.
		*
		* @private
		* @return {Command | undefined}
		*/
		_findCommand(name) {
			if (!name) return void 0;
			return this.commands.find((cmd) => cmd._name === name || cmd._aliases.includes(name));
		}
		/**
		* Return an option matching `arg` if any.
		*
		* @param {string} arg
		* @return {Option}
		* @package
		*/
		_findOption(arg) {
			return this.options.find((option) => option.is(arg));
		}
		/**
		* Display an error message if a mandatory option does not have a value.
		* Called after checking for help flags in leaf subcommand.
		*
		* @private
		*/
		_checkForMissingMandatoryOptions() {
			this._getCommandAndAncestors().forEach((cmd) => {
				cmd.options.forEach((anOption) => {
					if (anOption.mandatory && cmd.getOptionValue(anOption.attributeName()) === void 0) cmd.missingMandatoryOptionValue(anOption);
				});
			});
		}
		/**
		* Display an error message if conflicting options are used together in this.
		*
		* @private
		*/
		_checkForConflictingLocalOptions() {
			const definedNonDefaultOptions = this.options.filter((option) => {
				const optionKey = option.attributeName();
				if (this.getOptionValue(optionKey) === void 0) return false;
				return this.getOptionValueSource(optionKey) !== "default";
			});
			definedNonDefaultOptions.filter((option) => option.conflictsWith.length > 0).forEach((option) => {
				const conflictingAndDefined = definedNonDefaultOptions.find((defined) => option.conflictsWith.includes(defined.attributeName()));
				if (conflictingAndDefined) this._conflictingOption(option, conflictingAndDefined);
			});
		}
		/**
		* Display an error message if conflicting options are used together.
		* Called after checking for help flags in leaf subcommand.
		*
		* @private
		*/
		_checkForConflictingOptions() {
			this._getCommandAndAncestors().forEach((cmd) => {
				cmd._checkForConflictingLocalOptions();
			});
		}
		/**
		* Parse options from `argv` removing known options,
		* and return argv split into operands and unknown arguments.
		*
		* Side effects: modifies command by storing options. Does not reset state if called again.
		*
		* Examples:
		*
		*     argv => operands, unknown
		*     --known kkk op => [op], []
		*     op --known kkk => [op], []
		*     sub --unknown uuu op => [sub], [--unknown uuu op]
		*     sub -- --unknown uuu op => [sub --unknown uuu op], []
		*
		* @param {string[]} args
		* @return {{operands: string[], unknown: string[]}}
		*/
		parseOptions(args) {
			const operands = [];
			const unknown = [];
			let dest = operands;
			function maybeOption(arg) {
				return arg.length > 1 && arg[0] === "-";
			}
			const negativeNumberArg = (arg) => {
				if (!/^-(\d+|\d*\.\d+)(e[+-]?\d+)?$/.test(arg)) return false;
				return !this._getCommandAndAncestors().some((cmd) => cmd.options.map((opt) => opt.short).some((short) => /^-\d$/.test(short)));
			};
			let activeVariadicOption = null;
			let activeGroup = null;
			let i = 0;
			while (i < args.length || activeGroup) {
				const arg = activeGroup ?? args[i++];
				activeGroup = null;
				if (arg === "--") {
					if (dest === unknown) dest.push(arg);
					dest.push(...args.slice(i));
					break;
				}
				if (activeVariadicOption && (!maybeOption(arg) || negativeNumberArg(arg))) {
					this.emit(`option:${activeVariadicOption.name()}`, arg);
					continue;
				}
				activeVariadicOption = null;
				if (maybeOption(arg)) {
					const option = this._findOption(arg);
					if (option) {
						if (option.required) {
							const value = args[i++];
							if (value === void 0) this.optionMissingArgument(option);
							this.emit(`option:${option.name()}`, value);
						} else if (option.optional) {
							let value = null;
							if (i < args.length && (!maybeOption(args[i]) || negativeNumberArg(args[i]))) value = args[i++];
							this.emit(`option:${option.name()}`, value);
						} else this.emit(`option:${option.name()}`);
						activeVariadicOption = option.variadic ? option : null;
						continue;
					}
				}
				if (arg.length > 2 && arg[0] === "-" && arg[1] !== "-") {
					const option = this._findOption(`-${arg[1]}`);
					if (option) {
						if (option.required || option.optional && this._combineFlagAndOptionalValue) this.emit(`option:${option.name()}`, arg.slice(2));
						else {
							this.emit(`option:${option.name()}`);
							activeGroup = `-${arg.slice(2)}`;
						}
						continue;
					}
				}
				if (/^--[^=]+=/.test(arg)) {
					const index = arg.indexOf("=");
					const option = this._findOption(arg.slice(0, index));
					if (option && (option.required || option.optional)) {
						this.emit(`option:${option.name()}`, arg.slice(index + 1));
						continue;
					}
				}
				if (dest === operands && maybeOption(arg) && !(this.commands.length === 0 && negativeNumberArg(arg))) dest = unknown;
				if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
					if (this._findCommand(arg)) {
						operands.push(arg);
						unknown.push(...args.slice(i));
						break;
					} else if (this._getHelpCommand() && arg === this._getHelpCommand().name()) {
						operands.push(arg, ...args.slice(i));
						break;
					} else if (this._defaultCommandName) {
						unknown.push(arg, ...args.slice(i));
						break;
					}
				}
				if (this._passThroughOptions) {
					dest.push(arg, ...args.slice(i));
					break;
				}
				dest.push(arg);
			}
			return {
				operands,
				unknown
			};
		}
		/**
		* Return an object containing local option values as key-value pairs.
		*
		* @return {object}
		*/
		opts() {
			if (this._storeOptionsAsProperties) {
				const result = {};
				const len = this.options.length;
				for (let i = 0; i < len; i++) {
					const key = this.options[i].attributeName();
					result[key] = key === this._versionOptionName ? this._version : this[key];
				}
				return result;
			}
			return this._optionValues;
		}
		/**
		* Return an object containing merged local and global option values as key-value pairs.
		*
		* @return {object}
		*/
		optsWithGlobals() {
			return this._getCommandAndAncestors().reduce((combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()), {});
		}
		/**
		* Display error message and exit (or call exitOverride).
		*
		* @param {string} message
		* @param {object} [errorOptions]
		* @param {string} [errorOptions.code] - an id string representing the error
		* @param {number} [errorOptions.exitCode] - used with process.exit
		*/
		error(message, errorOptions) {
			this._outputConfiguration.outputError(`${message}\n`, this._outputConfiguration.writeErr);
			if (typeof this._showHelpAfterError === "string") this._outputConfiguration.writeErr(`${this._showHelpAfterError}\n`);
			else if (this._showHelpAfterError) {
				this._outputConfiguration.writeErr("\n");
				this.outputHelp({ error: true });
			}
			const config = errorOptions || {};
			const exitCode = config.exitCode || 1;
			const code = config.code || "commander.error";
			this._exit(exitCode, code, message);
		}
		/**
		* Apply any option related environment variables, if option does
		* not have a value from cli or client code.
		*
		* @private
		*/
		_parseOptionsEnv() {
			this.options.forEach((option) => {
				if (option.envVar && option.envVar in process$1.env) {
					const optionKey = option.attributeName();
					if (this.getOptionValue(optionKey) === void 0 || [
						"default",
						"config",
						"env"
					].includes(this.getOptionValueSource(optionKey))) if (option.required || option.optional) this.emit(`optionEnv:${option.name()}`, process$1.env[option.envVar]);
					else this.emit(`optionEnv:${option.name()}`);
				}
			});
		}
		/**
		* Apply any implied option values, if option is undefined or default value.
		*
		* @private
		*/
		_parseOptionsImplied() {
			const dualHelper = new DualOptions(this.options);
			const hasCustomOptionValue = (optionKey) => {
				return this.getOptionValue(optionKey) !== void 0 && !["default", "implied"].includes(this.getOptionValueSource(optionKey));
			};
			this.options.filter((option) => option.implied !== void 0 && hasCustomOptionValue(option.attributeName()) && dualHelper.valueFromOption(this.getOptionValue(option.attributeName()), option)).forEach((option) => {
				Object.keys(option.implied).filter((impliedKey) => !hasCustomOptionValue(impliedKey)).forEach((impliedKey) => {
					this.setOptionValueWithSource(impliedKey, option.implied[impliedKey], "implied");
				});
			});
		}
		/**
		* Argument `name` is missing.
		*
		* @param {string} name
		* @private
		*/
		missingArgument(name) {
			const message = `error: missing required argument '${name}'`;
			this.error(message, { code: "commander.missingArgument" });
		}
		/**
		* `Option` is missing an argument.
		*
		* @param {Option} option
		* @private
		*/
		optionMissingArgument(option) {
			const message = `error: option '${option.flags}' argument missing`;
			this.error(message, { code: "commander.optionMissingArgument" });
		}
		/**
		* `Option` does not have a value, and is a mandatory option.
		*
		* @param {Option} option
		* @private
		*/
		missingMandatoryOptionValue(option) {
			const message = `error: required option '${option.flags}' not specified`;
			this.error(message, { code: "commander.missingMandatoryOptionValue" });
		}
		/**
		* `Option` conflicts with another option.
		*
		* @param {Option} option
		* @param {Option} conflictingOption
		* @private
		*/
		_conflictingOption(option, conflictingOption) {
			const findBestOptionFromValue = (option) => {
				const optionKey = option.attributeName();
				const optionValue = this.getOptionValue(optionKey);
				const negativeOption = this.options.find((target) => target.negate && optionKey === target.attributeName());
				const positiveOption = this.options.find((target) => !target.negate && optionKey === target.attributeName());
				if (negativeOption && (negativeOption.presetArg === void 0 && optionValue === false || negativeOption.presetArg !== void 0 && optionValue === negativeOption.presetArg)) return negativeOption;
				return positiveOption || option;
			};
			const getErrorMessage = (option) => {
				const bestOption = findBestOptionFromValue(option);
				const optionKey = bestOption.attributeName();
				if (this.getOptionValueSource(optionKey) === "env") return `environment variable '${bestOption.envVar}'`;
				return `option '${bestOption.flags}'`;
			};
			const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
			this.error(message, { code: "commander.conflictingOption" });
		}
		/**
		* Unknown option `flag`.
		*
		* @param {string} flag
		* @private
		*/
		unknownOption(flag) {
			if (this._allowUnknownOption) return;
			let suggestion = "";
			if (flag.startsWith("--") && this._showSuggestionAfterError) {
				let candidateFlags = [];
				let command = this;
				do {
					const moreFlags = command.createHelp().visibleOptions(command).filter((option) => option.long).map((option) => option.long);
					candidateFlags = candidateFlags.concat(moreFlags);
					command = command.parent;
				} while (command && !command._enablePositionalOptions);
				suggestion = suggestSimilar(flag, candidateFlags);
			}
			const message = `error: unknown option '${flag}'${suggestion}`;
			this.error(message, { code: "commander.unknownOption" });
		}
		/**
		* Excess arguments, more than expected.
		*
		* @param {string[]} receivedArgs
		* @private
		*/
		_excessArguments(receivedArgs) {
			if (this._allowExcessArguments) return;
			const expected = this.registeredArguments.length;
			const s = expected === 1 ? "" : "s";
			const message = `error: too many arguments${this.parent ? ` for '${this.name()}'` : ""}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
			this.error(message, { code: "commander.excessArguments" });
		}
		/**
		* Unknown command.
		*
		* @private
		*/
		unknownCommand() {
			const unknownName = this.args[0];
			let suggestion = "";
			if (this._showSuggestionAfterError) {
				const candidateNames = [];
				this.createHelp().visibleCommands(this).forEach((command) => {
					candidateNames.push(command.name());
					if (command.alias()) candidateNames.push(command.alias());
				});
				suggestion = suggestSimilar(unknownName, candidateNames);
			}
			const message = `error: unknown command '${unknownName}'${suggestion}`;
			this.error(message, { code: "commander.unknownCommand" });
		}
		/**
		* Get or set the program version.
		*
		* This method auto-registers the "-V, --version" option which will print the version number.
		*
		* You can optionally supply the flags and description to override the defaults.
		*
		* @param {string} [str]
		* @param {string} [flags]
		* @param {string} [description]
		* @return {(this | string | undefined)} `this` command for chaining, or version string if no arguments
		*/
		version(str, flags, description) {
			if (str === void 0) return this._version;
			this._version = str;
			flags = flags || "-V, --version";
			description = description || "output the version number";
			const versionOption = this.createOption(flags, description);
			this._versionOptionName = versionOption.attributeName();
			this._registerOption(versionOption);
			this.on("option:" + versionOption.name(), () => {
				this._outputConfiguration.writeOut(`${str}\n`);
				this._exit(0, "commander.version", str);
			});
			return this;
		}
		/**
		* Set the description.
		*
		* @param {string} [str]
		* @param {object} [argsDescription]
		* @return {(string|Command)}
		*/
		description(str, argsDescription) {
			if (str === void 0 && argsDescription === void 0) return this._description;
			this._description = str;
			if (argsDescription) this._argsDescription = argsDescription;
			return this;
		}
		/**
		* Set the summary. Used when listed as subcommand of parent.
		*
		* @param {string} [str]
		* @return {(string|Command)}
		*/
		summary(str) {
			if (str === void 0) return this._summary;
			this._summary = str;
			return this;
		}
		/**
		* Set an alias for the command.
		*
		* You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
		*
		* @param {string} [alias]
		* @return {(string|Command)}
		*/
		alias(alias) {
			if (alias === void 0) return this._aliases[0];
			/** @type {Command} */
			let command = this;
			if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) command = this.commands[this.commands.length - 1];
			if (alias === command._name) throw new Error("Command alias can't be the same as its name");
			const matchingCommand = this.parent?._findCommand(alias);
			if (matchingCommand) {
				const existingCmd = [matchingCommand.name()].concat(matchingCommand.aliases()).join("|");
				throw new Error(`cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`);
			}
			command._aliases.push(alias);
			return this;
		}
		/**
		* Set aliases for the command.
		*
		* Only the first alias is shown in the auto-generated help.
		*
		* @param {string[]} [aliases]
		* @return {(string[]|Command)}
		*/
		aliases(aliases) {
			if (aliases === void 0) return this._aliases;
			aliases.forEach((alias) => this.alias(alias));
			return this;
		}
		/**
		* Set / get the command usage `str`.
		*
		* @param {string} [str]
		* @return {(string|Command)}
		*/
		usage(str) {
			if (str === void 0) {
				if (this._usage) return this._usage;
				const args = this.registeredArguments.map((arg) => {
					return humanReadableArgName(arg);
				});
				return [].concat(this.options.length || this._helpOption !== null ? "[options]" : [], this.commands.length ? "[command]" : [], this.registeredArguments.length ? args : []).join(" ");
			}
			this._usage = str;
			return this;
		}
		/**
		* Get or set the name of the command.
		*
		* @param {string} [str]
		* @return {(string|Command)}
		*/
		name(str) {
			if (str === void 0) return this._name;
			this._name = str;
			return this;
		}
		/**
		* Set/get the help group heading for this subcommand in parent command's help.
		*
		* @param {string} [heading]
		* @return {Command | string}
		*/
		helpGroup(heading) {
			if (heading === void 0) return this._helpGroupHeading ?? "";
			this._helpGroupHeading = heading;
			return this;
		}
		/**
		* Set/get the default help group heading for subcommands added to this command.
		* (This does not override a group set directly on the subcommand using .helpGroup().)
		*
		* @example
		* program.commandsGroup('Development Commands:);
		* program.command('watch')...
		* program.command('lint')...
		* ...
		*
		* @param {string} [heading]
		* @returns {Command | string}
		*/
		commandsGroup(heading) {
			if (heading === void 0) return this._defaultCommandGroup ?? "";
			this._defaultCommandGroup = heading;
			return this;
		}
		/**
		* Set/get the default help group heading for options added to this command.
		* (This does not override a group set directly on the option using .helpGroup().)
		*
		* @example
		* program
		*   .optionsGroup('Development Options:')
		*   .option('-d, --debug', 'output extra debugging')
		*   .option('-p, --profile', 'output profiling information')
		*
		* @param {string} [heading]
		* @returns {Command | string}
		*/
		optionsGroup(heading) {
			if (heading === void 0) return this._defaultOptionGroup ?? "";
			this._defaultOptionGroup = heading;
			return this;
		}
		/**
		* @param {Option} option
		* @private
		*/
		_initOptionGroup(option) {
			if (this._defaultOptionGroup && !option.helpGroupHeading) option.helpGroup(this._defaultOptionGroup);
		}
		/**
		* @param {Command} cmd
		* @private
		*/
		_initCommandGroup(cmd) {
			if (this._defaultCommandGroup && !cmd.helpGroup()) cmd.helpGroup(this._defaultCommandGroup);
		}
		/**
		* Set the name of the command from script filename, such as process.argv[1],
		* or require.main.filename, or __filename.
		*
		* (Used internally and public although not documented in README.)
		*
		* @example
		* program.nameFromFilename(require.main.filename);
		*
		* @param {string} filename
		* @return {Command}
		*/
		nameFromFilename(filename) {
			this._name = path$11.basename(filename, path$11.extname(filename));
			return this;
		}
		/**
		* Get or set the directory for searching for executable subcommands of this command.
		*
		* @example
		* program.executableDir(__dirname);
		* // or
		* program.executableDir('subcommands');
		*
		* @param {string} [path]
		* @return {(string|null|Command)}
		*/
		executableDir(path) {
			if (path === void 0) return this._executableDir;
			this._executableDir = path;
			return this;
		}
		/**
		* Return program help documentation.
		*
		* @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
		* @return {string}
		*/
		helpInformation(contextOptions) {
			const helper = this.createHelp();
			const context = this._getOutputContext(contextOptions);
			helper.prepareContext({
				error: context.error,
				helpWidth: context.helpWidth,
				outputHasColors: context.hasColors
			});
			const text = helper.formatHelp(this, helper);
			if (context.hasColors) return text;
			return this._outputConfiguration.stripColor(text);
		}
		/**
		* @typedef HelpContext
		* @type {object}
		* @property {boolean} error
		* @property {number} helpWidth
		* @property {boolean} hasColors
		* @property {function} write - includes stripColor if needed
		*
		* @returns {HelpContext}
		* @private
		*/
		_getOutputContext(contextOptions) {
			contextOptions = contextOptions || {};
			const error = !!contextOptions.error;
			let baseWrite;
			let hasColors;
			let helpWidth;
			if (error) {
				baseWrite = (str) => this._outputConfiguration.writeErr(str);
				hasColors = this._outputConfiguration.getErrHasColors();
				helpWidth = this._outputConfiguration.getErrHelpWidth();
			} else {
				baseWrite = (str) => this._outputConfiguration.writeOut(str);
				hasColors = this._outputConfiguration.getOutHasColors();
				helpWidth = this._outputConfiguration.getOutHelpWidth();
			}
			const write = (str) => {
				if (!hasColors) str = this._outputConfiguration.stripColor(str);
				return baseWrite(str);
			};
			return {
				error,
				write,
				hasColors,
				helpWidth
			};
		}
		/**
		* Output help information for this command.
		*
		* Outputs built-in help, and custom text added using `.addHelpText()`.
		*
		* @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
		*/
		outputHelp(contextOptions) {
			let deprecatedCallback;
			if (typeof contextOptions === "function") {
				deprecatedCallback = contextOptions;
				contextOptions = void 0;
			}
			const outputContext = this._getOutputContext(contextOptions);
			/** @type {HelpTextEventContext} */
			const eventContext = {
				error: outputContext.error,
				write: outputContext.write,
				command: this
			};
			this._getCommandAndAncestors().reverse().forEach((command) => command.emit("beforeAllHelp", eventContext));
			this.emit("beforeHelp", eventContext);
			let helpInformation = this.helpInformation({ error: outputContext.error });
			if (deprecatedCallback) {
				helpInformation = deprecatedCallback(helpInformation);
				if (typeof helpInformation !== "string" && !Buffer.isBuffer(helpInformation)) throw new Error("outputHelp callback must return a string or a Buffer");
			}
			outputContext.write(helpInformation);
			if (this._getHelpOption()?.long) this.emit(this._getHelpOption().long);
			this.emit("afterHelp", eventContext);
			this._getCommandAndAncestors().forEach((command) => command.emit("afterAllHelp", eventContext));
		}
		/**
		* You can pass in flags and a description to customise the built-in help option.
		* Pass in false to disable the built-in help option.
		*
		* @example
		* program.helpOption('-?, --help' 'show help'); // customise
		* program.helpOption(false); // disable
		*
		* @param {(string | boolean)} flags
		* @param {string} [description]
		* @return {Command} `this` command for chaining
		*/
		helpOption(flags, description) {
			if (typeof flags === "boolean") {
				if (flags) {
					if (this._helpOption === null) this._helpOption = void 0;
					if (this._defaultOptionGroup) this._initOptionGroup(this._getHelpOption());
				} else this._helpOption = null;
				return this;
			}
			this._helpOption = this.createOption(flags ?? "-h, --help", description ?? "display help for command");
			if (flags || description) this._initOptionGroup(this._helpOption);
			return this;
		}
		/**
		* Lazy create help option.
		* Returns null if has been disabled with .helpOption(false).
		*
		* @returns {(Option | null)} the help option
		* @package
		*/
		_getHelpOption() {
			if (this._helpOption === void 0) this.helpOption(void 0, void 0);
			return this._helpOption;
		}
		/**
		* Supply your own option to use for the built-in help option.
		* This is an alternative to using helpOption() to customise the flags and description etc.
		*
		* @param {Option} option
		* @return {Command} `this` command for chaining
		*/
		addHelpOption(option) {
			this._helpOption = option;
			this._initOptionGroup(option);
			return this;
		}
		/**
		* Output help information and exit.
		*
		* Outputs built-in help, and custom text added using `.addHelpText()`.
		*
		* @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
		*/
		help(contextOptions) {
			this.outputHelp(contextOptions);
			let exitCode = Number(process$1.exitCode ?? 0);
			if (exitCode === 0 && contextOptions && typeof contextOptions !== "function" && contextOptions.error) exitCode = 1;
			this._exit(exitCode, "commander.help", "(outputHelp)");
		}
		/**
		* // Do a little typing to coordinate emit and listener for the help text events.
		* @typedef HelpTextEventContext
		* @type {object}
		* @property {boolean} error
		* @property {Command} command
		* @property {function} write
		*/
		/**
		* Add additional text to be displayed with the built-in help.
		*
		* Position is 'before' or 'after' to affect just this command,
		* and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
		*
		* @param {string} position - before or after built-in help
		* @param {(string | Function)} text - string to add, or a function returning a string
		* @return {Command} `this` command for chaining
		*/
		addHelpText(position, text) {
			const allowedValues = [
				"beforeAll",
				"before",
				"after",
				"afterAll"
			];
			if (!allowedValues.includes(position)) throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
			const helpEvent = `${position}Help`;
			this.on(helpEvent, (context) => {
				let helpStr;
				if (typeof text === "function") helpStr = text({
					error: context.error,
					command: context.command
				});
				else helpStr = text;
				if (helpStr) context.write(`${helpStr}\n`);
			});
			return this;
		}
		/**
		* Output help information if help flags specified
		*
		* @param {Array} args - array of options to search for help flags
		* @private
		*/
		_outputHelpIfRequested(args) {
			const helpOption = this._getHelpOption();
			if (helpOption && args.find((arg) => helpOption.is(arg))) {
				this.outputHelp();
				this._exit(0, "commander.helpDisplayed", "(outputHelp)");
			}
		}
	};
	/**
	* Scan arguments and increment port number for inspect calls (to avoid conflicts when spawning new command).
	*
	* @param {string[]} args - array of arguments from node.execArgv
	* @returns {string[]}
	* @private
	*/
	function incrementNodeInspectorPort(args) {
		return args.map((arg) => {
			if (!arg.startsWith("--inspect")) return arg;
			let debugOption;
			let debugHost = "127.0.0.1";
			let debugPort = "9229";
			let match;
			if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) debugOption = match[1];
			else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
				debugOption = match[1];
				if (/^\d+$/.test(match[3])) debugPort = match[3];
				else debugHost = match[3];
			} else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
				debugOption = match[1];
				debugHost = match[3];
				debugPort = match[4];
			}
			if (debugOption && debugPort !== "0") return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
			return arg;
		});
	}
	/**
	* @returns {boolean | undefined}
	* @package
	*/
	function useColor() {
		if (process$1.env.NO_COLOR || process$1.env.FORCE_COLOR === "0" || process$1.env.FORCE_COLOR === "false") return false;
		if (process$1.env.FORCE_COLOR || process$1.env.CLICOLOR_FORCE !== void 0) return true;
	}
	exports.Command = Command;
	exports.useColor = useColor;
}));
var { program, createCommand, createArgument, createOption, CommanderError, InvalidArgumentError, InvalidOptionArgumentError, Command, Argument, Option, Help } = (/* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports) => {
	var { Argument } = require_argument();
	var { Command } = require_command();
	var { CommanderError, InvalidArgumentError } = require_error$1();
	var { Help } = require_help();
	var { Option } = require_option();
	exports.program = new Command();
	exports.createCommand = (name) => new Command(name);
	exports.createOption = (flags, description) => new Option(flags, description);
	exports.createArgument = (name, description) => new Argument(name, description);
	/**
	* Expose classes
	*/
	exports.Command = Command;
	exports.Option = Option;
	exports.Argument = Argument;
	exports.Help = Help;
	exports.CommanderError = CommanderError;
	exports.InvalidArgumentError = InvalidArgumentError;
	exports.InvalidOptionArgumentError = InvalidArgumentError;
})))(), 1)).default;
//#endregion
//#region src/command/common/command-core.ts
var commanderCore = (async function() {
	const { optionConversion } = optionUtility;
	const cliDir = path.dirname(fileURLToPath(import.meta.url));
	const versionJsonPath = path.join(cliDir, "version.json");
	const optionVersion = optionConversion(JSON.parse(await readFile(versionJsonPath, "utf8")).version);
	if (optionVersion.isNone) throw new Error("version is not found in version.json");
	const opts = new Command("create-react-template").version(optionVersion.value, "-v, --version", "output the current version").argument("[directory]").usage("[directory] [options]").helpOption("-h, --help", "display help for command").allowUnknownOption().option("-n, --name <name>", "specify the project name").option("-t, --tech-stack <techStack>", "specify the tech stack(react)").option("--rf, --react-framework <reactFramework>", "framework to use (tanstack-router | next/app | next/pages)").option("--vf, --vue-framework <vueFramework>", "vue framework to use (vue-router | nuxt)").option("-c,--css <css>", "select css framework (tailwind | vanilla-extract | scoped-css)").option("--use-all-components", "install all available components").parse(process.argv).opts();
	const optionName = optionConversion(opts.name);
	const optionReactFramework = optionConversion(opts.reactFramework);
	const optionVueFramework = optionConversion(opts.vueFramework);
	const optionTechStack = optionConversion(opts.techStack);
	const optionCss = optionConversion(opts.css);
	const optionUseAllComponents = optionConversion(opts.useAllComponents);
	const onPromptState = (state) => {
		if (state.aborted) {
			process.stdout.write("\x1B[?25h");
			process.stdout.write("\n");
			process.exit(1);
		}
	};
	return {
		onPromptState,
		optionName,
		optionReactFramework,
		optionVueFramework,
		optionTechStack,
		optionCss,
		optionUseAllComponents
	};
})();
//#endregion
//#region src/utils/result.ts
var basic = {
	RESULT_OK: "ok",
	RESULT_NG: "ng"
};
var noop = () => {};
var UNIT_SYMBOL = Symbol("UNIT_SYMBOL");
var resultUtility = (function() {
	const { RESULT_NG, RESULT_OK } = basic;
	const UNIT = Object.freeze({ _unit: UNIT_SYMBOL });
	const checkPromiseReturn = async ({ fn, err }) => {
		try {
			return createOk(await fn());
		} catch (e) {
			return createNg(err(e));
		}
	};
	const checkPromiseVoid = async ({ fn, err }) => {
		try {
			await fn();
			return createOk(UNIT);
		} catch (e) {
			return createNg(err(e));
		}
	};
	const checkResultReturn = ({ fn, err }) => {
		try {
			return createOk(fn());
		} catch (e) {
			return createNg(err(e));
		}
	};
	const checkResultVoid = ({ fn, err }) => {
		try {
			fn();
			return createOk(UNIT);
		} catch (e) {
			return createNg(err(e));
		}
	};
	const createOk = (value) => {
		return Object.freeze({
			kind: RESULT_OK,
			isOk: true,
			isErr: false,
			value
		});
	};
	const createNg = (err) => {
		return Object.freeze({
			kind: RESULT_NG,
			isOk: false,
			isErr: true,
			err
		});
	};
	return Object.freeze({
		UNIT,
		checkResultReturn,
		checkResultVoid,
		checkPromiseReturn,
		checkPromiseVoid,
		createOk,
		createNg
	});
})();
//#endregion
//#region node_modules/.pnpm/kleur@3.0.3/node_modules/kleur/index.js
var require_kleur = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { FORCE_COLOR, NODE_DISABLE_COLORS, TERM } = process.env;
	var $ = {
		enabled: !NODE_DISABLE_COLORS && TERM !== "dumb" && FORCE_COLOR !== "0",
		reset: init(0, 0),
		bold: init(1, 22),
		dim: init(2, 22),
		italic: init(3, 23),
		underline: init(4, 24),
		inverse: init(7, 27),
		hidden: init(8, 28),
		strikethrough: init(9, 29),
		black: init(30, 39),
		red: init(31, 39),
		green: init(32, 39),
		yellow: init(33, 39),
		blue: init(34, 39),
		magenta: init(35, 39),
		cyan: init(36, 39),
		white: init(37, 39),
		gray: init(90, 39),
		grey: init(90, 39),
		bgBlack: init(40, 49),
		bgRed: init(41, 49),
		bgGreen: init(42, 49),
		bgYellow: init(43, 49),
		bgBlue: init(44, 49),
		bgMagenta: init(45, 49),
		bgCyan: init(46, 49),
		bgWhite: init(47, 49)
	};
	function run(arr, str) {
		let i = 0, tmp, beg = "", end = "";
		for (; i < arr.length; i++) {
			tmp = arr[i];
			beg += tmp.open;
			end += tmp.close;
			if (str.includes(tmp.close)) str = str.replace(tmp.rgx, tmp.close + tmp.open);
		}
		return beg + str + end;
	}
	function chain(has, keys) {
		let ctx = {
			has,
			keys
		};
		ctx.reset = $.reset.bind(ctx);
		ctx.bold = $.bold.bind(ctx);
		ctx.dim = $.dim.bind(ctx);
		ctx.italic = $.italic.bind(ctx);
		ctx.underline = $.underline.bind(ctx);
		ctx.inverse = $.inverse.bind(ctx);
		ctx.hidden = $.hidden.bind(ctx);
		ctx.strikethrough = $.strikethrough.bind(ctx);
		ctx.black = $.black.bind(ctx);
		ctx.red = $.red.bind(ctx);
		ctx.green = $.green.bind(ctx);
		ctx.yellow = $.yellow.bind(ctx);
		ctx.blue = $.blue.bind(ctx);
		ctx.magenta = $.magenta.bind(ctx);
		ctx.cyan = $.cyan.bind(ctx);
		ctx.white = $.white.bind(ctx);
		ctx.gray = $.gray.bind(ctx);
		ctx.grey = $.grey.bind(ctx);
		ctx.bgBlack = $.bgBlack.bind(ctx);
		ctx.bgRed = $.bgRed.bind(ctx);
		ctx.bgGreen = $.bgGreen.bind(ctx);
		ctx.bgYellow = $.bgYellow.bind(ctx);
		ctx.bgBlue = $.bgBlue.bind(ctx);
		ctx.bgMagenta = $.bgMagenta.bind(ctx);
		ctx.bgCyan = $.bgCyan.bind(ctx);
		ctx.bgWhite = $.bgWhite.bind(ctx);
		return ctx;
	}
	function init(open, close) {
		let blk = {
			open: `\x1b[${open}m`,
			close: `\x1b[${close}m`,
			rgx: new RegExp(`\\x1b\\[${close}m`, "g")
		};
		return function(txt) {
			if (this !== void 0 && this.has !== void 0) {
				this.has.includes(open) || (this.has.push(open), this.keys.push(blk));
				return txt === void 0 ? this : $.enabled ? run(this.keys, txt + "") : txt + "";
			}
			return txt === void 0 ? chain([open], [blk]) : $.enabled ? run([blk], txt + "") : txt + "";
		};
	}
	module.exports = $;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/action.js
var require_action$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (key, isSelect) => {
		if (key.meta && key.name !== "escape") return;
		if (key.ctrl) {
			if (key.name === "a") return "first";
			if (key.name === "c") return "abort";
			if (key.name === "d") return "abort";
			if (key.name === "e") return "last";
			if (key.name === "g") return "reset";
		}
		if (isSelect) {
			if (key.name === "j") return "down";
			if (key.name === "k") return "up";
		}
		if (key.name === "return") return "submit";
		if (key.name === "enter") return "submit";
		if (key.name === "backspace") return "delete";
		if (key.name === "delete") return "deleteForward";
		if (key.name === "abort") return "abort";
		if (key.name === "escape") return "exit";
		if (key.name === "tab") return "next";
		if (key.name === "pagedown") return "nextPage";
		if (key.name === "pageup") return "prevPage";
		if (key.name === "home") return "home";
		if (key.name === "end") return "end";
		if (key.name === "up") return "up";
		if (key.name === "down") return "down";
		if (key.name === "right") return "right";
		if (key.name === "left") return "left";
		return false;
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/strip.js
var require_strip$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (str) => {
		const pattern = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"].join("|");
		const RGX = new RegExp(pattern, "g");
		return typeof str === "string" ? str.replace(RGX, "") : str;
	};
}));
//#endregion
//#region node_modules/.pnpm/sisteransi@1.0.5/node_modules/sisteransi/src/index.js
var require_src = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ESC = "\x1B";
	var CSI = `${ESC}[`;
	var beep = "\x07";
	var cursor = {
		to(x, y) {
			if (!y) return `${CSI}${x + 1}G`;
			return `${CSI}${y + 1};${x + 1}H`;
		},
		move(x, y) {
			let ret = "";
			if (x < 0) ret += `${CSI}${-x}D`;
			else if (x > 0) ret += `${CSI}${x}C`;
			if (y < 0) ret += `${CSI}${-y}A`;
			else if (y > 0) ret += `${CSI}${y}B`;
			return ret;
		},
		up: (count = 1) => `${CSI}${count}A`,
		down: (count = 1) => `${CSI}${count}B`,
		forward: (count = 1) => `${CSI}${count}C`,
		backward: (count = 1) => `${CSI}${count}D`,
		nextLine: (count = 1) => `${CSI}E`.repeat(count),
		prevLine: (count = 1) => `${CSI}F`.repeat(count),
		left: `${CSI}G`,
		hide: `${CSI}?25l`,
		show: `${CSI}?25h`,
		save: `${ESC}7`,
		restore: `${ESC}8`
	};
	module.exports = {
		cursor,
		scroll: {
			up: (count = 1) => `${CSI}S`.repeat(count),
			down: (count = 1) => `${CSI}T`.repeat(count)
		},
		erase: {
			screen: `${CSI}2J`,
			up: (count = 1) => `${CSI}1J`.repeat(count),
			down: (count = 1) => `${CSI}J`.repeat(count),
			line: `${CSI}2K`,
			lineEnd: `${CSI}K`,
			lineStart: `${CSI}1K`,
			lines(count) {
				let clear = "";
				for (let i = 0; i < count; i++) clear += this.line + (i < count - 1 ? cursor.up() : "");
				if (count) clear += cursor.left;
				return clear;
			}
		},
		beep
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/clear.js
var require_clear$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _createForOfIteratorHelper(o, allowArrayLike) {
		var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
		if (!it) {
			if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
				if (it) o = it;
				var i = 0;
				var F = function F() {};
				return {
					s: F,
					n: function n() {
						if (i >= o.length) return { done: true };
						return {
							done: false,
							value: o[i++]
						};
					},
					e: function e(_e) {
						throw _e;
					},
					f: F
				};
			}
			throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		}
		var normalCompletion = true, didErr = false, err;
		return {
			s: function s() {
				it = it.call(o);
			},
			n: function n() {
				var step = it.next();
				normalCompletion = step.done;
				return step;
			},
			e: function e(_e2) {
				didErr = true;
				err = _e2;
			},
			f: function f() {
				try {
					if (!normalCompletion && it.return != null) it.return();
				} finally {
					if (didErr) throw err;
				}
			}
		};
	}
	function _unsupportedIterableToArray(o, minLen) {
		if (!o) return;
		if (typeof o === "string") return _arrayLikeToArray(o, minLen);
		var n = Object.prototype.toString.call(o).slice(8, -1);
		if (n === "Object" && o.constructor) n = o.constructor.name;
		if (n === "Map" || n === "Set") return Array.from(o);
		if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}
	function _arrayLikeToArray(arr, len) {
		if (len == null || len > arr.length) len = arr.length;
		for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
		return arr2;
	}
	var strip = require_strip$1();
	var _require = require_src(), erase = _require.erase, cursor = _require.cursor;
	var width = (str) => [...strip(str)].length;
	/**
	* @param {string} prompt
	* @param {number} perLine
	*/
	module.exports = function(prompt, perLine) {
		if (!perLine) return erase.line + cursor.to(0);
		let rows = 0;
		var _iterator = _createForOfIteratorHelper(prompt.split(/\r?\n/)), _step;
		try {
			for (_iterator.s(); !(_step = _iterator.n()).done;) {
				let line = _step.value;
				rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
			}
		} catch (err) {
			_iterator.e(err);
		} finally {
			_iterator.f();
		}
		return erase.lines(rows);
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/figures.js
var require_figures$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var main = {
		arrowUp: "↑",
		arrowDown: "↓",
		arrowLeft: "←",
		arrowRight: "→",
		radioOn: "◉",
		radioOff: "◯",
		tick: "✔",
		cross: "✖",
		ellipsis: "…",
		pointerSmall: "›",
		line: "─",
		pointer: "❯"
	};
	var win = {
		arrowUp: main.arrowUp,
		arrowDown: main.arrowDown,
		arrowLeft: main.arrowLeft,
		arrowRight: main.arrowRight,
		radioOn: "(*)",
		radioOff: "( )",
		tick: "√",
		cross: "×",
		ellipsis: "...",
		pointerSmall: "»",
		line: "─",
		pointer: ">"
	};
	module.exports = process.platform === "win32" ? win : main;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/style.js
var require_style$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var c = require_kleur();
	var figures = require_figures$1();
	var styles = Object.freeze({
		password: {
			scale: 1,
			render: (input) => "*".repeat(input.length)
		},
		emoji: {
			scale: 2,
			render: (input) => "😃".repeat(input.length)
		},
		invisible: {
			scale: 0,
			render: (input) => ""
		},
		default: {
			scale: 1,
			render: (input) => `${input}`
		}
	});
	var render = (type) => styles[type] || styles.default;
	var symbols = Object.freeze({
		aborted: c.red(figures.cross),
		done: c.green(figures.tick),
		exited: c.yellow(figures.cross),
		default: c.cyan("?")
	});
	var symbol = (done, aborted, exited) => aborted ? symbols.aborted : exited ? symbols.exited : done ? symbols.done : symbols.default;
	var delimiter = (completing) => c.gray(completing ? figures.ellipsis : figures.pointerSmall);
	var item = (expandable, expanded) => c.gray(expandable ? expanded ? figures.pointerSmall : "+" : figures.line);
	module.exports = {
		styles,
		render,
		symbols,
		symbol,
		delimiter,
		item
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/lines.js
var require_lines$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var strip = require_strip$1();
	/**
	* @param {string} msg
	* @param {number} perLine
	*/
	module.exports = function(msg, perLine) {
		let lines = String(strip(msg) || "").split(/\r?\n/);
		if (!perLine) return lines.length;
		return lines.map((l) => Math.ceil(l.length / perLine)).reduce((a, b) => a + b);
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/wrap.js
var require_wrap$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* @param {string} msg The message to wrap
	* @param {object} opts
	* @param {number|string} [opts.margin] Left margin
	* @param {number} opts.width Maximum characters per line including the margin
	*/
	module.exports = (msg, opts = {}) => {
		const tab = Number.isSafeInteger(parseInt(opts.margin)) ? new Array(parseInt(opts.margin)).fill(" ").join("") : opts.margin || "";
		const width = opts.width;
		return (msg || "").split(/\r?\n/g).map((line) => line.split(/\s+/g).reduce((arr, w) => {
			if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width) arr[arr.length - 1] += ` ${w}`;
			else arr.push(`${tab}${w}`);
			return arr;
		}, [tab]).join("\n")).join("\n");
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/entriesToDisplay.js
var require_entriesToDisplay$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Determine what entries should be displayed on the screen, based on the
	* currently selected index and the maximum visible. Used in list-based
	* prompts like `select` and `multiselect`.
	*
	* @param {number} cursor the currently selected entry
	* @param {number} total the total entries available to display
	* @param {number} [maxVisible] the number of entries that can be displayed
	*/
	module.exports = (cursor, total, maxVisible) => {
		maxVisible = maxVisible || total;
		let startIndex = Math.min(total - maxVisible, cursor - Math.floor(maxVisible / 2));
		if (startIndex < 0) startIndex = 0;
		let endIndex = Math.min(startIndex + maxVisible, total);
		return {
			startIndex,
			endIndex
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/util/index.js
var require_util$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		action: require_action$1(),
		clear: require_clear$1(),
		style: require_style$1(),
		strip: require_strip$1(),
		figures: require_figures$1(),
		lines: require_lines$1(),
		wrap: require_wrap$1(),
		entriesToDisplay: require_entriesToDisplay$1()
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/prompt.js
var require_prompt$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var readline$1 = __require("readline");
	var action = require_util$1().action;
	var EventEmitter$1 = __require("events");
	var _require2 = require_src(), beep = _require2.beep, cursor = _require2.cursor;
	var color = require_kleur();
	/**
	* Base prompt skeleton
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var Prompt = class extends EventEmitter$1 {
		constructor(opts = {}) {
			super();
			this.firstRender = true;
			this.in = opts.stdin || process.stdin;
			this.out = opts.stdout || process.stdout;
			this.onRender = (opts.onRender || (() => void 0)).bind(this);
			const rl = readline$1.createInterface({
				input: this.in,
				escapeCodeTimeout: 50
			});
			readline$1.emitKeypressEvents(this.in, rl);
			if (this.in.isTTY) this.in.setRawMode(true);
			const isSelect = ["SelectPrompt", "MultiselectPrompt"].indexOf(this.constructor.name) > -1;
			const keypress = (str, key) => {
				let a = action(key, isSelect);
				if (a === false) this._ && this._(str, key);
				else if (typeof this[a] === "function") this[a](key);
				else this.bell();
			};
			this.close = () => {
				this.out.write(cursor.show);
				this.in.removeListener("keypress", keypress);
				if (this.in.isTTY) this.in.setRawMode(false);
				rl.close();
				this.emit(this.aborted ? "abort" : this.exited ? "exit" : "submit", this.value);
				this.closed = true;
			};
			this.in.on("keypress", keypress);
		}
		fire() {
			this.emit("state", {
				value: this.value,
				aborted: !!this.aborted,
				exited: !!this.exited
			});
		}
		bell() {
			this.out.write(beep);
		}
		render() {
			this.onRender(color);
			if (this.firstRender) this.firstRender = false;
		}
	};
	module.exports = Prompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/text.js
var require_text$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator(fn) {
		return function() {
			var self = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self, args);
				function _next(value) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	var color = require_kleur();
	var Prompt = require_prompt$1();
	var _require = require_src(), erase = _require.erase, cursor = _require.cursor;
	var _require2 = require_util$1(), style = _require2.style, clear = _require2.clear, lines = _require2.lines, figures = _require2.figures;
	/**
	* TextPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {String} [opts.style='default'] Render style
	* @param {String} [opts.initial] Default value
	* @param {Function} [opts.validate] Validate function
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.error] The invalid error label
	*/
	var TextPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.transform = style.render(opts.style);
			this.scale = this.transform.scale;
			this.msg = opts.message;
			this.initial = opts.initial || ``;
			this.validator = opts.validate || (() => true);
			this.value = ``;
			this.errorMsg = opts.error || `Please Enter A Valid Value`;
			this.cursor = Number(!!this.initial);
			this.cursorOffset = 0;
			this.clear = clear(``, this.out.columns);
			this.render();
		}
		set value(v) {
			if (!v && this.initial) {
				this.placeholder = true;
				this.rendered = color.gray(this.transform.render(this.initial));
			} else {
				this.placeholder = false;
				this.rendered = this.transform.render(v);
			}
			this._value = v;
			this.fire();
		}
		get value() {
			return this._value;
		}
		reset() {
			this.value = ``;
			this.cursor = Number(!!this.initial);
			this.cursorOffset = 0;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.value = this.value || this.initial;
			this.done = this.aborted = true;
			this.error = false;
			this.red = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		validate() {
			var _this = this;
			return _asyncToGenerator(function* () {
				let valid = yield _this.validator(_this.value);
				if (typeof valid === `string`) {
					_this.errorMsg = valid;
					valid = false;
				}
				_this.error = !valid;
			})();
		}
		submit() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				_this2.value = _this2.value || _this2.initial;
				_this2.cursorOffset = 0;
				_this2.cursor = _this2.rendered.length;
				yield _this2.validate();
				if (_this2.error) {
					_this2.red = true;
					_this2.fire();
					_this2.render();
					return;
				}
				_this2.done = true;
				_this2.aborted = false;
				_this2.fire();
				_this2.render();
				_this2.out.write("\n");
				_this2.close();
			})();
		}
		next() {
			if (!this.placeholder) return this.bell();
			this.value = this.initial;
			this.cursor = this.rendered.length;
			this.fire();
			this.render();
		}
		moveCursor(n) {
			if (this.placeholder) return;
			this.cursor = this.cursor + n;
			this.cursorOffset += n;
		}
		_(c, key) {
			let s1 = this.value.slice(0, this.cursor);
			this.value = `${s1}${c}${this.value.slice(this.cursor)}`;
			this.red = false;
			this.cursor = this.placeholder ? 0 : s1.length + 1;
			this.render();
		}
		delete() {
			if (this.isCursorAtStart()) return this.bell();
			this.value = `${this.value.slice(0, this.cursor - 1)}${this.value.slice(this.cursor)}`;
			this.red = false;
			if (this.isCursorAtStart()) this.cursorOffset = 0;
			else {
				this.cursorOffset++;
				this.moveCursor(-1);
			}
			this.render();
		}
		deleteForward() {
			if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
			this.value = `${this.value.slice(0, this.cursor)}${this.value.slice(this.cursor + 1)}`;
			this.red = false;
			if (this.isCursorAtEnd()) this.cursorOffset = 0;
			else this.cursorOffset++;
			this.render();
		}
		first() {
			this.cursor = 0;
			this.render();
		}
		last() {
			this.cursor = this.value.length;
			this.render();
		}
		left() {
			if (this.cursor <= 0 || this.placeholder) return this.bell();
			this.moveCursor(-1);
			this.render();
		}
		right() {
			if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
			this.moveCursor(1);
			this.render();
		}
		isCursorAtStart() {
			return this.cursor === 0 || this.placeholder && this.cursor === 1;
		}
		isCursorAtEnd() {
			return this.cursor === this.rendered.length || this.placeholder && this.cursor === this.rendered.length + 1;
		}
		render() {
			if (this.closed) return;
			if (!this.firstRender) {
				if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
				this.out.write(clear(this.outputText, this.out.columns));
			}
			super.render();
			this.outputError = "";
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.red ? color.red(this.rendered) : this.rendered
			].join(` `);
			if (this.error) this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? " " : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore + cursor.move(this.cursorOffset, 0));
		}
	};
	module.exports = TextPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/select.js
var require_select$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var color = require_kleur();
	var Prompt = require_prompt$1();
	var _require = require_util$1(), style = _require.style, clear = _require.clear, figures = _require.figures, wrap = _require.wrap, entriesToDisplay = _require.entriesToDisplay;
	var cursor = require_src().cursor;
	/**
	* SelectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {Number} [opts.initial] Index of default value
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {Number} [opts.optionsPerPage=10] Max options to display at once
	*/
	var SelectPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.hint = opts.hint || "- Use arrow-keys. Return to submit.";
			this.warn = opts.warn || "- This option is disabled";
			this.cursor = opts.initial || 0;
			this.choices = opts.choices.map((ch, idx) => {
				if (typeof ch === "string") ch = {
					title: ch,
					value: idx
				};
				return {
					title: ch && (ch.title || ch.value || ch),
					value: ch && (ch.value === void 0 ? idx : ch.value),
					description: ch && ch.description,
					selected: ch && ch.selected,
					disabled: ch && ch.disabled
				};
			});
			this.optionsPerPage = opts.optionsPerPage || 10;
			this.value = (this.choices[this.cursor] || {}).value;
			this.clear = clear("", this.out.columns);
			this.render();
		}
		moveCursor(n) {
			this.cursor = n;
			this.value = this.choices[n].value;
			this.fire();
		}
		reset() {
			this.moveCursor(0);
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			if (!this.selection.disabled) {
				this.done = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			} else this.bell();
		}
		first() {
			this.moveCursor(0);
			this.render();
		}
		last() {
			this.moveCursor(this.choices.length - 1);
			this.render();
		}
		up() {
			if (this.cursor === 0) this.moveCursor(this.choices.length - 1);
			else this.moveCursor(this.cursor - 1);
			this.render();
		}
		down() {
			if (this.cursor === this.choices.length - 1) this.moveCursor(0);
			else this.moveCursor(this.cursor + 1);
			this.render();
		}
		next() {
			this.moveCursor((this.cursor + 1) % this.choices.length);
			this.render();
		}
		_(c, key) {
			if (c === " ") return this.submit();
		}
		get selection() {
			return this.choices[this.cursor];
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			let _entriesToDisplay = entriesToDisplay(this.cursor, this.choices.length, this.optionsPerPage), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.done ? this.selection.title : this.selection.disabled ? color.yellow(this.warn) : color.gray(this.hint)
			].join(" ");
			if (!this.done) {
				this.outputText += "\n";
				for (let i = startIndex; i < endIndex; i++) {
					let title, prefix, desc = "", v = this.choices[i];
					if (i === startIndex && startIndex > 0) prefix = figures.arrowUp;
					else if (i === endIndex - 1 && endIndex < this.choices.length) prefix = figures.arrowDown;
					else prefix = " ";
					if (v.disabled) {
						title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
						prefix = (this.cursor === i ? color.bold().gray(figures.pointer) + " " : "  ") + prefix;
					} else {
						title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
						prefix = (this.cursor === i ? color.cyan(figures.pointer) + " " : "  ") + prefix;
						if (v.description && this.cursor === i) {
							desc = ` - ${v.description}`;
							if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
								margin: 3,
								width: this.out.columns
							});
						}
					}
					this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
				}
			}
			this.out.write(this.outputText);
		}
	};
	module.exports = SelectPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/toggle.js
var require_toggle$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var color = require_kleur();
	var Prompt = require_prompt$1();
	var _require = require_util$1(), style = _require.style, clear = _require.clear;
	var _require2 = require_src(), cursor = _require2.cursor, erase = _require2.erase;
	/**
	* TogglePrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Boolean} [opts.initial=false] Default value
	* @param {String} [opts.active='no'] Active label
	* @param {String} [opts.inactive='off'] Inactive label
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var TogglePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.value = !!opts.initial;
			this.active = opts.active || "on";
			this.inactive = opts.inactive || "off";
			this.initialValue = this.value;
			this.render();
		}
		reset() {
			this.value = this.initialValue;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		deactivate() {
			if (this.value === false) return this.bell();
			this.value = false;
			this.render();
		}
		activate() {
			if (this.value === true) return this.bell();
			this.value = true;
			this.render();
		}
		delete() {
			this.deactivate();
		}
		left() {
			this.deactivate();
		}
		right() {
			this.activate();
		}
		down() {
			this.deactivate();
		}
		up() {
			this.activate();
		}
		next() {
			this.value = !this.value;
			this.fire();
			this.render();
		}
		_(c, key) {
			if (c === " ") this.value = !this.value;
			else if (c === "1") this.value = true;
			else if (c === "0") this.value = false;
			else return this.bell();
			this.render();
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.value ? this.inactive : color.cyan().underline(this.inactive),
				color.gray("/"),
				this.value ? color.cyan().underline(this.active) : this.active
			].join(" ");
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = TogglePrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/datepart.js
var require_datepart$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = class DatePart {
		constructor({ token, date, parts, locales }) {
			this.token = token;
			this.date = date || /* @__PURE__ */ new Date();
			this.parts = parts || [this];
			this.locales = locales || {};
		}
		up() {}
		down() {}
		next() {
			const currentIdx = this.parts.indexOf(this);
			return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
		}
		setTo(val) {}
		prev() {
			let parts = [].concat(this.parts).reverse();
			const currentIdx = parts.indexOf(this);
			return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
		}
		toString() {
			return String(this.date);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/meridiem.js
var require_meridiem$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = require_datepart$1();
	var Meridiem = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setHours((this.date.getHours() + 12) % 24);
		}
		down() {
			this.up();
		}
		toString() {
			let meridiem = this.date.getHours() > 12 ? "pm" : "am";
			return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
		}
	};
	module.exports = Meridiem;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/day.js
var require_day$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = require_datepart$1();
	var pos = (n) => {
		n = n % 10;
		return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
	};
	var Day = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setDate(this.date.getDate() + 1);
		}
		down() {
			this.date.setDate(this.date.getDate() - 1);
		}
		setTo(val) {
			this.date.setDate(parseInt(val.substr(-2)));
		}
		toString() {
			let date = this.date.getDate();
			let day = this.date.getDay();
			return this.token === "DD" ? String(date).padStart(2, "0") : this.token === "Do" ? date + pos(date) : this.token === "d" ? day + 1 : this.token === "ddd" ? this.locales.weekdaysShort[day] : this.token === "dddd" ? this.locales.weekdays[day] : date;
		}
	};
	module.exports = Day;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/hours.js
var require_hours$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = require_datepart$1();
	var Hours = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setHours(this.date.getHours() + 1);
		}
		down() {
			this.date.setHours(this.date.getHours() - 1);
		}
		setTo(val) {
			this.date.setHours(parseInt(val.substr(-2)));
		}
		toString() {
			let hours = this.date.getHours();
			if (/h/.test(this.token)) hours = hours % 12 || 12;
			return this.token.length > 1 ? String(hours).padStart(2, "0") : hours;
		}
	};
	module.exports = Hours;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/milliseconds.js
var require_milliseconds$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = require_datepart$1();
	var Milliseconds = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMilliseconds(this.date.getMilliseconds() + 1);
		}
		down() {
			this.date.setMilliseconds(this.date.getMilliseconds() - 1);
		}
		setTo(val) {
			this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
		}
		toString() {
			return String(this.date.getMilliseconds()).padStart(4, "0").substr(0, this.token.length);
		}
	};
	module.exports = Milliseconds;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/minutes.js
var require_minutes$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = require_datepart$1();
	var Minutes = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMinutes(this.date.getMinutes() + 1);
		}
		down() {
			this.date.setMinutes(this.date.getMinutes() - 1);
		}
		setTo(val) {
			this.date.setMinutes(parseInt(val.substr(-2)));
		}
		toString() {
			let m = this.date.getMinutes();
			return this.token.length > 1 ? String(m).padStart(2, "0") : m;
		}
	};
	module.exports = Minutes;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/month.js
var require_month$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = require_datepart$1();
	var Month = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMonth(this.date.getMonth() + 1);
		}
		down() {
			this.date.setMonth(this.date.getMonth() - 1);
		}
		setTo(val) {
			val = parseInt(val.substr(-2)) - 1;
			this.date.setMonth(val < 0 ? 0 : val);
		}
		toString() {
			let month = this.date.getMonth();
			let tl = this.token.length;
			return tl === 2 ? String(month + 1).padStart(2, "0") : tl === 3 ? this.locales.monthsShort[month] : tl === 4 ? this.locales.months[month] : String(month + 1);
		}
	};
	module.exports = Month;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/seconds.js
var require_seconds$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = require_datepart$1();
	var Seconds = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setSeconds(this.date.getSeconds() + 1);
		}
		down() {
			this.date.setSeconds(this.date.getSeconds() - 1);
		}
		setTo(val) {
			this.date.setSeconds(parseInt(val.substr(-2)));
		}
		toString() {
			let s = this.date.getSeconds();
			return this.token.length > 1 ? String(s).padStart(2, "0") : s;
		}
	};
	module.exports = Seconds;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/year.js
var require_year$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = require_datepart$1();
	var Year = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setFullYear(this.date.getFullYear() + 1);
		}
		down() {
			this.date.setFullYear(this.date.getFullYear() - 1);
		}
		setTo(val) {
			this.date.setFullYear(val.substr(-4));
		}
		toString() {
			let year = String(this.date.getFullYear()).padStart(4, "0");
			return this.token.length === 2 ? year.substr(-2) : year;
		}
	};
	module.exports = Year;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/dateparts/index.js
var require_dateparts$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		DatePart: require_datepart$1(),
		Meridiem: require_meridiem$1(),
		Day: require_day$1(),
		Hours: require_hours$1(),
		Milliseconds: require_milliseconds$1(),
		Minutes: require_minutes$1(),
		Month: require_month$1(),
		Seconds: require_seconds$1(),
		Year: require_year$1()
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/date.js
var require_date$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator(fn) {
		return function() {
			var self = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self, args);
				function _next(value) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	var color = require_kleur();
	var Prompt = require_prompt$1();
	var _require = require_util$1(), style = _require.style, clear = _require.clear, figures = _require.figures;
	var _require2 = require_src(), erase = _require2.erase, cursor = _require2.cursor;
	var _require3 = require_dateparts$1(), DatePart = _require3.DatePart, Meridiem = _require3.Meridiem, Day = _require3.Day, Hours = _require3.Hours, Milliseconds = _require3.Milliseconds, Minutes = _require3.Minutes, Month = _require3.Month, Seconds = _require3.Seconds, Year = _require3.Year;
	var regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
	var regexGroups = {
		1: ({ token }) => token.replace(/\\(.)/g, "$1"),
		2: (opts) => new Day(opts),
		3: (opts) => new Month(opts),
		4: (opts) => new Year(opts),
		5: (opts) => new Meridiem(opts),
		6: (opts) => new Hours(opts),
		7: (opts) => new Minutes(opts),
		8: (opts) => new Seconds(opts),
		9: (opts) => new Milliseconds(opts)
	};
	var dfltLocales = {
		months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
		monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
		weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
		weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
	};
	/**
	* DatePrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Number} [opts.initial] Index of default value
	* @param {String} [opts.mask] The format mask
	* @param {object} [opts.locales] The date locales
	* @param {String} [opts.error] The error message shown on invalid value
	* @param {Function} [opts.validate] Function to validate the submitted value
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var DatePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.cursor = 0;
			this.typed = "";
			this.locales = Object.assign(dfltLocales, opts.locales);
			this._date = opts.initial || /* @__PURE__ */ new Date();
			this.errorMsg = opts.error || "Please Enter A Valid Value";
			this.validator = opts.validate || (() => true);
			this.mask = opts.mask || "YYYY-MM-DD HH:mm:ss";
			this.clear = clear("", this.out.columns);
			this.render();
		}
		get value() {
			return this.date;
		}
		get date() {
			return this._date;
		}
		set date(date) {
			if (date) this._date.setTime(date.getTime());
		}
		set mask(mask) {
			let result;
			this.parts = [];
			while (result = regex.exec(mask)) {
				let match = result.shift();
				let idx = result.findIndex((gr) => gr != null);
				this.parts.push(idx in regexGroups ? regexGroups[idx]({
					token: result[idx] || match,
					date: this.date,
					parts: this.parts,
					locales: this.locales
				}) : result[idx] || match);
			}
			let parts = this.parts.reduce((arr, i) => {
				if (typeof i === "string" && typeof arr[arr.length - 1] === "string") arr[arr.length - 1] += i;
				else arr.push(i);
				return arr;
			}, []);
			this.parts.splice(0);
			this.parts.push(...parts);
			this.reset();
		}
		moveCursor(n) {
			this.typed = "";
			this.cursor = n;
			this.fire();
		}
		reset() {
			this.moveCursor(this.parts.findIndex((p) => p instanceof DatePart));
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.error = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		validate() {
			var _this = this;
			return _asyncToGenerator(function* () {
				let valid = yield _this.validator(_this.value);
				if (typeof valid === "string") {
					_this.errorMsg = valid;
					valid = false;
				}
				_this.error = !valid;
			})();
		}
		submit() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				yield _this2.validate();
				if (_this2.error) {
					_this2.color = "red";
					_this2.fire();
					_this2.render();
					return;
				}
				_this2.done = true;
				_this2.aborted = false;
				_this2.fire();
				_this2.render();
				_this2.out.write("\n");
				_this2.close();
			})();
		}
		up() {
			this.typed = "";
			this.parts[this.cursor].up();
			this.render();
		}
		down() {
			this.typed = "";
			this.parts[this.cursor].down();
			this.render();
		}
		left() {
			let prev = this.parts[this.cursor].prev();
			if (prev == null) return this.bell();
			this.moveCursor(this.parts.indexOf(prev));
			this.render();
		}
		right() {
			let next = this.parts[this.cursor].next();
			if (next == null) return this.bell();
			this.moveCursor(this.parts.indexOf(next));
			this.render();
		}
		next() {
			let next = this.parts[this.cursor].next();
			this.moveCursor(next ? this.parts.indexOf(next) : this.parts.findIndex((part) => part instanceof DatePart));
			this.render();
		}
		_(c) {
			if (/\d/.test(c)) {
				this.typed += c;
				this.parts[this.cursor].setTo(this.typed);
				this.render();
			}
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color.cyan().underline(p.toString()) : p), []).join("")
			].join(" ");
			if (this.error) this.outputText += this.errorMsg.split("\n").reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = DatePrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/number.js
var require_number$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator(fn) {
		return function() {
			var self = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self, args);
				function _next(value) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	var color = require_kleur();
	var Prompt = require_prompt$1();
	var _require = require_src(), cursor = _require.cursor, erase = _require.erase;
	var _require2 = require_util$1(), style = _require2.style, figures = _require2.figures, clear = _require2.clear, lines = _require2.lines;
	var isNumber = /[0-9]/;
	var isDef = (any) => any !== void 0;
	var round = (number, precision) => {
		let factor = Math.pow(10, precision);
		return Math.round(number * factor) / factor;
	};
	/**
	* NumberPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {String} [opts.style='default'] Render style
	* @param {Number} [opts.initial] Default value
	* @param {Number} [opts.max=+Infinity] Max value
	* @param {Number} [opts.min=-Infinity] Min value
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {Function} [opts.validate] Validate function
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.error] The invalid error label
	*/
	var NumberPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.transform = style.render(opts.style);
			this.msg = opts.message;
			this.initial = isDef(opts.initial) ? opts.initial : "";
			this.float = !!opts.float;
			this.round = opts.round || 2;
			this.inc = opts.increment || 1;
			this.min = isDef(opts.min) ? opts.min : -Infinity;
			this.max = isDef(opts.max) ? opts.max : Infinity;
			this.errorMsg = opts.error || `Please Enter A Valid Value`;
			this.validator = opts.validate || (() => true);
			this.color = `cyan`;
			this.value = ``;
			this.typed = ``;
			this.lastHit = 0;
			this.render();
		}
		set value(v) {
			if (!v && v !== 0) {
				this.placeholder = true;
				this.rendered = color.gray(this.transform.render(`${this.initial}`));
				this._value = ``;
			} else {
				this.placeholder = false;
				this.rendered = this.transform.render(`${round(v, this.round)}`);
				this._value = round(v, this.round);
			}
			this.fire();
		}
		get value() {
			return this._value;
		}
		parse(x) {
			return this.float ? parseFloat(x) : parseInt(x);
		}
		valid(c) {
			return c === `-` || c === `.` && this.float || isNumber.test(c);
		}
		reset() {
			this.typed = ``;
			this.value = ``;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			let x = this.value;
			this.value = x !== `` ? x : this.initial;
			this.done = this.aborted = true;
			this.error = false;
			this.fire();
			this.render();
			this.out.write(`\n`);
			this.close();
		}
		validate() {
			var _this = this;
			return _asyncToGenerator(function* () {
				let valid = yield _this.validator(_this.value);
				if (typeof valid === `string`) {
					_this.errorMsg = valid;
					valid = false;
				}
				_this.error = !valid;
			})();
		}
		submit() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				yield _this2.validate();
				if (_this2.error) {
					_this2.color = `red`;
					_this2.fire();
					_this2.render();
					return;
				}
				let x = _this2.value;
				_this2.value = x !== `` ? x : _this2.initial;
				_this2.done = true;
				_this2.aborted = false;
				_this2.error = false;
				_this2.fire();
				_this2.render();
				_this2.out.write(`\n`);
				_this2.close();
			})();
		}
		up() {
			this.typed = ``;
			if (this.value === "") this.value = this.min - this.inc;
			if (this.value >= this.max) return this.bell();
			this.value += this.inc;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		down() {
			this.typed = ``;
			if (this.value === "") this.value = this.min + this.inc;
			if (this.value <= this.min) return this.bell();
			this.value -= this.inc;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		delete() {
			let val = this.value.toString();
			if (val.length === 0) return this.bell();
			this.value = this.parse(val = val.slice(0, -1)) || ``;
			if (this.value !== "" && this.value < this.min) this.value = this.min;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		next() {
			this.value = this.initial;
			this.fire();
			this.render();
		}
		_(c, key) {
			if (!this.valid(c)) return this.bell();
			const now = Date.now();
			if (now - this.lastHit > 1e3) this.typed = ``;
			this.typed += c;
			this.lastHit = now;
			this.color = `cyan`;
			if (c === `.`) return this.fire();
			this.value = Math.min(this.parse(this.typed), this.max);
			if (this.value > this.max) this.value = this.max;
			if (this.value < this.min) this.value = this.min;
			this.fire();
			this.render();
		}
		render() {
			if (this.closed) return;
			if (!this.firstRender) {
				if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
				this.out.write(clear(this.outputText, this.out.columns));
			}
			super.render();
			this.outputError = "";
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				!this.done || !this.done && !this.placeholder ? color[this.color]().underline(this.rendered) : this.rendered
			].join(` `);
			if (this.error) this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
		}
	};
	module.exports = NumberPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/multiselect.js
var require_multiselect$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var color = require_kleur();
	var cursor = require_src().cursor;
	var Prompt = require_prompt$1();
	var _require2 = require_util$1(), clear = _require2.clear, figures = _require2.figures, style = _require2.style, wrap = _require2.wrap, entriesToDisplay = _require2.entriesToDisplay;
	/**
	* MultiselectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {String} [opts.warn] Hint shown for disabled choices
	* @param {Number} [opts.max] Max choices
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {Number} [opts.optionsPerPage=10] Max options to display at once
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var MultiselectPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.cursor = opts.cursor || 0;
			this.scrollIndex = opts.cursor || 0;
			this.hint = opts.hint || "";
			this.warn = opts.warn || "- This option is disabled -";
			this.minSelected = opts.min;
			this.showMinError = false;
			this.maxChoices = opts.max;
			this.instructions = opts.instructions;
			this.optionsPerPage = opts.optionsPerPage || 10;
			this.value = opts.choices.map((ch, idx) => {
				if (typeof ch === "string") ch = {
					title: ch,
					value: idx
				};
				return {
					title: ch && (ch.title || ch.value || ch),
					description: ch && ch.description,
					value: ch && (ch.value === void 0 ? idx : ch.value),
					selected: ch && ch.selected,
					disabled: ch && ch.disabled
				};
			});
			this.clear = clear("", this.out.columns);
			if (!opts.overrideRender) this.render();
		}
		reset() {
			this.value.map((v) => !v.selected);
			this.cursor = 0;
			this.fire();
			this.render();
		}
		selected() {
			return this.value.filter((v) => v.selected);
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			const selected = this.value.filter((e) => e.selected);
			if (this.minSelected && selected.length < this.minSelected) {
				this.showMinError = true;
				this.render();
			} else {
				this.done = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			}
		}
		first() {
			this.cursor = 0;
			this.render();
		}
		last() {
			this.cursor = this.value.length - 1;
			this.render();
		}
		next() {
			this.cursor = (this.cursor + 1) % this.value.length;
			this.render();
		}
		up() {
			if (this.cursor === 0) this.cursor = this.value.length - 1;
			else this.cursor--;
			this.render();
		}
		down() {
			if (this.cursor === this.value.length - 1) this.cursor = 0;
			else this.cursor++;
			this.render();
		}
		left() {
			this.value[this.cursor].selected = false;
			this.render();
		}
		right() {
			if (this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			this.value[this.cursor].selected = true;
			this.render();
		}
		handleSpaceToggle() {
			const v = this.value[this.cursor];
			if (v.selected) {
				v.selected = false;
				this.render();
			} else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			else {
				v.selected = true;
				this.render();
			}
		}
		toggleAll() {
			if (this.maxChoices !== void 0 || this.value[this.cursor].disabled) return this.bell();
			const newSelected = !this.value[this.cursor].selected;
			this.value.filter((v) => !v.disabled).forEach((v) => v.selected = newSelected);
			this.render();
		}
		_(c, key) {
			if (c === " ") this.handleSpaceToggle();
			else if (c === "a") this.toggleAll();
			else return this.bell();
		}
		renderInstructions() {
			if (this.instructions === void 0 || this.instructions) {
				if (typeof this.instructions === "string") return this.instructions;
				return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option\n    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection\n` + (this.maxChoices === void 0 ? `    a: Toggle all\n` : "") + `    enter/return: Complete answer`;
			}
			return "";
		}
		renderOption(cursor, v, i, arrowIndicator) {
			const prefix = (v.selected ? color.green(figures.radioOn) : figures.radioOff) + " " + arrowIndicator + " ";
			let title, desc;
			if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
			else {
				title = cursor === i ? color.cyan().underline(v.title) : v.title;
				if (cursor === i && v.description) {
					desc = ` - ${v.description}`;
					if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
						margin: prefix.length,
						width: this.out.columns
					});
				}
			}
			return prefix + title + color.gray(desc || "");
		}
		paginateOptions(options) {
			if (options.length === 0) return color.red("No matches for this query.");
			let _entriesToDisplay = entriesToDisplay(this.cursor, options.length, this.optionsPerPage), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
			let prefix, styledOptions = [];
			for (let i = startIndex; i < endIndex; i++) {
				if (i === startIndex && startIndex > 0) prefix = figures.arrowUp;
				else if (i === endIndex - 1 && endIndex < options.length) prefix = figures.arrowDown;
				else prefix = " ";
				styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
			}
			return "\n" + styledOptions.join("\n");
		}
		renderOptions(options) {
			if (!this.done) return this.paginateOptions(options);
			return "";
		}
		renderDoneOrInstructions() {
			if (this.done) return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
			const output = [color.gray(this.hint), this.renderInstructions()];
			if (this.value[this.cursor].disabled) output.push(color.yellow(this.warn));
			return output.join(" ");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			super.render();
			let prompt = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.renderDoneOrInstructions()
			].join(" ");
			if (this.showMinError) {
				prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
				this.showMinError = false;
			}
			prompt += this.renderOptions(this.value);
			this.out.write(this.clear + prompt);
			this.clear = clear(prompt, this.out.columns);
		}
	};
	module.exports = MultiselectPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/autocomplete.js
var require_autocomplete$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator(fn) {
		return function() {
			var self = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self, args);
				function _next(value) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	var color = require_kleur();
	var Prompt = require_prompt$1();
	var _require = require_src(), erase = _require.erase, cursor = _require.cursor;
	var _require2 = require_util$1(), style = _require2.style, clear = _require2.clear, figures = _require2.figures, wrap = _require2.wrap, entriesToDisplay = _require2.entriesToDisplay;
	var getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);
	var getTitle = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);
	var getIndex = (arr, valOrTitle) => {
		const index = arr.findIndex((el) => el.value === valOrTitle || el.title === valOrTitle);
		return index > -1 ? index : void 0;
	};
	/**
	* TextPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of auto-complete choices objects
	* @param {Function} [opts.suggest] Filter function. Defaults to sort by title
	* @param {Number} [opts.limit=10] Max number of results to show
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {String} [opts.style='default'] Render style
	* @param {String} [opts.fallback] Fallback message - initial to default value
	* @param {String} [opts.initial] Index of the default value
	* @param {Boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.noMatches] The no matches found label
	*/
	var AutocompletePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.suggest = opts.suggest;
			this.choices = opts.choices;
			this.initial = typeof opts.initial === "number" ? opts.initial : getIndex(opts.choices, opts.initial);
			this.select = this.initial || opts.cursor || 0;
			this.i18n = { noMatches: opts.noMatches || "no matches found" };
			this.fallback = opts.fallback || this.initial;
			this.clearFirst = opts.clearFirst || false;
			this.suggestions = [];
			this.input = "";
			this.limit = opts.limit || 10;
			this.cursor = 0;
			this.transform = style.render(opts.style);
			this.scale = this.transform.scale;
			this.render = this.render.bind(this);
			this.complete = this.complete.bind(this);
			this.clear = clear("", this.out.columns);
			this.complete(this.render);
			this.render();
		}
		set fallback(fb) {
			this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
		}
		get fallback() {
			let choice;
			if (typeof this._fb === "number") choice = this.choices[this._fb];
			else if (typeof this._fb === "string") choice = { title: this._fb };
			return choice || this._fb || { title: this.i18n.noMatches };
		}
		moveSelect(i) {
			this.select = i;
			if (this.suggestions.length > 0) this.value = getVal(this.suggestions, i);
			else this.value = this.fallback.value;
			this.fire();
		}
		complete(cb) {
			var _this = this;
			return _asyncToGenerator(function* () {
				const p = _this.completing = _this.suggest(_this.input, _this.choices);
				const suggestions = yield p;
				if (_this.completing !== p) return;
				_this.suggestions = suggestions.map((s, i, arr) => ({
					title: getTitle(arr, i),
					value: getVal(arr, i),
					description: s.description
				}));
				_this.completing = false;
				const l = Math.max(suggestions.length - 1, 0);
				_this.moveSelect(Math.min(l, _this.select));
				cb && cb();
			})();
		}
		reset() {
			this.input = "";
			this.complete(() => {
				this.moveSelect(this.initial !== void 0 ? this.initial : 0);
				this.render();
			});
			this.render();
		}
		exit() {
			if (this.clearFirst && this.input.length > 0) this.reset();
			else {
				this.done = this.exited = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			}
		}
		abort() {
			this.done = this.aborted = true;
			this.exited = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.done = true;
			this.aborted = this.exited = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		_(c, key) {
			let s1 = this.input.slice(0, this.cursor);
			this.input = `${s1}${c}${this.input.slice(this.cursor)}`;
			this.cursor = s1.length + 1;
			this.complete(this.render);
			this.render();
		}
		delete() {
			if (this.cursor === 0) return this.bell();
			this.input = `${this.input.slice(0, this.cursor - 1)}${this.input.slice(this.cursor)}`;
			this.complete(this.render);
			this.cursor = this.cursor - 1;
			this.render();
		}
		deleteForward() {
			if (this.cursor * this.scale >= this.rendered.length) return this.bell();
			this.input = `${this.input.slice(0, this.cursor)}${this.input.slice(this.cursor + 1)}`;
			this.complete(this.render);
			this.render();
		}
		first() {
			this.moveSelect(0);
			this.render();
		}
		last() {
			this.moveSelect(this.suggestions.length - 1);
			this.render();
		}
		up() {
			if (this.select === 0) this.moveSelect(this.suggestions.length - 1);
			else this.moveSelect(this.select - 1);
			this.render();
		}
		down() {
			if (this.select === this.suggestions.length - 1) this.moveSelect(0);
			else this.moveSelect(this.select + 1);
			this.render();
		}
		next() {
			if (this.select === this.suggestions.length - 1) this.moveSelect(0);
			else this.moveSelect(this.select + 1);
			this.render();
		}
		nextPage() {
			this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
			this.render();
		}
		prevPage() {
			this.moveSelect(Math.max(this.select - this.limit, 0));
			this.render();
		}
		left() {
			if (this.cursor <= 0) return this.bell();
			this.cursor = this.cursor - 1;
			this.render();
		}
		right() {
			if (this.cursor * this.scale >= this.rendered.length) return this.bell();
			this.cursor = this.cursor + 1;
			this.render();
		}
		renderOption(v, hovered, isStart, isEnd) {
			let desc;
			let prefix = isStart ? figures.arrowUp : isEnd ? figures.arrowDown : " ";
			let title = hovered ? color.cyan().underline(v.title) : v.title;
			prefix = (hovered ? color.cyan(figures.pointer) + " " : "  ") + prefix;
			if (v.description) {
				desc = ` - ${v.description}`;
				if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
					margin: 3,
					width: this.out.columns
				});
			}
			return prefix + " " + title + color.gray(desc || "");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			let _entriesToDisplay = entriesToDisplay(this.select, this.choices.length, this.limit), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
			this.outputText = [
				style.symbol(this.done, this.aborted, this.exited),
				color.bold(this.msg),
				style.delimiter(this.completing),
				this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)
			].join(" ");
			if (!this.done) {
				const suggestions = this.suggestions.slice(startIndex, endIndex).map((item, i) => this.renderOption(item, this.select === i + startIndex, i === 0 && startIndex > 0, i + startIndex === endIndex - 1 && endIndex < this.choices.length)).join("\n");
				this.outputText += `\n` + (suggestions || color.gray(this.fallback.title));
			}
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = AutocompletePrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/autocompleteMultiselect.js
var require_autocompleteMultiselect$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var color = require_kleur();
	var cursor = require_src().cursor;
	var MultiselectPrompt = require_multiselect$1();
	var _require2 = require_util$1(), clear = _require2.clear, style = _require2.style, figures = _require2.figures;
	/**
	* MultiselectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {String} [opts.warn] Hint shown for disabled choices
	* @param {Number} [opts.max] Max choices
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var AutocompleteMultiselectPrompt = class extends MultiselectPrompt {
		constructor(opts = {}) {
			opts.overrideRender = true;
			super(opts);
			this.inputValue = "";
			this.clear = clear("", this.out.columns);
			this.filteredOptions = this.value;
			this.render();
		}
		last() {
			this.cursor = this.filteredOptions.length - 1;
			this.render();
		}
		next() {
			this.cursor = (this.cursor + 1) % this.filteredOptions.length;
			this.render();
		}
		up() {
			if (this.cursor === 0) this.cursor = this.filteredOptions.length - 1;
			else this.cursor--;
			this.render();
		}
		down() {
			if (this.cursor === this.filteredOptions.length - 1) this.cursor = 0;
			else this.cursor++;
			this.render();
		}
		left() {
			this.filteredOptions[this.cursor].selected = false;
			this.render();
		}
		right() {
			if (this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			this.filteredOptions[this.cursor].selected = true;
			this.render();
		}
		delete() {
			if (this.inputValue.length) {
				this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
				this.updateFilteredOptions();
			}
		}
		updateFilteredOptions() {
			const currentHighlight = this.filteredOptions[this.cursor];
			this.filteredOptions = this.value.filter((v) => {
				if (this.inputValue) {
					if (typeof v.title === "string") {
						if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) return true;
					}
					if (typeof v.value === "string") {
						if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) return true;
					}
					return false;
				}
				return true;
			});
			const newHighlightIndex = this.filteredOptions.findIndex((v) => v === currentHighlight);
			this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
			this.render();
		}
		handleSpaceToggle() {
			const v = this.filteredOptions[this.cursor];
			if (v.selected) {
				v.selected = false;
				this.render();
			} else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			else {
				v.selected = true;
				this.render();
			}
		}
		handleInputChange(c) {
			this.inputValue = this.inputValue + c;
			this.updateFilteredOptions();
		}
		_(c, key) {
			if (c === " ") this.handleSpaceToggle();
			else this.handleInputChange(c);
		}
		renderInstructions() {
			if (this.instructions === void 0 || this.instructions) {
				if (typeof this.instructions === "string") return this.instructions;
				return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
			}
			return "";
		}
		renderCurrentInput() {
			return `
Filtered results for: ${this.inputValue ? this.inputValue : color.gray("Enter something to filter")}\n`;
		}
		renderOption(cursor, v, i) {
			let title;
			if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
			else title = cursor === i ? color.cyan().underline(v.title) : v.title;
			return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + "  " + title;
		}
		renderDoneOrInstructions() {
			if (this.done) return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
			const output = [
				color.gray(this.hint),
				this.renderInstructions(),
				this.renderCurrentInput()
			];
			if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) output.push(color.yellow(this.warn));
			return output.join(" ");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			super.render();
			let prompt = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.renderDoneOrInstructions()
			].join(" ");
			if (this.showMinError) {
				prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
				this.showMinError = false;
			}
			prompt += this.renderOptions(this.filteredOptions);
			this.out.write(this.clear + prompt);
			this.clear = clear(prompt, this.out.columns);
		}
	};
	module.exports = AutocompleteMultiselectPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/confirm.js
var require_confirm$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var color = require_kleur();
	var Prompt = require_prompt$1();
	var _require = require_util$1(), style = _require.style, clear = _require.clear;
	var _require2 = require_src(), erase = _require2.erase, cursor = _require2.cursor;
	/**
	* ConfirmPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Boolean} [opts.initial] Default value (true/false)
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.yes] The "Yes" label
	* @param {String} [opts.yesOption] The "Yes" option when choosing between yes/no
	* @param {String} [opts.no] The "No" label
	* @param {String} [opts.noOption] The "No" option when choosing between yes/no
	*/
	var ConfirmPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.value = opts.initial;
			this.initialValue = !!opts.initial;
			this.yesMsg = opts.yes || "yes";
			this.yesOption = opts.yesOption || "(Y/n)";
			this.noMsg = opts.no || "no";
			this.noOption = opts.noOption || "(y/N)";
			this.render();
		}
		reset() {
			this.value = this.initialValue;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.value = this.value || false;
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		_(c, key) {
			if (c.toLowerCase() === "y") {
				this.value = true;
				return this.submit();
			}
			if (c.toLowerCase() === "n") {
				this.value = false;
				return this.submit();
			}
			return this.bell();
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.done ? this.value ? this.yesMsg : this.noMsg : color.gray(this.initialValue ? this.yesOption : this.noOption)
			].join(" ");
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = ConfirmPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/elements/index.js
var require_elements$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		TextPrompt: require_text$1(),
		SelectPrompt: require_select$1(),
		TogglePrompt: require_toggle$1(),
		DatePrompt: require_date$1(),
		NumberPrompt: require_number$1(),
		MultiselectPrompt: require_multiselect$1(),
		AutocompletePrompt: require_autocomplete$1(),
		AutocompleteMultiselectPrompt: require_autocompleteMultiselect$1(),
		ConfirmPrompt: require_confirm$1()
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/prompts.js
var require_prompts$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var $ = exports;
	var el = require_elements$1();
	var noop = (v) => v;
	function toPrompt(type, args, opts = {}) {
		return new Promise((res, rej) => {
			const p = new el[type](args);
			const onAbort = opts.onAbort || noop;
			const onSubmit = opts.onSubmit || noop;
			const onExit = opts.onExit || noop;
			p.on("state", args.onState || noop);
			p.on("submit", (x) => res(onSubmit(x)));
			p.on("exit", (x) => res(onExit(x)));
			p.on("abort", (x) => rej(onAbort(x)));
		});
	}
	/**
	* Text prompt
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.text = (args) => toPrompt("TextPrompt", args);
	/**
	* Password prompt with masked input
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.password = (args) => {
		args.style = "password";
		return $.text(args);
	};
	/**
	* Prompt where input is invisible, like sudo
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.invisible = (args) => {
		args.style = "invisible";
		return $.text(args);
	};
	/**
	* Number prompt
	* @param {string} args.message Prompt message to display
	* @param {number} args.initial Default number value
	* @param {function} [args.onState] On state change callback
	* @param {number} [args.max] Max value
	* @param {number} [args.min] Min value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.number = (args) => toPrompt("NumberPrompt", args);
	/**
	* Date prompt
	* @param {string} args.message Prompt message to display
	* @param {number} args.initial Default number value
	* @param {function} [args.onState] On state change callback
	* @param {number} [args.max] Max value
	* @param {number} [args.min] Min value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.date = (args) => toPrompt("DatePrompt", args);
	/**
	* Classic yes/no prompt
	* @param {string} args.message Prompt message to display
	* @param {boolean} [args.initial=false] Default value
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.confirm = (args) => toPrompt("ConfirmPrompt", args);
	/**
	* List prompt, split intput string by `seperator`
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {string} [args.separator] String separator
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input, in form of an `Array`
	*/
	$.list = (args) => {
		const sep = args.separator || ",";
		return toPrompt("TextPrompt", args, { onSubmit: (str) => str.split(sep).map((s) => s.trim()) });
	};
	/**
	* Toggle/switch prompt
	* @param {string} args.message Prompt message to display
	* @param {boolean} [args.initial=false] Default value
	* @param {string} [args.active="on"] Text for `active` state
	* @param {string} [args.inactive="off"] Text for `inactive` state
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.toggle = (args) => toPrompt("TogglePrompt", args);
	/**
	* Interactive select prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of choices objects `[{ title, value }, ...]`
	* @param {number} [args.initial] Index of default value
	* @param {String} [args.hint] Hint to display
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.select = (args) => toPrompt("SelectPrompt", args);
	/**
	* Interactive multi-select / autocompleteMultiselect prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
	* @param {number} [args.max] Max select
	* @param {string} [args.hint] Hint to display user
	* @param {Number} [args.cursor=0] Cursor start position
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.multiselect = (args) => {
		args.choices = [].concat(args.choices || []);
		const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
		return toPrompt("MultiselectPrompt", args, {
			onAbort: toSelected,
			onSubmit: toSelected
		});
	};
	$.autocompleteMultiselect = (args) => {
		args.choices = [].concat(args.choices || []);
		const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
		return toPrompt("AutocompleteMultiselectPrompt", args, {
			onAbort: toSelected,
			onSubmit: toSelected
		});
	};
	var byTitle = (input, choices) => Promise.resolve(choices.filter((item) => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
	/**
	* Interactive auto-complete prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of auto-complete choices objects `[{ title, value }, ...]`
	* @param {Function} [args.suggest] Function to filter results based on user input. Defaults to sort by `title`
	* @param {number} [args.limit=10] Max number of results to show
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {String} [args.initial] Index of the default value
	* @param {boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	* @param {String} [args.fallback] Fallback message - defaults to initial value
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.autocomplete = (args) => {
		args.suggest = args.suggest || byTitle;
		args.choices = [].concat(args.choices || []);
		return toPrompt("AutocompletePrompt", args);
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function ownKeys(object, enumerableOnly) {
		var keys = Object.keys(object);
		if (Object.getOwnPropertySymbols) {
			var symbols = Object.getOwnPropertySymbols(object);
			if (enumerableOnly) symbols = symbols.filter(function(sym) {
				return Object.getOwnPropertyDescriptor(object, sym).enumerable;
			});
			keys.push.apply(keys, symbols);
		}
		return keys;
	}
	function _objectSpread(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i] != null ? arguments[i] : {};
			if (i % 2) ownKeys(Object(source), true).forEach(function(key) {
				_defineProperty(target, key, source[key]);
			});
			else if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
			else ownKeys(Object(source)).forEach(function(key) {
				Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
			});
		}
		return target;
	}
	function _defineProperty(obj, key, value) {
		if (key in obj) Object.defineProperty(obj, key, {
			value,
			enumerable: true,
			configurable: true,
			writable: true
		});
		else obj[key] = value;
		return obj;
	}
	function _createForOfIteratorHelper(o, allowArrayLike) {
		var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
		if (!it) {
			if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
				if (it) o = it;
				var i = 0;
				var F = function F() {};
				return {
					s: F,
					n: function n() {
						if (i >= o.length) return { done: true };
						return {
							done: false,
							value: o[i++]
						};
					},
					e: function e(_e) {
						throw _e;
					},
					f: F
				};
			}
			throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		}
		var normalCompletion = true, didErr = false, err;
		return {
			s: function s() {
				it = it.call(o);
			},
			n: function n() {
				var step = it.next();
				normalCompletion = step.done;
				return step;
			},
			e: function e(_e2) {
				didErr = true;
				err = _e2;
			},
			f: function f() {
				try {
					if (!normalCompletion && it.return != null) it.return();
				} finally {
					if (didErr) throw err;
				}
			}
		};
	}
	function _unsupportedIterableToArray(o, minLen) {
		if (!o) return;
		if (typeof o === "string") return _arrayLikeToArray(o, minLen);
		var n = Object.prototype.toString.call(o).slice(8, -1);
		if (n === "Object" && o.constructor) n = o.constructor.name;
		if (n === "Map" || n === "Set") return Array.from(o);
		if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}
	function _arrayLikeToArray(arr, len) {
		if (len == null || len > arr.length) len = arr.length;
		for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
		return arr2;
	}
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
		try {
			var info = gen[key](arg);
			var value = info.value;
		} catch (error) {
			reject(error);
			return;
		}
		if (info.done) resolve(value);
		else Promise.resolve(value).then(_next, _throw);
	}
	function _asyncToGenerator(fn) {
		return function() {
			var self = this, args = arguments;
			return new Promise(function(resolve, reject) {
				var gen = fn.apply(self, args);
				function _next(value) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
				}
				function _throw(err) {
					asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
				}
				_next(void 0);
			});
		};
	}
	var prompts = require_prompts$2();
	var passOn = [
		"suggest",
		"format",
		"onState",
		"validate",
		"onRender",
		"type"
	];
	var noop = () => {};
	/**
	* Prompt for a series of questions
	* @param {Array|Object} questions Single question object or Array of question objects
	* @param {Function} [onSubmit] Callback function called on prompt submit
	* @param {Function} [onCancel] Callback function called on cancel/abort
	* @returns {Object} Object with values from user input
	*/
	function prompt() {
		return _prompt.apply(this, arguments);
	}
	function _prompt() {
		_prompt = _asyncToGenerator(function* (questions = [], { onSubmit = noop, onCancel = noop } = {}) {
			const answers = {};
			const override = prompt._override || {};
			questions = [].concat(questions);
			let answer, question, quit, name, type, lastPrompt;
			const getFormattedAnswer = /* @__PURE__ */ function() {
				var _ref = _asyncToGenerator(function* (question, answer, skipValidation = false) {
					if (!skipValidation && question.validate && question.validate(answer) !== true) return;
					return question.format ? yield question.format(answer, answers) : answer;
				});
				return function getFormattedAnswer(_x, _x2) {
					return _ref.apply(this, arguments);
				};
			}();
			var _iterator = _createForOfIteratorHelper(questions), _step;
			try {
				for (_iterator.s(); !(_step = _iterator.n()).done;) {
					question = _step.value;
					var _question = question;
					name = _question.name;
					type = _question.type;
					if (typeof type === "function") {
						type = yield type(answer, _objectSpread({}, answers), question);
						question["type"] = type;
					}
					if (!type) continue;
					for (let key in question) {
						if (passOn.includes(key)) continue;
						let value = question[key];
						question[key] = typeof value === "function" ? yield value(answer, _objectSpread({}, answers), lastPrompt) : value;
					}
					lastPrompt = question;
					if (typeof question.message !== "string") throw new Error("prompt message is required");
					var _question2 = question;
					name = _question2.name;
					type = _question2.type;
					if (prompts[type] === void 0) throw new Error(`prompt type (${type}) is not defined`);
					if (override[question.name] !== void 0) {
						answer = yield getFormattedAnswer(question, override[question.name]);
						if (answer !== void 0) {
							answers[name] = answer;
							continue;
						}
					}
					try {
						answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : yield prompts[type](question);
						answers[name] = answer = yield getFormattedAnswer(question, answer, true);
						quit = yield onSubmit(question, answer, answers);
					} catch (err) {
						quit = !(yield onCancel(question, answers));
					}
					if (quit) return answers;
				}
			} catch (err) {
				_iterator.e(err);
			} finally {
				_iterator.f();
			}
			return answers;
		});
		return _prompt.apply(this, arguments);
	}
	function getInjectedAnswer(injected, deafultValue) {
		const answer = injected.shift();
		if (answer instanceof Error) throw answer;
		return answer === void 0 ? deafultValue : answer;
	}
	function inject(answers) {
		prompt._injected = (prompt._injected || []).concat(answers);
	}
	function override(answers) {
		prompt._override = Object.assign({}, answers);
	}
	module.exports = Object.assign(prompt, {
		prompt,
		prompts,
		inject,
		override
	});
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/action.js
var require_action = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (key, isSelect) => {
		if (key.meta && key.name !== "escape") return;
		if (key.ctrl) {
			if (key.name === "a") return "first";
			if (key.name === "c") return "abort";
			if (key.name === "d") return "abort";
			if (key.name === "e") return "last";
			if (key.name === "g") return "reset";
		}
		if (isSelect) {
			if (key.name === "j") return "down";
			if (key.name === "k") return "up";
		}
		if (key.name === "return") return "submit";
		if (key.name === "enter") return "submit";
		if (key.name === "backspace") return "delete";
		if (key.name === "delete") return "deleteForward";
		if (key.name === "abort") return "abort";
		if (key.name === "escape") return "exit";
		if (key.name === "tab") return "next";
		if (key.name === "pagedown") return "nextPage";
		if (key.name === "pageup") return "prevPage";
		if (key.name === "home") return "home";
		if (key.name === "end") return "end";
		if (key.name === "up") return "up";
		if (key.name === "down") return "down";
		if (key.name === "right") return "right";
		if (key.name === "left") return "left";
		return false;
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/strip.js
var require_strip = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (str) => {
		const pattern = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"].join("|");
		const RGX = new RegExp(pattern, "g");
		return typeof str === "string" ? str.replace(RGX, "") : str;
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/clear.js
var require_clear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var strip = require_strip();
	var { erase, cursor } = require_src();
	var width = (str) => [...strip(str)].length;
	/**
	* @param {string} prompt
	* @param {number} perLine
	*/
	module.exports = function(prompt, perLine) {
		if (!perLine) return erase.line + cursor.to(0);
		let rows = 0;
		const lines = prompt.split(/\r?\n/);
		for (let line of lines) rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
		return erase.lines(rows);
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/figures.js
var require_figures = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var main = {
		arrowUp: "↑",
		arrowDown: "↓",
		arrowLeft: "←",
		arrowRight: "→",
		radioOn: "◉",
		radioOff: "◯",
		tick: "✔",
		cross: "✖",
		ellipsis: "…",
		pointerSmall: "›",
		line: "─",
		pointer: "❯"
	};
	var win = {
		arrowUp: main.arrowUp,
		arrowDown: main.arrowDown,
		arrowLeft: main.arrowLeft,
		arrowRight: main.arrowRight,
		radioOn: "(*)",
		radioOff: "( )",
		tick: "√",
		cross: "×",
		ellipsis: "...",
		pointerSmall: "»",
		line: "─",
		pointer: ">"
	};
	module.exports = process.platform === "win32" ? win : main;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/style.js
var require_style = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var c = require_kleur();
	var figures = require_figures();
	var styles = Object.freeze({
		password: {
			scale: 1,
			render: (input) => "*".repeat(input.length)
		},
		emoji: {
			scale: 2,
			render: (input) => "😃".repeat(input.length)
		},
		invisible: {
			scale: 0,
			render: (input) => ""
		},
		default: {
			scale: 1,
			render: (input) => `${input}`
		}
	});
	var render = (type) => styles[type] || styles.default;
	var symbols = Object.freeze({
		aborted: c.red(figures.cross),
		done: c.green(figures.tick),
		exited: c.yellow(figures.cross),
		default: c.cyan("?")
	});
	var symbol = (done, aborted, exited) => aborted ? symbols.aborted : exited ? symbols.exited : done ? symbols.done : symbols.default;
	var delimiter = (completing) => c.gray(completing ? figures.ellipsis : figures.pointerSmall);
	var item = (expandable, expanded) => c.gray(expandable ? expanded ? figures.pointerSmall : "+" : figures.line);
	module.exports = {
		styles,
		render,
		symbols,
		symbol,
		delimiter,
		item
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/lines.js
var require_lines = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var strip = require_strip();
	/**
	* @param {string} msg
	* @param {number} perLine
	*/
	module.exports = function(msg, perLine) {
		let lines = String(strip(msg) || "").split(/\r?\n/);
		if (!perLine) return lines.length;
		return lines.map((l) => Math.ceil(l.length / perLine)).reduce((a, b) => a + b);
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/wrap.js
var require_wrap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* @param {string} msg The message to wrap
	* @param {object} opts
	* @param {number|string} [opts.margin] Left margin
	* @param {number} opts.width Maximum characters per line including the margin
	*/
	module.exports = (msg, opts = {}) => {
		const tab = Number.isSafeInteger(parseInt(opts.margin)) ? new Array(parseInt(opts.margin)).fill(" ").join("") : opts.margin || "";
		const width = opts.width;
		return (msg || "").split(/\r?\n/g).map((line) => line.split(/\s+/g).reduce((arr, w) => {
			if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width) arr[arr.length - 1] += ` ${w}`;
			else arr.push(`${tab}${w}`);
			return arr;
		}, [tab]).join("\n")).join("\n");
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/entriesToDisplay.js
var require_entriesToDisplay = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Determine what entries should be displayed on the screen, based on the
	* currently selected index and the maximum visible. Used in list-based
	* prompts like `select` and `multiselect`.
	*
	* @param {number} cursor the currently selected entry
	* @param {number} total the total entries available to display
	* @param {number} [maxVisible] the number of entries that can be displayed
	*/
	module.exports = (cursor, total, maxVisible) => {
		maxVisible = maxVisible || total;
		let startIndex = Math.min(total - maxVisible, cursor - Math.floor(maxVisible / 2));
		if (startIndex < 0) startIndex = 0;
		let endIndex = Math.min(startIndex + maxVisible, total);
		return {
			startIndex,
			endIndex
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/index.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		action: require_action(),
		clear: require_clear(),
		style: require_style(),
		strip: require_strip(),
		figures: require_figures(),
		lines: require_lines(),
		wrap: require_wrap(),
		entriesToDisplay: require_entriesToDisplay()
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/prompt.js
var require_prompt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var readline = __require("readline");
	var { action } = require_util();
	var EventEmitter = __require("events");
	var { beep, cursor } = require_src();
	var color = require_kleur();
	/**
	* Base prompt skeleton
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var Prompt = class extends EventEmitter {
		constructor(opts = {}) {
			super();
			this.firstRender = true;
			this.in = opts.stdin || process.stdin;
			this.out = opts.stdout || process.stdout;
			this.onRender = (opts.onRender || (() => void 0)).bind(this);
			const rl = readline.createInterface({
				input: this.in,
				escapeCodeTimeout: 50
			});
			readline.emitKeypressEvents(this.in, rl);
			if (this.in.isTTY) this.in.setRawMode(true);
			const isSelect = ["SelectPrompt", "MultiselectPrompt"].indexOf(this.constructor.name) > -1;
			const keypress = (str, key) => {
				let a = action(key, isSelect);
				if (a === false) this._ && this._(str, key);
				else if (typeof this[a] === "function") this[a](key);
				else this.bell();
			};
			this.close = () => {
				this.out.write(cursor.show);
				this.in.removeListener("keypress", keypress);
				if (this.in.isTTY) this.in.setRawMode(false);
				rl.close();
				this.emit(this.aborted ? "abort" : this.exited ? "exit" : "submit", this.value);
				this.closed = true;
			};
			this.in.on("keypress", keypress);
		}
		fire() {
			this.emit("state", {
				value: this.value,
				aborted: !!this.aborted,
				exited: !!this.exited
			});
		}
		bell() {
			this.out.write(beep);
		}
		render() {
			this.onRender(color);
			if (this.firstRender) this.firstRender = false;
		}
	};
	module.exports = Prompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/text.js
var require_text = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var color = require_kleur();
	var Prompt = require_prompt();
	var { erase, cursor } = require_src();
	var { style, clear, lines, figures } = require_util();
	/**
	* TextPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {String} [opts.style='default'] Render style
	* @param {String} [opts.initial] Default value
	* @param {Function} [opts.validate] Validate function
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.error] The invalid error label
	*/
	var TextPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.transform = style.render(opts.style);
			this.scale = this.transform.scale;
			this.msg = opts.message;
			this.initial = opts.initial || ``;
			this.validator = opts.validate || (() => true);
			this.value = ``;
			this.errorMsg = opts.error || `Please Enter A Valid Value`;
			this.cursor = Number(!!this.initial);
			this.cursorOffset = 0;
			this.clear = clear(``, this.out.columns);
			this.render();
		}
		set value(v) {
			if (!v && this.initial) {
				this.placeholder = true;
				this.rendered = color.gray(this.transform.render(this.initial));
			} else {
				this.placeholder = false;
				this.rendered = this.transform.render(v);
			}
			this._value = v;
			this.fire();
		}
		get value() {
			return this._value;
		}
		reset() {
			this.value = ``;
			this.cursor = Number(!!this.initial);
			this.cursorOffset = 0;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.value = this.value || this.initial;
			this.done = this.aborted = true;
			this.error = false;
			this.red = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		async validate() {
			let valid = await this.validator(this.value);
			if (typeof valid === `string`) {
				this.errorMsg = valid;
				valid = false;
			}
			this.error = !valid;
		}
		async submit() {
			this.value = this.value || this.initial;
			this.cursorOffset = 0;
			this.cursor = this.rendered.length;
			await this.validate();
			if (this.error) {
				this.red = true;
				this.fire();
				this.render();
				return;
			}
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		next() {
			if (!this.placeholder) return this.bell();
			this.value = this.initial;
			this.cursor = this.rendered.length;
			this.fire();
			this.render();
		}
		moveCursor(n) {
			if (this.placeholder) return;
			this.cursor = this.cursor + n;
			this.cursorOffset += n;
		}
		_(c, key) {
			let s1 = this.value.slice(0, this.cursor);
			this.value = `${s1}${c}${this.value.slice(this.cursor)}`;
			this.red = false;
			this.cursor = this.placeholder ? 0 : s1.length + 1;
			this.render();
		}
		delete() {
			if (this.isCursorAtStart()) return this.bell();
			this.value = `${this.value.slice(0, this.cursor - 1)}${this.value.slice(this.cursor)}`;
			this.red = false;
			if (this.isCursorAtStart()) this.cursorOffset = 0;
			else {
				this.cursorOffset++;
				this.moveCursor(-1);
			}
			this.render();
		}
		deleteForward() {
			if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
			this.value = `${this.value.slice(0, this.cursor)}${this.value.slice(this.cursor + 1)}`;
			this.red = false;
			if (this.isCursorAtEnd()) this.cursorOffset = 0;
			else this.cursorOffset++;
			this.render();
		}
		first() {
			this.cursor = 0;
			this.render();
		}
		last() {
			this.cursor = this.value.length;
			this.render();
		}
		left() {
			if (this.cursor <= 0 || this.placeholder) return this.bell();
			this.moveCursor(-1);
			this.render();
		}
		right() {
			if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
			this.moveCursor(1);
			this.render();
		}
		isCursorAtStart() {
			return this.cursor === 0 || this.placeholder && this.cursor === 1;
		}
		isCursorAtEnd() {
			return this.cursor === this.rendered.length || this.placeholder && this.cursor === this.rendered.length + 1;
		}
		render() {
			if (this.closed) return;
			if (!this.firstRender) {
				if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
				this.out.write(clear(this.outputText, this.out.columns));
			}
			super.render();
			this.outputError = "";
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.red ? color.red(this.rendered) : this.rendered
			].join(` `);
			if (this.error) this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? " " : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore + cursor.move(this.cursorOffset, 0));
		}
	};
	module.exports = TextPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/select.js
var require_select = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var color = require_kleur();
	var Prompt = require_prompt();
	var { style, clear, figures, wrap, entriesToDisplay } = require_util();
	var { cursor } = require_src();
	/**
	* SelectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {Number} [opts.initial] Index of default value
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {Number} [opts.optionsPerPage=10] Max options to display at once
	*/
	var SelectPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.hint = opts.hint || "- Use arrow-keys. Return to submit.";
			this.warn = opts.warn || "- This option is disabled";
			this.cursor = opts.initial || 0;
			this.choices = opts.choices.map((ch, idx) => {
				if (typeof ch === "string") ch = {
					title: ch,
					value: idx
				};
				return {
					title: ch && (ch.title || ch.value || ch),
					value: ch && (ch.value === void 0 ? idx : ch.value),
					description: ch && ch.description,
					selected: ch && ch.selected,
					disabled: ch && ch.disabled
				};
			});
			this.optionsPerPage = opts.optionsPerPage || 10;
			this.value = (this.choices[this.cursor] || {}).value;
			this.clear = clear("", this.out.columns);
			this.render();
		}
		moveCursor(n) {
			this.cursor = n;
			this.value = this.choices[n].value;
			this.fire();
		}
		reset() {
			this.moveCursor(0);
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			if (!this.selection.disabled) {
				this.done = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			} else this.bell();
		}
		first() {
			this.moveCursor(0);
			this.render();
		}
		last() {
			this.moveCursor(this.choices.length - 1);
			this.render();
		}
		up() {
			if (this.cursor === 0) this.moveCursor(this.choices.length - 1);
			else this.moveCursor(this.cursor - 1);
			this.render();
		}
		down() {
			if (this.cursor === this.choices.length - 1) this.moveCursor(0);
			else this.moveCursor(this.cursor + 1);
			this.render();
		}
		next() {
			this.moveCursor((this.cursor + 1) % this.choices.length);
			this.render();
		}
		_(c, key) {
			if (c === " ") return this.submit();
		}
		get selection() {
			return this.choices[this.cursor];
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			let { startIndex, endIndex } = entriesToDisplay(this.cursor, this.choices.length, this.optionsPerPage);
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.done ? this.selection.title : this.selection.disabled ? color.yellow(this.warn) : color.gray(this.hint)
			].join(" ");
			if (!this.done) {
				this.outputText += "\n";
				for (let i = startIndex; i < endIndex; i++) {
					let title, prefix, desc = "", v = this.choices[i];
					if (i === startIndex && startIndex > 0) prefix = figures.arrowUp;
					else if (i === endIndex - 1 && endIndex < this.choices.length) prefix = figures.arrowDown;
					else prefix = " ";
					if (v.disabled) {
						title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
						prefix = (this.cursor === i ? color.bold().gray(figures.pointer) + " " : "  ") + prefix;
					} else {
						title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
						prefix = (this.cursor === i ? color.cyan(figures.pointer) + " " : "  ") + prefix;
						if (v.description && this.cursor === i) {
							desc = ` - ${v.description}`;
							if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
								margin: 3,
								width: this.out.columns
							});
						}
					}
					this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
				}
			}
			this.out.write(this.outputText);
		}
	};
	module.exports = SelectPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/toggle.js
var require_toggle = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var color = require_kleur();
	var Prompt = require_prompt();
	var { style, clear } = require_util();
	var { cursor, erase } = require_src();
	/**
	* TogglePrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Boolean} [opts.initial=false] Default value
	* @param {String} [opts.active='no'] Active label
	* @param {String} [opts.inactive='off'] Inactive label
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var TogglePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.value = !!opts.initial;
			this.active = opts.active || "on";
			this.inactive = opts.inactive || "off";
			this.initialValue = this.value;
			this.render();
		}
		reset() {
			this.value = this.initialValue;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		deactivate() {
			if (this.value === false) return this.bell();
			this.value = false;
			this.render();
		}
		activate() {
			if (this.value === true) return this.bell();
			this.value = true;
			this.render();
		}
		delete() {
			this.deactivate();
		}
		left() {
			this.deactivate();
		}
		right() {
			this.activate();
		}
		down() {
			this.deactivate();
		}
		up() {
			this.activate();
		}
		next() {
			this.value = !this.value;
			this.fire();
			this.render();
		}
		_(c, key) {
			if (c === " ") this.value = !this.value;
			else if (c === "1") this.value = true;
			else if (c === "0") this.value = false;
			else return this.bell();
			this.render();
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.value ? this.inactive : color.cyan().underline(this.inactive),
				color.gray("/"),
				this.value ? color.cyan().underline(this.active) : this.active
			].join(" ");
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = TogglePrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/datepart.js
var require_datepart = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = class DatePart {
		constructor({ token, date, parts, locales }) {
			this.token = token;
			this.date = date || /* @__PURE__ */ new Date();
			this.parts = parts || [this];
			this.locales = locales || {};
		}
		up() {}
		down() {}
		next() {
			const currentIdx = this.parts.indexOf(this);
			return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
		}
		setTo(val) {}
		prev() {
			let parts = [].concat(this.parts).reverse();
			const currentIdx = parts.indexOf(this);
			return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
		}
		toString() {
			return String(this.date);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/meridiem.js
var require_meridiem = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = require_datepart();
	var Meridiem = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setHours((this.date.getHours() + 12) % 24);
		}
		down() {
			this.up();
		}
		toString() {
			let meridiem = this.date.getHours() > 12 ? "pm" : "am";
			return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
		}
	};
	module.exports = Meridiem;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/day.js
var require_day = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = require_datepart();
	var pos = (n) => {
		n = n % 10;
		return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
	};
	var Day = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setDate(this.date.getDate() + 1);
		}
		down() {
			this.date.setDate(this.date.getDate() - 1);
		}
		setTo(val) {
			this.date.setDate(parseInt(val.substr(-2)));
		}
		toString() {
			let date = this.date.getDate();
			let day = this.date.getDay();
			return this.token === "DD" ? String(date).padStart(2, "0") : this.token === "Do" ? date + pos(date) : this.token === "d" ? day + 1 : this.token === "ddd" ? this.locales.weekdaysShort[day] : this.token === "dddd" ? this.locales.weekdays[day] : date;
		}
	};
	module.exports = Day;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/hours.js
var require_hours = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = require_datepart();
	var Hours = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setHours(this.date.getHours() + 1);
		}
		down() {
			this.date.setHours(this.date.getHours() - 1);
		}
		setTo(val) {
			this.date.setHours(parseInt(val.substr(-2)));
		}
		toString() {
			let hours = this.date.getHours();
			if (/h/.test(this.token)) hours = hours % 12 || 12;
			return this.token.length > 1 ? String(hours).padStart(2, "0") : hours;
		}
	};
	module.exports = Hours;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/milliseconds.js
var require_milliseconds = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = require_datepart();
	var Milliseconds = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMilliseconds(this.date.getMilliseconds() + 1);
		}
		down() {
			this.date.setMilliseconds(this.date.getMilliseconds() - 1);
		}
		setTo(val) {
			this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
		}
		toString() {
			return String(this.date.getMilliseconds()).padStart(4, "0").substr(0, this.token.length);
		}
	};
	module.exports = Milliseconds;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/minutes.js
var require_minutes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = require_datepart();
	var Minutes = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMinutes(this.date.getMinutes() + 1);
		}
		down() {
			this.date.setMinutes(this.date.getMinutes() - 1);
		}
		setTo(val) {
			this.date.setMinutes(parseInt(val.substr(-2)));
		}
		toString() {
			let m = this.date.getMinutes();
			return this.token.length > 1 ? String(m).padStart(2, "0") : m;
		}
	};
	module.exports = Minutes;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/month.js
var require_month = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = require_datepart();
	var Month = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setMonth(this.date.getMonth() + 1);
		}
		down() {
			this.date.setMonth(this.date.getMonth() - 1);
		}
		setTo(val) {
			val = parseInt(val.substr(-2)) - 1;
			this.date.setMonth(val < 0 ? 0 : val);
		}
		toString() {
			let month = this.date.getMonth();
			let tl = this.token.length;
			return tl === 2 ? String(month + 1).padStart(2, "0") : tl === 3 ? this.locales.monthsShort[month] : tl === 4 ? this.locales.months[month] : String(month + 1);
		}
	};
	module.exports = Month;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/seconds.js
var require_seconds = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = require_datepart();
	var Seconds = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setSeconds(this.date.getSeconds() + 1);
		}
		down() {
			this.date.setSeconds(this.date.getSeconds() - 1);
		}
		setTo(val) {
			this.date.setSeconds(parseInt(val.substr(-2)));
		}
		toString() {
			let s = this.date.getSeconds();
			return this.token.length > 1 ? String(s).padStart(2, "0") : s;
		}
	};
	module.exports = Seconds;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/year.js
var require_year = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DatePart = require_datepart();
	var Year = class extends DatePart {
		constructor(opts = {}) {
			super(opts);
		}
		up() {
			this.date.setFullYear(this.date.getFullYear() + 1);
		}
		down() {
			this.date.setFullYear(this.date.getFullYear() - 1);
		}
		setTo(val) {
			this.date.setFullYear(val.substr(-4));
		}
		toString() {
			let year = String(this.date.getFullYear()).padStart(4, "0");
			return this.token.length === 2 ? year.substr(-2) : year;
		}
	};
	module.exports = Year;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/dateparts/index.js
var require_dateparts = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		DatePart: require_datepart(),
		Meridiem: require_meridiem(),
		Day: require_day(),
		Hours: require_hours(),
		Milliseconds: require_milliseconds(),
		Minutes: require_minutes(),
		Month: require_month(),
		Seconds: require_seconds(),
		Year: require_year()
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/date.js
var require_date = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var color = require_kleur();
	var Prompt = require_prompt();
	var { style, clear, figures } = require_util();
	var { erase, cursor } = require_src();
	var { DatePart, Meridiem, Day, Hours, Milliseconds, Minutes, Month, Seconds, Year } = require_dateparts();
	var regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
	var regexGroups = {
		1: ({ token }) => token.replace(/\\(.)/g, "$1"),
		2: (opts) => new Day(opts),
		3: (opts) => new Month(opts),
		4: (opts) => new Year(opts),
		5: (opts) => new Meridiem(opts),
		6: (opts) => new Hours(opts),
		7: (opts) => new Minutes(opts),
		8: (opts) => new Seconds(opts),
		9: (opts) => new Milliseconds(opts)
	};
	var dfltLocales = {
		months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
		monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
		weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
		weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
	};
	/**
	* DatePrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Number} [opts.initial] Index of default value
	* @param {String} [opts.mask] The format mask
	* @param {object} [opts.locales] The date locales
	* @param {String} [opts.error] The error message shown on invalid value
	* @param {Function} [opts.validate] Function to validate the submitted value
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var DatePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.cursor = 0;
			this.typed = "";
			this.locales = Object.assign(dfltLocales, opts.locales);
			this._date = opts.initial || /* @__PURE__ */ new Date();
			this.errorMsg = opts.error || "Please Enter A Valid Value";
			this.validator = opts.validate || (() => true);
			this.mask = opts.mask || "YYYY-MM-DD HH:mm:ss";
			this.clear = clear("", this.out.columns);
			this.render();
		}
		get value() {
			return this.date;
		}
		get date() {
			return this._date;
		}
		set date(date) {
			if (date) this._date.setTime(date.getTime());
		}
		set mask(mask) {
			let result;
			this.parts = [];
			while (result = regex.exec(mask)) {
				let match = result.shift();
				let idx = result.findIndex((gr) => gr != null);
				this.parts.push(idx in regexGroups ? regexGroups[idx]({
					token: result[idx] || match,
					date: this.date,
					parts: this.parts,
					locales: this.locales
				}) : result[idx] || match);
			}
			let parts = this.parts.reduce((arr, i) => {
				if (typeof i === "string" && typeof arr[arr.length - 1] === "string") arr[arr.length - 1] += i;
				else arr.push(i);
				return arr;
			}, []);
			this.parts.splice(0);
			this.parts.push(...parts);
			this.reset();
		}
		moveCursor(n) {
			this.typed = "";
			this.cursor = n;
			this.fire();
		}
		reset() {
			this.moveCursor(this.parts.findIndex((p) => p instanceof DatePart));
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.error = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		async validate() {
			let valid = await this.validator(this.value);
			if (typeof valid === "string") {
				this.errorMsg = valid;
				valid = false;
			}
			this.error = !valid;
		}
		async submit() {
			await this.validate();
			if (this.error) {
				this.color = "red";
				this.fire();
				this.render();
				return;
			}
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		up() {
			this.typed = "";
			this.parts[this.cursor].up();
			this.render();
		}
		down() {
			this.typed = "";
			this.parts[this.cursor].down();
			this.render();
		}
		left() {
			let prev = this.parts[this.cursor].prev();
			if (prev == null) return this.bell();
			this.moveCursor(this.parts.indexOf(prev));
			this.render();
		}
		right() {
			let next = this.parts[this.cursor].next();
			if (next == null) return this.bell();
			this.moveCursor(this.parts.indexOf(next));
			this.render();
		}
		next() {
			let next = this.parts[this.cursor].next();
			this.moveCursor(next ? this.parts.indexOf(next) : this.parts.findIndex((part) => part instanceof DatePart));
			this.render();
		}
		_(c) {
			if (/\d/.test(c)) {
				this.typed += c;
				this.parts[this.cursor].setTo(this.typed);
				this.render();
			}
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color.cyan().underline(p.toString()) : p), []).join("")
			].join(" ");
			if (this.error) this.outputText += this.errorMsg.split("\n").reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = DatePrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/number.js
var require_number = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var color = require_kleur();
	var Prompt = require_prompt();
	var { cursor, erase } = require_src();
	var { style, figures, clear, lines } = require_util();
	var isNumber = /[0-9]/;
	var isDef = (any) => any !== void 0;
	var round = (number, precision) => {
		let factor = Math.pow(10, precision);
		return Math.round(number * factor) / factor;
	};
	/**
	* NumberPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {String} [opts.style='default'] Render style
	* @param {Number} [opts.initial] Default value
	* @param {Number} [opts.max=+Infinity] Max value
	* @param {Number} [opts.min=-Infinity] Min value
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {Function} [opts.validate] Validate function
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.error] The invalid error label
	*/
	var NumberPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.transform = style.render(opts.style);
			this.msg = opts.message;
			this.initial = isDef(opts.initial) ? opts.initial : "";
			this.float = !!opts.float;
			this.round = opts.round || 2;
			this.inc = opts.increment || 1;
			this.min = isDef(opts.min) ? opts.min : -Infinity;
			this.max = isDef(opts.max) ? opts.max : Infinity;
			this.errorMsg = opts.error || `Please Enter A Valid Value`;
			this.validator = opts.validate || (() => true);
			this.color = `cyan`;
			this.value = ``;
			this.typed = ``;
			this.lastHit = 0;
			this.render();
		}
		set value(v) {
			if (!v && v !== 0) {
				this.placeholder = true;
				this.rendered = color.gray(this.transform.render(`${this.initial}`));
				this._value = ``;
			} else {
				this.placeholder = false;
				this.rendered = this.transform.render(`${round(v, this.round)}`);
				this._value = round(v, this.round);
			}
			this.fire();
		}
		get value() {
			return this._value;
		}
		parse(x) {
			return this.float ? parseFloat(x) : parseInt(x);
		}
		valid(c) {
			return c === `-` || c === `.` && this.float || isNumber.test(c);
		}
		reset() {
			this.typed = ``;
			this.value = ``;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			let x = this.value;
			this.value = x !== `` ? x : this.initial;
			this.done = this.aborted = true;
			this.error = false;
			this.fire();
			this.render();
			this.out.write(`\n`);
			this.close();
		}
		async validate() {
			let valid = await this.validator(this.value);
			if (typeof valid === `string`) {
				this.errorMsg = valid;
				valid = false;
			}
			this.error = !valid;
		}
		async submit() {
			await this.validate();
			if (this.error) {
				this.color = `red`;
				this.fire();
				this.render();
				return;
			}
			let x = this.value;
			this.value = x !== `` ? x : this.initial;
			this.done = true;
			this.aborted = false;
			this.error = false;
			this.fire();
			this.render();
			this.out.write(`\n`);
			this.close();
		}
		up() {
			this.typed = ``;
			if (this.value === "") this.value = this.min - this.inc;
			if (this.value >= this.max) return this.bell();
			this.value += this.inc;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		down() {
			this.typed = ``;
			if (this.value === "") this.value = this.min + this.inc;
			if (this.value <= this.min) return this.bell();
			this.value -= this.inc;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		delete() {
			let val = this.value.toString();
			if (val.length === 0) return this.bell();
			this.value = this.parse(val = val.slice(0, -1)) || ``;
			if (this.value !== "" && this.value < this.min) this.value = this.min;
			this.color = `cyan`;
			this.fire();
			this.render();
		}
		next() {
			this.value = this.initial;
			this.fire();
			this.render();
		}
		_(c, key) {
			if (!this.valid(c)) return this.bell();
			const now = Date.now();
			if (now - this.lastHit > 1e3) this.typed = ``;
			this.typed += c;
			this.lastHit = now;
			this.color = `cyan`;
			if (c === `.`) return this.fire();
			this.value = Math.min(this.parse(this.typed), this.max);
			if (this.value > this.max) this.value = this.max;
			if (this.value < this.min) this.value = this.min;
			this.fire();
			this.render();
		}
		render() {
			if (this.closed) return;
			if (!this.firstRender) {
				if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
				this.out.write(clear(this.outputText, this.out.columns));
			}
			super.render();
			this.outputError = "";
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				!this.done || !this.done && !this.placeholder ? color[this.color]().underline(this.rendered) : this.rendered
			].join(` `);
			if (this.error) this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
			this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
		}
	};
	module.exports = NumberPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/multiselect.js
var require_multiselect = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var color = require_kleur();
	var { cursor } = require_src();
	var Prompt = require_prompt();
	var { clear, figures, style, wrap, entriesToDisplay } = require_util();
	/**
	* MultiselectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {String} [opts.warn] Hint shown for disabled choices
	* @param {Number} [opts.max] Max choices
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {Number} [opts.optionsPerPage=10] Max options to display at once
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var MultiselectPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.cursor = opts.cursor || 0;
			this.scrollIndex = opts.cursor || 0;
			this.hint = opts.hint || "";
			this.warn = opts.warn || "- This option is disabled -";
			this.minSelected = opts.min;
			this.showMinError = false;
			this.maxChoices = opts.max;
			this.instructions = opts.instructions;
			this.optionsPerPage = opts.optionsPerPage || 10;
			this.value = opts.choices.map((ch, idx) => {
				if (typeof ch === "string") ch = {
					title: ch,
					value: idx
				};
				return {
					title: ch && (ch.title || ch.value || ch),
					description: ch && ch.description,
					value: ch && (ch.value === void 0 ? idx : ch.value),
					selected: ch && ch.selected,
					disabled: ch && ch.disabled
				};
			});
			this.clear = clear("", this.out.columns);
			if (!opts.overrideRender) this.render();
		}
		reset() {
			this.value.map((v) => !v.selected);
			this.cursor = 0;
			this.fire();
			this.render();
		}
		selected() {
			return this.value.filter((v) => v.selected);
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			const selected = this.value.filter((e) => e.selected);
			if (this.minSelected && selected.length < this.minSelected) {
				this.showMinError = true;
				this.render();
			} else {
				this.done = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			}
		}
		first() {
			this.cursor = 0;
			this.render();
		}
		last() {
			this.cursor = this.value.length - 1;
			this.render();
		}
		next() {
			this.cursor = (this.cursor + 1) % this.value.length;
			this.render();
		}
		up() {
			if (this.cursor === 0) this.cursor = this.value.length - 1;
			else this.cursor--;
			this.render();
		}
		down() {
			if (this.cursor === this.value.length - 1) this.cursor = 0;
			else this.cursor++;
			this.render();
		}
		left() {
			this.value[this.cursor].selected = false;
			this.render();
		}
		right() {
			if (this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			this.value[this.cursor].selected = true;
			this.render();
		}
		handleSpaceToggle() {
			const v = this.value[this.cursor];
			if (v.selected) {
				v.selected = false;
				this.render();
			} else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			else {
				v.selected = true;
				this.render();
			}
		}
		toggleAll() {
			if (this.maxChoices !== void 0 || this.value[this.cursor].disabled) return this.bell();
			const newSelected = !this.value[this.cursor].selected;
			this.value.filter((v) => !v.disabled).forEach((v) => v.selected = newSelected);
			this.render();
		}
		_(c, key) {
			if (c === " ") this.handleSpaceToggle();
			else if (c === "a") this.toggleAll();
			else return this.bell();
		}
		renderInstructions() {
			if (this.instructions === void 0 || this.instructions) {
				if (typeof this.instructions === "string") return this.instructions;
				return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option\n    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection\n` + (this.maxChoices === void 0 ? `    a: Toggle all\n` : "") + `    enter/return: Complete answer`;
			}
			return "";
		}
		renderOption(cursor, v, i, arrowIndicator) {
			const prefix = (v.selected ? color.green(figures.radioOn) : figures.radioOff) + " " + arrowIndicator + " ";
			let title, desc;
			if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
			else {
				title = cursor === i ? color.cyan().underline(v.title) : v.title;
				if (cursor === i && v.description) {
					desc = ` - ${v.description}`;
					if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
						margin: prefix.length,
						width: this.out.columns
					});
				}
			}
			return prefix + title + color.gray(desc || "");
		}
		paginateOptions(options) {
			if (options.length === 0) return color.red("No matches for this query.");
			let { startIndex, endIndex } = entriesToDisplay(this.cursor, options.length, this.optionsPerPage);
			let prefix, styledOptions = [];
			for (let i = startIndex; i < endIndex; i++) {
				if (i === startIndex && startIndex > 0) prefix = figures.arrowUp;
				else if (i === endIndex - 1 && endIndex < options.length) prefix = figures.arrowDown;
				else prefix = " ";
				styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
			}
			return "\n" + styledOptions.join("\n");
		}
		renderOptions(options) {
			if (!this.done) return this.paginateOptions(options);
			return "";
		}
		renderDoneOrInstructions() {
			if (this.done) return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
			const output = [color.gray(this.hint), this.renderInstructions()];
			if (this.value[this.cursor].disabled) output.push(color.yellow(this.warn));
			return output.join(" ");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			super.render();
			let prompt = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.renderDoneOrInstructions()
			].join(" ");
			if (this.showMinError) {
				prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
				this.showMinError = false;
			}
			prompt += this.renderOptions(this.value);
			this.out.write(this.clear + prompt);
			this.clear = clear(prompt, this.out.columns);
		}
	};
	module.exports = MultiselectPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/autocomplete.js
var require_autocomplete = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var color = require_kleur();
	var Prompt = require_prompt();
	var { erase, cursor } = require_src();
	var { style, clear, figures, wrap, entriesToDisplay } = require_util();
	var getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);
	var getTitle = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);
	var getIndex = (arr, valOrTitle) => {
		const index = arr.findIndex((el) => el.value === valOrTitle || el.title === valOrTitle);
		return index > -1 ? index : void 0;
	};
	/**
	* TextPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of auto-complete choices objects
	* @param {Function} [opts.suggest] Filter function. Defaults to sort by title
	* @param {Number} [opts.limit=10] Max number of results to show
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {String} [opts.style='default'] Render style
	* @param {String} [opts.fallback] Fallback message - initial to default value
	* @param {String} [opts.initial] Index of the default value
	* @param {Boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.noMatches] The no matches found label
	*/
	var AutocompletePrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.suggest = opts.suggest;
			this.choices = opts.choices;
			this.initial = typeof opts.initial === "number" ? opts.initial : getIndex(opts.choices, opts.initial);
			this.select = this.initial || opts.cursor || 0;
			this.i18n = { noMatches: opts.noMatches || "no matches found" };
			this.fallback = opts.fallback || this.initial;
			this.clearFirst = opts.clearFirst || false;
			this.suggestions = [];
			this.input = "";
			this.limit = opts.limit || 10;
			this.cursor = 0;
			this.transform = style.render(opts.style);
			this.scale = this.transform.scale;
			this.render = this.render.bind(this);
			this.complete = this.complete.bind(this);
			this.clear = clear("", this.out.columns);
			this.complete(this.render);
			this.render();
		}
		set fallback(fb) {
			this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
		}
		get fallback() {
			let choice;
			if (typeof this._fb === "number") choice = this.choices[this._fb];
			else if (typeof this._fb === "string") choice = { title: this._fb };
			return choice || this._fb || { title: this.i18n.noMatches };
		}
		moveSelect(i) {
			this.select = i;
			if (this.suggestions.length > 0) this.value = getVal(this.suggestions, i);
			else this.value = this.fallback.value;
			this.fire();
		}
		async complete(cb) {
			const p = this.completing = this.suggest(this.input, this.choices);
			const suggestions = await p;
			if (this.completing !== p) return;
			this.suggestions = suggestions.map((s, i, arr) => ({
				title: getTitle(arr, i),
				value: getVal(arr, i),
				description: s.description
			}));
			this.completing = false;
			const l = Math.max(suggestions.length - 1, 0);
			this.moveSelect(Math.min(l, this.select));
			cb && cb();
		}
		reset() {
			this.input = "";
			this.complete(() => {
				this.moveSelect(this.initial !== void 0 ? this.initial : 0);
				this.render();
			});
			this.render();
		}
		exit() {
			if (this.clearFirst && this.input.length > 0) this.reset();
			else {
				this.done = this.exited = true;
				this.aborted = false;
				this.fire();
				this.render();
				this.out.write("\n");
				this.close();
			}
		}
		abort() {
			this.done = this.aborted = true;
			this.exited = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.done = true;
			this.aborted = this.exited = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		_(c, key) {
			let s1 = this.input.slice(0, this.cursor);
			this.input = `${s1}${c}${this.input.slice(this.cursor)}`;
			this.cursor = s1.length + 1;
			this.complete(this.render);
			this.render();
		}
		delete() {
			if (this.cursor === 0) return this.bell();
			this.input = `${this.input.slice(0, this.cursor - 1)}${this.input.slice(this.cursor)}`;
			this.complete(this.render);
			this.cursor = this.cursor - 1;
			this.render();
		}
		deleteForward() {
			if (this.cursor * this.scale >= this.rendered.length) return this.bell();
			this.input = `${this.input.slice(0, this.cursor)}${this.input.slice(this.cursor + 1)}`;
			this.complete(this.render);
			this.render();
		}
		first() {
			this.moveSelect(0);
			this.render();
		}
		last() {
			this.moveSelect(this.suggestions.length - 1);
			this.render();
		}
		up() {
			if (this.select === 0) this.moveSelect(this.suggestions.length - 1);
			else this.moveSelect(this.select - 1);
			this.render();
		}
		down() {
			if (this.select === this.suggestions.length - 1) this.moveSelect(0);
			else this.moveSelect(this.select + 1);
			this.render();
		}
		next() {
			if (this.select === this.suggestions.length - 1) this.moveSelect(0);
			else this.moveSelect(this.select + 1);
			this.render();
		}
		nextPage() {
			this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
			this.render();
		}
		prevPage() {
			this.moveSelect(Math.max(this.select - this.limit, 0));
			this.render();
		}
		left() {
			if (this.cursor <= 0) return this.bell();
			this.cursor = this.cursor - 1;
			this.render();
		}
		right() {
			if (this.cursor * this.scale >= this.rendered.length) return this.bell();
			this.cursor = this.cursor + 1;
			this.render();
		}
		renderOption(v, hovered, isStart, isEnd) {
			let desc;
			let prefix = isStart ? figures.arrowUp : isEnd ? figures.arrowDown : " ";
			let title = hovered ? color.cyan().underline(v.title) : v.title;
			prefix = (hovered ? color.cyan(figures.pointer) + " " : "  ") + prefix;
			if (v.description) {
				desc = ` - ${v.description}`;
				if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) desc = "\n" + wrap(v.description, {
					margin: 3,
					width: this.out.columns
				});
			}
			return prefix + " " + title + color.gray(desc || "");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			let { startIndex, endIndex } = entriesToDisplay(this.select, this.choices.length, this.limit);
			this.outputText = [
				style.symbol(this.done, this.aborted, this.exited),
				color.bold(this.msg),
				style.delimiter(this.completing),
				this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)
			].join(" ");
			if (!this.done) {
				const suggestions = this.suggestions.slice(startIndex, endIndex).map((item, i) => this.renderOption(item, this.select === i + startIndex, i === 0 && startIndex > 0, i + startIndex === endIndex - 1 && endIndex < this.choices.length)).join("\n");
				this.outputText += `\n` + (suggestions || color.gray(this.fallback.title));
			}
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = AutocompletePrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/autocompleteMultiselect.js
var require_autocompleteMultiselect = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var color = require_kleur();
	var { cursor } = require_src();
	var MultiselectPrompt = require_multiselect();
	var { clear, style, figures } = require_util();
	/**
	* MultiselectPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Array} opts.choices Array of choice objects
	* @param {String} [opts.hint] Hint to display
	* @param {String} [opts.warn] Hint shown for disabled choices
	* @param {Number} [opts.max] Max choices
	* @param {Number} [opts.cursor=0] Cursor start position
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	*/
	var AutocompleteMultiselectPrompt = class extends MultiselectPrompt {
		constructor(opts = {}) {
			opts.overrideRender = true;
			super(opts);
			this.inputValue = "";
			this.clear = clear("", this.out.columns);
			this.filteredOptions = this.value;
			this.render();
		}
		last() {
			this.cursor = this.filteredOptions.length - 1;
			this.render();
		}
		next() {
			this.cursor = (this.cursor + 1) % this.filteredOptions.length;
			this.render();
		}
		up() {
			if (this.cursor === 0) this.cursor = this.filteredOptions.length - 1;
			else this.cursor--;
			this.render();
		}
		down() {
			if (this.cursor === this.filteredOptions.length - 1) this.cursor = 0;
			else this.cursor++;
			this.render();
		}
		left() {
			this.filteredOptions[this.cursor].selected = false;
			this.render();
		}
		right() {
			if (this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			this.filteredOptions[this.cursor].selected = true;
			this.render();
		}
		delete() {
			if (this.inputValue.length) {
				this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
				this.updateFilteredOptions();
			}
		}
		updateFilteredOptions() {
			const currentHighlight = this.filteredOptions[this.cursor];
			this.filteredOptions = this.value.filter((v) => {
				if (this.inputValue) {
					if (typeof v.title === "string") {
						if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) return true;
					}
					if (typeof v.value === "string") {
						if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) return true;
					}
					return false;
				}
				return true;
			});
			const newHighlightIndex = this.filteredOptions.findIndex((v) => v === currentHighlight);
			this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
			this.render();
		}
		handleSpaceToggle() {
			const v = this.filteredOptions[this.cursor];
			if (v.selected) {
				v.selected = false;
				this.render();
			} else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) return this.bell();
			else {
				v.selected = true;
				this.render();
			}
		}
		handleInputChange(c) {
			this.inputValue = this.inputValue + c;
			this.updateFilteredOptions();
		}
		_(c, key) {
			if (c === " ") this.handleSpaceToggle();
			else this.handleInputChange(c);
		}
		renderInstructions() {
			if (this.instructions === void 0 || this.instructions) {
				if (typeof this.instructions === "string") return this.instructions;
				return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
			}
			return "";
		}
		renderCurrentInput() {
			return `
Filtered results for: ${this.inputValue ? this.inputValue : color.gray("Enter something to filter")}\n`;
		}
		renderOption(cursor, v, i) {
			let title;
			if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
			else title = cursor === i ? color.cyan().underline(v.title) : v.title;
			return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + "  " + title;
		}
		renderDoneOrInstructions() {
			if (this.done) return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
			const output = [
				color.gray(this.hint),
				this.renderInstructions(),
				this.renderCurrentInput()
			];
			if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) output.push(color.yellow(this.warn));
			return output.join(" ");
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			super.render();
			let prompt = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(false),
				this.renderDoneOrInstructions()
			].join(" ");
			if (this.showMinError) {
				prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
				this.showMinError = false;
			}
			prompt += this.renderOptions(this.filteredOptions);
			this.out.write(this.clear + prompt);
			this.clear = clear(prompt, this.out.columns);
		}
	};
	module.exports = AutocompleteMultiselectPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/confirm.js
var require_confirm = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var color = require_kleur();
	var Prompt = require_prompt();
	var { style, clear } = require_util();
	var { erase, cursor } = require_src();
	/**
	* ConfirmPrompt Base Element
	* @param {Object} opts Options
	* @param {String} opts.message Message
	* @param {Boolean} [opts.initial] Default value (true/false)
	* @param {Stream} [opts.stdin] The Readable stream to listen to
	* @param {Stream} [opts.stdout] The Writable stream to write readline data to
	* @param {String} [opts.yes] The "Yes" label
	* @param {String} [opts.yesOption] The "Yes" option when choosing between yes/no
	* @param {String} [opts.no] The "No" label
	* @param {String} [opts.noOption] The "No" option when choosing between yes/no
	*/
	var ConfirmPrompt = class extends Prompt {
		constructor(opts = {}) {
			super(opts);
			this.msg = opts.message;
			this.value = opts.initial;
			this.initialValue = !!opts.initial;
			this.yesMsg = opts.yes || "yes";
			this.yesOption = opts.yesOption || "(Y/n)";
			this.noMsg = opts.no || "no";
			this.noOption = opts.noOption || "(y/N)";
			this.render();
		}
		reset() {
			this.value = this.initialValue;
			this.fire();
			this.render();
		}
		exit() {
			this.abort();
		}
		abort() {
			this.done = this.aborted = true;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		submit() {
			this.value = this.value || false;
			this.done = true;
			this.aborted = false;
			this.fire();
			this.render();
			this.out.write("\n");
			this.close();
		}
		_(c, key) {
			if (c.toLowerCase() === "y") {
				this.value = true;
				return this.submit();
			}
			if (c.toLowerCase() === "n") {
				this.value = false;
				return this.submit();
			}
			return this.bell();
		}
		render() {
			if (this.closed) return;
			if (this.firstRender) this.out.write(cursor.hide);
			else this.out.write(clear(this.outputText, this.out.columns));
			super.render();
			this.outputText = [
				style.symbol(this.done, this.aborted),
				color.bold(this.msg),
				style.delimiter(this.done),
				this.done ? this.value ? this.yesMsg : this.noMsg : color.gray(this.initialValue ? this.yesOption : this.noOption)
			].join(" ");
			this.out.write(erase.line + cursor.to(0) + this.outputText);
		}
	};
	module.exports = ConfirmPrompt;
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/elements/index.js
var require_elements = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		TextPrompt: require_text(),
		SelectPrompt: require_select(),
		TogglePrompt: require_toggle(),
		DatePrompt: require_date(),
		NumberPrompt: require_number(),
		MultiselectPrompt: require_multiselect(),
		AutocompletePrompt: require_autocomplete(),
		AutocompleteMultiselectPrompt: require_autocompleteMultiselect(),
		ConfirmPrompt: require_confirm()
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/prompts.js
var require_prompts$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var $ = exports;
	var el = require_elements();
	var noop = (v) => v;
	function toPrompt(type, args, opts = {}) {
		return new Promise((res, rej) => {
			const p = new el[type](args);
			const onAbort = opts.onAbort || noop;
			const onSubmit = opts.onSubmit || noop;
			const onExit = opts.onExit || noop;
			p.on("state", args.onState || noop);
			p.on("submit", (x) => res(onSubmit(x)));
			p.on("exit", (x) => res(onExit(x)));
			p.on("abort", (x) => rej(onAbort(x)));
		});
	}
	/**
	* Text prompt
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.text = (args) => toPrompt("TextPrompt", args);
	/**
	* Password prompt with masked input
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.password = (args) => {
		args.style = "password";
		return $.text(args);
	};
	/**
	* Prompt where input is invisible, like sudo
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {function} [args.onState] On state change callback
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.invisible = (args) => {
		args.style = "invisible";
		return $.text(args);
	};
	/**
	* Number prompt
	* @param {string} args.message Prompt message to display
	* @param {number} args.initial Default number value
	* @param {function} [args.onState] On state change callback
	* @param {number} [args.max] Max value
	* @param {number} [args.min] Min value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.number = (args) => toPrompt("NumberPrompt", args);
	/**
	* Date prompt
	* @param {string} args.message Prompt message to display
	* @param {number} args.initial Default number value
	* @param {function} [args.onState] On state change callback
	* @param {number} [args.max] Max value
	* @param {number} [args.min] Min value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {Boolean} [opts.float=false] Parse input as floats
	* @param {Number} [opts.round=2] Round floats to x decimals
	* @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
	* @param {function} [args.validate] Function to validate user input
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.date = (args) => toPrompt("DatePrompt", args);
	/**
	* Classic yes/no prompt
	* @param {string} args.message Prompt message to display
	* @param {boolean} [args.initial=false] Default value
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.confirm = (args) => toPrompt("ConfirmPrompt", args);
	/**
	* List prompt, split intput string by `seperator`
	* @param {string} args.message Prompt message to display
	* @param {string} [args.initial] Default string value
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {string} [args.separator] String separator
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input, in form of an `Array`
	*/
	$.list = (args) => {
		const sep = args.separator || ",";
		return toPrompt("TextPrompt", args, { onSubmit: (str) => str.split(sep).map((s) => s.trim()) });
	};
	/**
	* Toggle/switch prompt
	* @param {string} args.message Prompt message to display
	* @param {boolean} [args.initial=false] Default value
	* @param {string} [args.active="on"] Text for `active` state
	* @param {string} [args.inactive="off"] Text for `inactive` state
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.toggle = (args) => toPrompt("TogglePrompt", args);
	/**
	* Interactive select prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of choices objects `[{ title, value }, ...]`
	* @param {number} [args.initial] Index of default value
	* @param {String} [args.hint] Hint to display
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.select = (args) => toPrompt("SelectPrompt", args);
	/**
	* Interactive multi-select / autocompleteMultiselect prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
	* @param {number} [args.max] Max select
	* @param {string} [args.hint] Hint to display user
	* @param {Number} [args.cursor=0] Cursor start position
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.multiselect = (args) => {
		args.choices = [].concat(args.choices || []);
		const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
		return toPrompt("MultiselectPrompt", args, {
			onAbort: toSelected,
			onSubmit: toSelected
		});
	};
	$.autocompleteMultiselect = (args) => {
		args.choices = [].concat(args.choices || []);
		const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
		return toPrompt("AutocompleteMultiselectPrompt", args, {
			onAbort: toSelected,
			onSubmit: toSelected
		});
	};
	var byTitle = (input, choices) => Promise.resolve(choices.filter((item) => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
	/**
	* Interactive auto-complete prompt
	* @param {string} args.message Prompt message to display
	* @param {Array} args.choices Array of auto-complete choices objects `[{ title, value }, ...]`
	* @param {Function} [args.suggest] Function to filter results based on user input. Defaults to sort by `title`
	* @param {number} [args.limit=10] Max number of results to show
	* @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
	* @param {String} [args.initial] Index of the default value
	* @param {boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
	* @param {String} [args.fallback] Fallback message - defaults to initial value
	* @param {function} [args.onState] On state change callback
	* @param {Stream} [args.stdin] The Readable stream to listen to
	* @param {Stream} [args.stdout] The Writable stream to write readline data to
	* @returns {Promise} Promise with user input
	*/
	$.autocomplete = (args) => {
		args.suggest = args.suggest || byTitle;
		args.choices = [].concat(args.choices || []);
		return toPrompt("AutocompletePrompt", args);
	};
}));
//#endregion
//#region node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/index.js
var require_lib = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var prompts = require_prompts$1();
	var passOn = [
		"suggest",
		"format",
		"onState",
		"validate",
		"onRender",
		"type"
	];
	var noop = () => {};
	/**
	* Prompt for a series of questions
	* @param {Array|Object} questions Single question object or Array of question objects
	* @param {Function} [onSubmit] Callback function called on prompt submit
	* @param {Function} [onCancel] Callback function called on cancel/abort
	* @returns {Object} Object with values from user input
	*/
	async function prompt(questions = [], { onSubmit = noop, onCancel = noop } = {}) {
		const answers = {};
		const override = prompt._override || {};
		questions = [].concat(questions);
		let answer, question, quit, name, type, lastPrompt;
		const getFormattedAnswer = async (question, answer, skipValidation = false) => {
			if (!skipValidation && question.validate && question.validate(answer) !== true) return;
			return question.format ? await question.format(answer, answers) : answer;
		};
		for (question of questions) {
			({name, type} = question);
			if (typeof type === "function") {
				type = await type(answer, { ...answers }, question);
				question["type"] = type;
			}
			if (!type) continue;
			for (let key in question) {
				if (passOn.includes(key)) continue;
				let value = question[key];
				question[key] = typeof value === "function" ? await value(answer, { ...answers }, lastPrompt) : value;
			}
			lastPrompt = question;
			if (typeof question.message !== "string") throw new Error("prompt message is required");
			({name, type} = question);
			if (prompts[type] === void 0) throw new Error(`prompt type (${type}) is not defined`);
			if (override[question.name] !== void 0) {
				answer = await getFormattedAnswer(question, override[question.name]);
				if (answer !== void 0) {
					answers[name] = answer;
					continue;
				}
			}
			try {
				answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : await prompts[type](question);
				answers[name] = answer = await getFormattedAnswer(question, answer, true);
				quit = await onSubmit(question, answer, answers);
			} catch (err) {
				quit = !await onCancel(question, answers);
			}
			if (quit) return answers;
		}
		return answers;
	}
	function getInjectedAnswer(injected, deafultValue) {
		const answer = injected.shift();
		if (answer instanceof Error) throw answer;
		return answer === void 0 ? deafultValue : answer;
	}
	function inject(answers) {
		prompt._injected = (prompt._injected || []).concat(answers);
	}
	function override(answers) {
		prompt._override = Object.assign({}, answers);
	}
	module.exports = Object.assign(prompt, {
		prompt,
		prompts,
		inject,
		override
	});
}));
//#endregion
//#region src/command/common/project-name.ts
var import_prompts = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	function isNodeLT(tar) {
		tar = (Array.isArray(tar) ? tar : tar.split(".")).map(Number);
		let i = 0, src = process.versions.node.split(".").map(Number);
		for (; i < tar.length; i++) {
			if (src[i] > tar[i]) return false;
			if (tar[i] > src[i]) return true;
		}
		return false;
	}
	module.exports = isNodeLT("8.6.0") ? require_dist() : require_lib();
})))(), 1);
async function nameCommand(optionName) {
	const { optionConversion } = optionUtility;
	const { onPromptState } = await commanderCore;
	const { createOk, checkPromiseReturn } = resultUtility;
	if (optionName.isSome && isString(optionName.value)) return createOk(optionName.value.trim());
	const response = await checkPromiseReturn({
		fn: async () => await (0, import_prompts.default)({
			onState: onPromptState,
			type: "text",
			name: "path",
			message: "What is your project named?",
			initial: "my-project",
			validate: (name) => {
				const validation = validateNpmName(name);
				if (validation.valid) return true;
				return `Invalid project name: ${validation.problems?.join(", ")}`;
			}
		}),
		err: (e) => {
			if (e instanceof Error) return /* @__PURE__ */ new Error(`Prompt failed: ${e.message}`);
			return /* @__PURE__ */ new Error("Prompt failed: Unknown error");
		}
	});
	if (response.isErr) return response;
	const name = optionConversion(response.value.path);
	if (name.isSome && isString(name.value)) return createOk(name.value.trim());
	return createOk("my-project");
}
//#endregion
//#region src/utils/error.ts
function cliErrorLog(err) {
	console.error((0, import_picocolors_browser.red)(err.message));
	console.error((0, import_picocolors_browser.red)(err.stack ?? ""));
}
//#endregion
//#region src/template/core/core-static.ts
var techStacks = ["react", "vue"];
var techStackSelectList = [{
	title: "React",
	value: "react"
}, {
	title: "Vue",
	value: "vue"
}];
//#endregion
//#region src/template/react/react-static.ts
/**
* Static definitions for template creation
*/
var frameworks = [
	"tanstack-router",
	"next/app",
	"next/pages"
];
/**
* CSS
*/
var reactCSSes = ["tailwind", "vanilla-extract"];
//#endregion
//#region src/command/react/react-is.ts
function isReactFramework(value) {
	if (typeof value !== "string") return false;
	return frameworks.includes(value);
}
function isTechStack(value) {
	if (typeof value !== "string") return false;
	return techStacks.includes(value);
}
function isReactCss(value) {
	return reactCSSes.includes(value);
}
//#endregion
//#region src/command/common/tech-stack.ts
async function techStackCommand(optionTech) {
	const { createOk, createNg, checkPromiseReturn } = resultUtility;
	const { onPromptState } = await commanderCore;
	if (optionTech.isSome && isTechStack(optionTech.value)) return createOk(optionTech.value);
	const response = await checkPromiseReturn({
		fn: async () => await (0, import_prompts.default)({
			onState: onPromptState,
			type: "select",
			name: "techStack",
			message: "Select a tech stack for your project:",
			choices: techStackSelectList,
			initial: 0
		}),
		err: (e) => {
			if (e instanceof Error) return /* @__PURE__ */ new Error(`Prompt failed: ${e.message}`);
			return /* @__PURE__ */ new Error("Prompt failed: Unknown error");
		}
	});
	if (response.isErr) return response;
	const techStack = response.value.techStack;
	if (isTechStack(techStack)) return createOk(techStack);
	return createNg(/* @__PURE__ */ new Error("Tech stack selection is invalid"));
}
//#endregion
//#region src/helper/is-folder-empty.ts
function isFolderEmpty(root, name) {
	const validFiles = [
		".DS_Store",
		".git",
		".gitattributes",
		".gitignore",
		".gitlab-ci.yml",
		".hg",
		".hgcheck",
		".hgignore",
		".idea",
		".npmignore",
		".travis.yml",
		"LICENSE",
		"Thumbs.db",
		"docs",
		"mkdocs.yml",
		"npm-debug.log",
		"yarn-debug.log",
		"yarn-error.log",
		"yarnrc.yml",
		".yarn"
	];
	const conflicts = readdirSync(root).filter((file) => {
		return !validFiles.includes(file) && !/\.iml&/.test(file);
	});
	if (conflicts.length > 0) {
		console.log(`The directory ${(0, import_picocolors_browser.green)(name)} contains files that could conflict:`);
		console.log();
		for (const file of conflicts) try {
			if (lstatSync(join(root, file)).isDirectory()) console.log((0, import_picocolors_browser.blue)(`  ${file}/`));
			else console.log(`  ${file}`);
		} catch {
			console.log(`  ${file}`);
		}
		console.log();
		console.log("Either try using a new directory name, or remove the files listed above.");
		console.log();
		return false;
	}
	return true;
}
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/utils/array.js
var require_array = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.splitWhen = exports.flatten = void 0;
	function flatten(items) {
		return items.reduce((collection, item) => [].concat(collection, item), []);
	}
	exports.flatten = flatten;
	function splitWhen(items, predicate) {
		const result = [[]];
		let groupIndex = 0;
		for (const item of items) if (predicate(item)) {
			groupIndex++;
			result[groupIndex] = [];
		} else result[groupIndex].push(item);
		return result;
	}
	exports.splitWhen = splitWhen;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/utils/errno.js
var require_errno = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isEnoentCodeError = void 0;
	function isEnoentCodeError(error) {
		return error.code === "ENOENT";
	}
	exports.isEnoentCodeError = isEnoentCodeError;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/utils/fs.js
var require_fs$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createDirentFromStats = void 0;
	var DirentFromStats = class {
		constructor(name, stats) {
			this.name = name;
			this.isBlockDevice = stats.isBlockDevice.bind(stats);
			this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
			this.isDirectory = stats.isDirectory.bind(stats);
			this.isFIFO = stats.isFIFO.bind(stats);
			this.isFile = stats.isFile.bind(stats);
			this.isSocket = stats.isSocket.bind(stats);
			this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
		}
	};
	function createDirentFromStats(name, stats) {
		return new DirentFromStats(name, stats);
	}
	exports.createDirentFromStats = createDirentFromStats;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/utils/path.js
var require_path = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.convertPosixPathToPattern = exports.convertWindowsPathToPattern = exports.convertPathToPattern = exports.escapePosixPath = exports.escapeWindowsPath = exports.escape = exports.removeLeadingDotSegment = exports.makeAbsolute = exports.unixify = void 0;
	var os$1 = __require("os");
	var path$10 = __require("path");
	var IS_WINDOWS_PLATFORM = os$1.platform() === "win32";
	var LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2;
	/**
	* All non-escaped special characters.
	* Posix: ()*?[]{|}, !+@ before (, ! at the beginning, \\ before non-special characters.
	* Windows: (){}[], !+@ before (, ! at the beginning.
	*/
	var POSIX_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\()|\\(?![!()*+?@[\]{|}]))/g;
	var WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()[\]{}]|^!|[!+@](?=\())/g;
	/**
	* The device path (\\.\ or \\?\).
	* https://learn.microsoft.com/en-us/dotnet/standard/io/file-path-formats#dos-device-paths
	*/
	var DOS_DEVICE_PATH_RE = /^\\\\([.?])/;
	/**
	* All backslashes except those escaping special characters.
	* Windows: !()+@{}
	* https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file#naming-conventions
	*/
	var WINDOWS_BACKSLASHES_RE = /\\(?![!()+@[\]{}])/g;
	/**
	* Designed to work only with simple paths: `dir\\file`.
	*/
	function unixify(filepath) {
		return filepath.replace(/\\/g, "/");
	}
	exports.unixify = unixify;
	function makeAbsolute(cwd, filepath) {
		return path$10.resolve(cwd, filepath);
	}
	exports.makeAbsolute = makeAbsolute;
	function removeLeadingDotSegment(entry) {
		if (entry.charAt(0) === ".") {
			const secondCharactery = entry.charAt(1);
			if (secondCharactery === "/" || secondCharactery === "\\") return entry.slice(LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
		}
		return entry;
	}
	exports.removeLeadingDotSegment = removeLeadingDotSegment;
	exports.escape = IS_WINDOWS_PLATFORM ? escapeWindowsPath : escapePosixPath;
	function escapeWindowsPath(pattern) {
		return pattern.replace(WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
	}
	exports.escapeWindowsPath = escapeWindowsPath;
	function escapePosixPath(pattern) {
		return pattern.replace(POSIX_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
	}
	exports.escapePosixPath = escapePosixPath;
	exports.convertPathToPattern = IS_WINDOWS_PLATFORM ? convertWindowsPathToPattern : convertPosixPathToPattern;
	function convertWindowsPathToPattern(filepath) {
		return escapeWindowsPath(filepath).replace(DOS_DEVICE_PATH_RE, "//$1").replace(WINDOWS_BACKSLASHES_RE, "/");
	}
	exports.convertWindowsPathToPattern = convertWindowsPathToPattern;
	function convertPosixPathToPattern(filepath) {
		return escapePosixPath(filepath);
	}
	exports.convertPosixPathToPattern = convertPosixPathToPattern;
}));
//#endregion
//#region node_modules/.pnpm/is-extglob@2.1.1/node_modules/is-extglob/index.js
var require_is_extglob = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* is-extglob <https://github.com/jonschlinkert/is-extglob>
	*
	* Copyright (c) 2014-2016, Jon Schlinkert.
	* Licensed under the MIT License.
	*/
	module.exports = function isExtglob(str) {
		if (typeof str !== "string" || str === "") return false;
		var match;
		while (match = /(\\).|([@?!+*]\(.*\))/g.exec(str)) {
			if (match[2]) return true;
			str = str.slice(match.index + match[0].length);
		}
		return false;
	};
}));
//#endregion
//#region node_modules/.pnpm/is-glob@4.0.3/node_modules/is-glob/index.js
var require_is_glob = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* is-glob <https://github.com/jonschlinkert/is-glob>
	*
	* Copyright (c) 2014-2017, Jon Schlinkert.
	* Released under the MIT License.
	*/
	var isExtglob = require_is_extglob();
	var chars = {
		"{": "}",
		"(": ")",
		"[": "]"
	};
	var strictCheck = function(str) {
		if (str[0] === "!") return true;
		var index = 0;
		var pipeIndex = -2;
		var closeSquareIndex = -2;
		var closeCurlyIndex = -2;
		var closeParenIndex = -2;
		var backSlashIndex = -2;
		while (index < str.length) {
			if (str[index] === "*") return true;
			if (str[index + 1] === "?" && /[\].+)]/.test(str[index])) return true;
			if (closeSquareIndex !== -1 && str[index] === "[" && str[index + 1] !== "]") {
				if (closeSquareIndex < index) closeSquareIndex = str.indexOf("]", index);
				if (closeSquareIndex > index) {
					if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) return true;
					backSlashIndex = str.indexOf("\\", index);
					if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) return true;
				}
			}
			if (closeCurlyIndex !== -1 && str[index] === "{" && str[index + 1] !== "}") {
				closeCurlyIndex = str.indexOf("}", index);
				if (closeCurlyIndex > index) {
					backSlashIndex = str.indexOf("\\", index);
					if (backSlashIndex === -1 || backSlashIndex > closeCurlyIndex) return true;
				}
			}
			if (closeParenIndex !== -1 && str[index] === "(" && str[index + 1] === "?" && /[:!=]/.test(str[index + 2]) && str[index + 3] !== ")") {
				closeParenIndex = str.indexOf(")", index);
				if (closeParenIndex > index) {
					backSlashIndex = str.indexOf("\\", index);
					if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) return true;
				}
			}
			if (pipeIndex !== -1 && str[index] === "(" && str[index + 1] !== "|") {
				if (pipeIndex < index) pipeIndex = str.indexOf("|", index);
				if (pipeIndex !== -1 && str[pipeIndex + 1] !== ")") {
					closeParenIndex = str.indexOf(")", pipeIndex);
					if (closeParenIndex > pipeIndex) {
						backSlashIndex = str.indexOf("\\", pipeIndex);
						if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) return true;
					}
				}
			}
			if (str[index] === "\\") {
				var open = str[index + 1];
				index += 2;
				var close = chars[open];
				if (close) {
					var n = str.indexOf(close, index);
					if (n !== -1) index = n + 1;
				}
				if (str[index] === "!") return true;
			} else index++;
		}
		return false;
	};
	var relaxedCheck = function(str) {
		if (str[0] === "!") return true;
		var index = 0;
		while (index < str.length) {
			if (/[*?{}()[\]]/.test(str[index])) return true;
			if (str[index] === "\\") {
				var open = str[index + 1];
				index += 2;
				var close = chars[open];
				if (close) {
					var n = str.indexOf(close, index);
					if (n !== -1) index = n + 1;
				}
				if (str[index] === "!") return true;
			} else index++;
		}
		return false;
	};
	module.exports = function isGlob(str, options) {
		if (typeof str !== "string" || str === "") return false;
		if (isExtglob(str)) return true;
		var check = strictCheck;
		if (options && options.strict === false) check = relaxedCheck;
		return check(str);
	};
}));
//#endregion
//#region node_modules/.pnpm/glob-parent@5.1.2/node_modules/glob-parent/index.js
var require_glob_parent = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isGlob = require_is_glob();
	var pathPosixDirname = __require("path").posix.dirname;
	var isWin32 = __require("os").platform() === "win32";
	var slash = "/";
	var backslash = /\\/g;
	var enclosure = /[\{\[].*[\}\]]$/;
	var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
	var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;
	/**
	* @param {string} str
	* @param {Object} opts
	* @param {boolean} [opts.flipBackslashes=true]
	* @returns {string}
	*/
	module.exports = function globParent(str, opts) {
		if (Object.assign({ flipBackslashes: true }, opts).flipBackslashes && isWin32 && str.indexOf(slash) < 0) str = str.replace(backslash, slash);
		if (enclosure.test(str)) str += slash;
		str += "a";
		do
			str = pathPosixDirname(str);
		while (isGlob(str) || globby.test(str));
		return str.replace(escaped, "$1");
	};
}));
//#endregion
//#region node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/utils.js
var require_utils$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.isInteger = (num) => {
		if (typeof num === "number") return Number.isInteger(num);
		if (typeof num === "string" && num.trim() !== "") return Number.isInteger(Number(num));
		return false;
	};
	/**
	* Find a node of the given type
	*/
	exports.find = (node, type) => node.nodes.find((node) => node.type === type);
	/**
	* Find a node of the given type
	*/
	exports.exceedsLimit = (min, max, step = 1, limit) => {
		if (limit === false) return false;
		if (!exports.isInteger(min) || !exports.isInteger(max)) return false;
		return (Number(max) - Number(min)) / Number(step) >= limit;
	};
	/**
	* Escape the given node with '\\' before node.value
	*/
	exports.escapeNode = (block, n = 0, type) => {
		const node = block.nodes[n];
		if (!node) return;
		if (type && node.type === type || node.type === "open" || node.type === "close") {
			if (node.escaped !== true) {
				node.value = "\\" + node.value;
				node.escaped = true;
			}
		}
	};
	/**
	* Returns true if the given brace node should be enclosed in literal braces
	*/
	exports.encloseBrace = (node) => {
		if (node.type !== "brace") return false;
		if (node.commas >> 0 + node.ranges >> 0 === 0) {
			node.invalid = true;
			return true;
		}
		return false;
	};
	/**
	* Returns true if a brace node is invalid.
	*/
	exports.isInvalidBrace = (block) => {
		if (block.type !== "brace") return false;
		if (block.invalid === true || block.dollar) return true;
		if (block.commas >> 0 + block.ranges >> 0 === 0) {
			block.invalid = true;
			return true;
		}
		if (block.open !== true || block.close !== true) {
			block.invalid = true;
			return true;
		}
		return false;
	};
	/**
	* Returns true if a node is an open or close node
	*/
	exports.isOpenOrClose = (node) => {
		if (node.type === "open" || node.type === "close") return true;
		return node.open === true || node.close === true;
	};
	/**
	* Reduce an array of text nodes.
	*/
	exports.reduce = (nodes) => nodes.reduce((acc, node) => {
		if (node.type === "text") acc.push(node.value);
		if (node.type === "range") node.type = "text";
		return acc;
	}, []);
	/**
	* Flatten an array
	*/
	exports.flatten = (...args) => {
		const result = [];
		const flat = (arr) => {
			for (let i = 0; i < arr.length; i++) {
				const ele = arr[i];
				if (Array.isArray(ele)) {
					flat(ele);
					continue;
				}
				if (ele !== void 0) result.push(ele);
			}
			return result;
		};
		flat(args);
		return result;
	};
}));
//#endregion
//#region node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/stringify.js
var require_stringify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var utils = require_utils$3();
	module.exports = (ast, options = {}) => {
		const stringify = (node, parent = {}) => {
			const invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
			const invalidNode = node.invalid === true && options.escapeInvalid === true;
			let output = "";
			if (node.value) {
				if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) return "\\" + node.value;
				return node.value;
			}
			if (node.value) return node.value;
			if (node.nodes) for (const child of node.nodes) output += stringify(child);
			return output;
		};
		return stringify(ast);
	};
}));
//#endregion
//#region node_modules/.pnpm/is-number@7.0.0/node_modules/is-number/index.js
/*!
* is-number <https://github.com/jonschlinkert/is-number>
*
* Copyright (c) 2014-present, Jon Schlinkert.
* Released under the MIT License.
*/
var require_is_number = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function(num) {
		if (typeof num === "number") return num - num === 0;
		if (typeof num === "string" && num.trim() !== "") return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
		return false;
	};
}));
//#endregion
//#region node_modules/.pnpm/to-regex-range@5.0.1/node_modules/to-regex-range/index.js
/*!
* to-regex-range <https://github.com/micromatch/to-regex-range>
*
* Copyright (c) 2015-present, Jon Schlinkert.
* Released under the MIT License.
*/
var require_to_regex_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isNumber = require_is_number();
	var toRegexRange = (min, max, options) => {
		if (isNumber(min) === false) throw new TypeError("toRegexRange: expected the first argument to be a number");
		if (max === void 0 || min === max) return String(min);
		if (isNumber(max) === false) throw new TypeError("toRegexRange: expected the second argument to be a number.");
		let opts = {
			relaxZeros: true,
			...options
		};
		if (typeof opts.strictZeros === "boolean") opts.relaxZeros = opts.strictZeros === false;
		let relax = String(opts.relaxZeros);
		let shorthand = String(opts.shorthand);
		let capture = String(opts.capture);
		let wrap = String(opts.wrap);
		let cacheKey = min + ":" + max + "=" + relax + shorthand + capture + wrap;
		if (toRegexRange.cache.hasOwnProperty(cacheKey)) return toRegexRange.cache[cacheKey].result;
		let a = Math.min(min, max);
		let b = Math.max(min, max);
		if (Math.abs(a - b) === 1) {
			let result = min + "|" + max;
			if (opts.capture) return `(${result})`;
			if (opts.wrap === false) return result;
			return `(?:${result})`;
		}
		let isPadded = hasPadding(min) || hasPadding(max);
		let state = {
			min,
			max,
			a,
			b
		};
		let positives = [];
		let negatives = [];
		if (isPadded) {
			state.isPadded = isPadded;
			state.maxLen = String(state.max).length;
		}
		if (a < 0) {
			negatives = splitToPatterns(b < 0 ? Math.abs(b) : 1, Math.abs(a), state, opts);
			a = state.a = 0;
		}
		if (b >= 0) positives = splitToPatterns(a, b, state, opts);
		state.negatives = negatives;
		state.positives = positives;
		state.result = collatePatterns(negatives, positives, opts);
		if (opts.capture === true) state.result = `(${state.result})`;
		else if (opts.wrap !== false && positives.length + negatives.length > 1) state.result = `(?:${state.result})`;
		toRegexRange.cache[cacheKey] = state;
		return state.result;
	};
	function collatePatterns(neg, pos, options) {
		let onlyNegative = filterPatterns(neg, pos, "-", false, options) || [];
		let onlyPositive = filterPatterns(pos, neg, "", false, options) || [];
		let intersected = filterPatterns(neg, pos, "-?", true, options) || [];
		return onlyNegative.concat(intersected).concat(onlyPositive).join("|");
	}
	function splitToRanges(min, max) {
		let nines = 1;
		let zeros = 1;
		let stop = countNines(min, nines);
		let stops = new Set([max]);
		while (min <= stop && stop <= max) {
			stops.add(stop);
			nines += 1;
			stop = countNines(min, nines);
		}
		stop = countZeros(max + 1, zeros) - 1;
		while (min < stop && stop <= max) {
			stops.add(stop);
			zeros += 1;
			stop = countZeros(max + 1, zeros) - 1;
		}
		stops = [...stops];
		stops.sort(compare);
		return stops;
	}
	/**
	* Convert a range to a regex pattern
	* @param {Number} `start`
	* @param {Number} `stop`
	* @return {String}
	*/
	function rangeToPattern(start, stop, options) {
		if (start === stop) return {
			pattern: start,
			count: [],
			digits: 0
		};
		let zipped = zip(start, stop);
		let digits = zipped.length;
		let pattern = "";
		let count = 0;
		for (let i = 0; i < digits; i++) {
			let [startDigit, stopDigit] = zipped[i];
			if (startDigit === stopDigit) pattern += startDigit;
			else if (startDigit !== "0" || stopDigit !== "9") pattern += toCharacterClass(startDigit, stopDigit, options);
			else count++;
		}
		if (count) pattern += options.shorthand === true ? "\\d" : "[0-9]";
		return {
			pattern,
			count: [count],
			digits
		};
	}
	function splitToPatterns(min, max, tok, options) {
		let ranges = splitToRanges(min, max);
		let tokens = [];
		let start = min;
		let prev;
		for (let i = 0; i < ranges.length; i++) {
			let max = ranges[i];
			let obj = rangeToPattern(String(start), String(max), options);
			let zeros = "";
			if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
				if (prev.count.length > 1) prev.count.pop();
				prev.count.push(obj.count[0]);
				prev.string = prev.pattern + toQuantifier(prev.count);
				start = max + 1;
				continue;
			}
			if (tok.isPadded) zeros = padZeros(max, tok, options);
			obj.string = zeros + obj.pattern + toQuantifier(obj.count);
			tokens.push(obj);
			start = max + 1;
			prev = obj;
		}
		return tokens;
	}
	function filterPatterns(arr, comparison, prefix, intersection, options) {
		let result = [];
		for (let ele of arr) {
			let { string } = ele;
			if (!intersection && !contains(comparison, "string", string)) result.push(prefix + string);
			if (intersection && contains(comparison, "string", string)) result.push(prefix + string);
		}
		return result;
	}
	/**
	* Zip strings
	*/
	function zip(a, b) {
		let arr = [];
		for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
		return arr;
	}
	function compare(a, b) {
		return a > b ? 1 : b > a ? -1 : 0;
	}
	function contains(arr, key, val) {
		return arr.some((ele) => ele[key] === val);
	}
	function countNines(min, len) {
		return Number(String(min).slice(0, -len) + "9".repeat(len));
	}
	function countZeros(integer, zeros) {
		return integer - integer % Math.pow(10, zeros);
	}
	function toQuantifier(digits) {
		let [start = 0, stop = ""] = digits;
		if (stop || start > 1) return `{${start + (stop ? "," + stop : "")}}`;
		return "";
	}
	function toCharacterClass(a, b, options) {
		return `[${a}${b - a === 1 ? "" : "-"}${b}]`;
	}
	function hasPadding(str) {
		return /^-?(0+)\d/.test(str);
	}
	function padZeros(value, tok, options) {
		if (!tok.isPadded) return value;
		let diff = Math.abs(tok.maxLen - String(value).length);
		let relax = options.relaxZeros !== false;
		switch (diff) {
			case 0: return "";
			case 1: return relax ? "0?" : "0";
			case 2: return relax ? "0{0,2}" : "00";
			default: return relax ? `0{0,${diff}}` : `0{${diff}}`;
		}
	}
	/**
	* Cache
	*/
	toRegexRange.cache = {};
	toRegexRange.clearCache = () => toRegexRange.cache = {};
	/**
	* Expose `toRegexRange`
	*/
	module.exports = toRegexRange;
}));
//#endregion
//#region node_modules/.pnpm/fill-range@7.1.1/node_modules/fill-range/index.js
/*!
* fill-range <https://github.com/jonschlinkert/fill-range>
*
* Copyright (c) 2014-present, Jon Schlinkert.
* Licensed under the MIT License.
*/
var require_fill_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var util$1 = __require("util");
	var toRegexRange = require_to_regex_range();
	var isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
	var transform = (toNumber) => {
		return (value) => toNumber === true ? Number(value) : String(value);
	};
	var isValidValue = (value) => {
		return typeof value === "number" || typeof value === "string" && value !== "";
	};
	var isNumber = (num) => Number.isInteger(+num);
	var zeros = (input) => {
		let value = `${input}`;
		let index = -1;
		if (value[0] === "-") value = value.slice(1);
		if (value === "0") return false;
		while (value[++index] === "0");
		return index > 0;
	};
	var stringify = (start, end, options) => {
		if (typeof start === "string" || typeof end === "string") return true;
		return options.stringify === true;
	};
	var pad = (input, maxLength, toNumber) => {
		if (maxLength > 0) {
			let dash = input[0] === "-" ? "-" : "";
			if (dash) input = input.slice(1);
			input = dash + input.padStart(dash ? maxLength - 1 : maxLength, "0");
		}
		if (toNumber === false) return String(input);
		return input;
	};
	var toMaxLen = (input, maxLength) => {
		let negative = input[0] === "-" ? "-" : "";
		if (negative) {
			input = input.slice(1);
			maxLength--;
		}
		while (input.length < maxLength) input = "0" + input;
		return negative ? "-" + input : input;
	};
	var toSequence = (parts, options, maxLen) => {
		parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
		parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
		let prefix = options.capture ? "" : "?:";
		let positives = "";
		let negatives = "";
		let result;
		if (parts.positives.length) positives = parts.positives.map((v) => toMaxLen(String(v), maxLen)).join("|");
		if (parts.negatives.length) negatives = `-(${prefix}${parts.negatives.map((v) => toMaxLen(String(v), maxLen)).join("|")})`;
		if (positives && negatives) result = `${positives}|${negatives}`;
		else result = positives || negatives;
		if (options.wrap) return `(${prefix}${result})`;
		return result;
	};
	var toRange = (a, b, isNumbers, options) => {
		if (isNumbers) return toRegexRange(a, b, {
			wrap: false,
			...options
		});
		let start = String.fromCharCode(a);
		if (a === b) return start;
		return `[${start}-${String.fromCharCode(b)}]`;
	};
	var toRegex = (start, end, options) => {
		if (Array.isArray(start)) {
			let wrap = options.wrap === true;
			let prefix = options.capture ? "" : "?:";
			return wrap ? `(${prefix}${start.join("|")})` : start.join("|");
		}
		return toRegexRange(start, end, options);
	};
	var rangeError = (...args) => {
		return /* @__PURE__ */ new RangeError("Invalid range arguments: " + util$1.inspect(...args));
	};
	var invalidRange = (start, end, options) => {
		if (options.strictRanges === true) throw rangeError([start, end]);
		return [];
	};
	var invalidStep = (step, options) => {
		if (options.strictRanges === true) throw new TypeError(`Expected step "${step}" to be a number`);
		return [];
	};
	var fillNumbers = (start, end, step = 1, options = {}) => {
		let a = Number(start);
		let b = Number(end);
		if (!Number.isInteger(a) || !Number.isInteger(b)) {
			if (options.strictRanges === true) throw rangeError([start, end]);
			return [];
		}
		if (a === 0) a = 0;
		if (b === 0) b = 0;
		let descending = a > b;
		let startString = String(start);
		let endString = String(end);
		let stepString = String(step);
		step = Math.max(Math.abs(step), 1);
		let padded = zeros(startString) || zeros(endString) || zeros(stepString);
		let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
		let toNumber = padded === false && stringify(start, end, options) === false;
		let format = options.transform || transform(toNumber);
		if (options.toRegex && step === 1) return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
		let parts = {
			negatives: [],
			positives: []
		};
		let push = (num) => parts[num < 0 ? "negatives" : "positives"].push(Math.abs(num));
		let range = [];
		let index = 0;
		while (descending ? a >= b : a <= b) {
			if (options.toRegex === true && step > 1) push(a);
			else range.push(pad(format(a, index), maxLen, toNumber));
			a = descending ? a - step : a + step;
			index++;
		}
		if (options.toRegex === true) return step > 1 ? toSequence(parts, options, maxLen) : toRegex(range, null, {
			wrap: false,
			...options
		});
		return range;
	};
	var fillLetters = (start, end, step = 1, options = {}) => {
		if (!isNumber(start) && start.length > 1 || !isNumber(end) && end.length > 1) return invalidRange(start, end, options);
		let format = options.transform || ((val) => String.fromCharCode(val));
		let a = `${start}`.charCodeAt(0);
		let b = `${end}`.charCodeAt(0);
		let descending = a > b;
		let min = Math.min(a, b);
		let max = Math.max(a, b);
		if (options.toRegex && step === 1) return toRange(min, max, false, options);
		let range = [];
		let index = 0;
		while (descending ? a >= b : a <= b) {
			range.push(format(a, index));
			a = descending ? a - step : a + step;
			index++;
		}
		if (options.toRegex === true) return toRegex(range, null, {
			wrap: false,
			options
		});
		return range;
	};
	var fill = (start, end, step, options = {}) => {
		if (end == null && isValidValue(start)) return [start];
		if (!isValidValue(start) || !isValidValue(end)) return invalidRange(start, end, options);
		if (typeof step === "function") return fill(start, end, 1, { transform: step });
		if (isObject(step)) return fill(start, end, 0, step);
		let opts = { ...options };
		if (opts.capture === true) opts.wrap = true;
		step = step || opts.step || 1;
		if (!isNumber(step)) {
			if (step != null && !isObject(step)) return invalidStep(step, opts);
			return fill(start, end, 1, step);
		}
		if (isNumber(start) && isNumber(end)) return fillNumbers(start, end, step, opts);
		return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
	};
	module.exports = fill;
}));
//#endregion
//#region node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/compile.js
var require_compile = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fill = require_fill_range();
	var utils = require_utils$3();
	var compile = (ast, options = {}) => {
		const walk = (node, parent = {}) => {
			const invalidBlock = utils.isInvalidBrace(parent);
			const invalidNode = node.invalid === true && options.escapeInvalid === true;
			const invalid = invalidBlock === true || invalidNode === true;
			const prefix = options.escapeInvalid === true ? "\\" : "";
			let output = "";
			if (node.isOpen === true) return prefix + node.value;
			if (node.isClose === true) {
				console.log("node.isClose", prefix, node.value);
				return prefix + node.value;
			}
			if (node.type === "open") return invalid ? prefix + node.value : "(";
			if (node.type === "close") return invalid ? prefix + node.value : ")";
			if (node.type === "comma") return node.prev.type === "comma" ? "" : invalid ? node.value : "|";
			if (node.value) return node.value;
			if (node.nodes && node.ranges > 0) {
				const args = utils.reduce(node.nodes);
				const range = fill(...args, {
					...options,
					wrap: false,
					toRegex: true,
					strictZeros: true
				});
				if (range.length !== 0) return args.length > 1 && range.length > 1 ? `(${range})` : range;
			}
			if (node.nodes) for (const child of node.nodes) output += walk(child, node);
			return output;
		};
		return walk(ast);
	};
	module.exports = compile;
}));
//#endregion
//#region node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/expand.js
var require_expand = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fill = require_fill_range();
	var stringify = require_stringify();
	var utils = require_utils$3();
	var append = (queue = "", stash = "", enclose = false) => {
		const result = [];
		queue = [].concat(queue);
		stash = [].concat(stash);
		if (!stash.length) return queue;
		if (!queue.length) return enclose ? utils.flatten(stash).map((ele) => `{${ele}}`) : stash;
		for (const item of queue) if (Array.isArray(item)) for (const value of item) result.push(append(value, stash, enclose));
		else for (let ele of stash) {
			if (enclose === true && typeof ele === "string") ele = `{${ele}}`;
			result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
		}
		return utils.flatten(result);
	};
	var expand = (ast, options = {}) => {
		const rangeLimit = options.rangeLimit === void 0 ? 1e3 : options.rangeLimit;
		const walk = (node, parent = {}) => {
			node.queue = [];
			let p = parent;
			let q = parent.queue;
			while (p.type !== "brace" && p.type !== "root" && p.parent) {
				p = p.parent;
				q = p.queue;
			}
			if (node.invalid || node.dollar) {
				q.push(append(q.pop(), stringify(node, options)));
				return;
			}
			if (node.type === "brace" && node.invalid !== true && node.nodes.length === 2) {
				q.push(append(q.pop(), ["{}"]));
				return;
			}
			if (node.nodes && node.ranges > 0) {
				const args = utils.reduce(node.nodes);
				if (utils.exceedsLimit(...args, options.step, rangeLimit)) throw new RangeError("expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.");
				let range = fill(...args, options);
				if (range.length === 0) range = stringify(node, options);
				q.push(append(q.pop(), range));
				node.nodes = [];
				return;
			}
			const enclose = utils.encloseBrace(node);
			let queue = node.queue;
			let block = node;
			while (block.type !== "brace" && block.type !== "root" && block.parent) {
				block = block.parent;
				queue = block.queue;
			}
			for (let i = 0; i < node.nodes.length; i++) {
				const child = node.nodes[i];
				if (child.type === "comma" && node.type === "brace") {
					if (i === 1) queue.push("");
					queue.push("");
					continue;
				}
				if (child.type === "close") {
					q.push(append(q.pop(), queue, enclose));
					continue;
				}
				if (child.value && child.type !== "open") {
					queue.push(append(queue.pop(), child.value));
					continue;
				}
				if (child.nodes) walk(child, node);
			}
			return queue;
		};
		return utils.flatten(walk(ast));
	};
	module.exports = expand;
}));
//#endregion
//#region node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/constants.js
var require_constants$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		MAX_LENGTH: 1e4,
		CHAR_0: "0",
		CHAR_9: "9",
		CHAR_UPPERCASE_A: "A",
		CHAR_LOWERCASE_A: "a",
		CHAR_UPPERCASE_Z: "Z",
		CHAR_LOWERCASE_Z: "z",
		CHAR_LEFT_PARENTHESES: "(",
		CHAR_RIGHT_PARENTHESES: ")",
		CHAR_ASTERISK: "*",
		CHAR_AMPERSAND: "&",
		CHAR_AT: "@",
		CHAR_BACKSLASH: "\\",
		CHAR_BACKTICK: "`",
		CHAR_CARRIAGE_RETURN: "\r",
		CHAR_CIRCUMFLEX_ACCENT: "^",
		CHAR_COLON: ":",
		CHAR_COMMA: ",",
		CHAR_DOLLAR: "$",
		CHAR_DOT: ".",
		CHAR_DOUBLE_QUOTE: "\"",
		CHAR_EQUAL: "=",
		CHAR_EXCLAMATION_MARK: "!",
		CHAR_FORM_FEED: "\f",
		CHAR_FORWARD_SLASH: "/",
		CHAR_HASH: "#",
		CHAR_HYPHEN_MINUS: "-",
		CHAR_LEFT_ANGLE_BRACKET: "<",
		CHAR_LEFT_CURLY_BRACE: "{",
		CHAR_LEFT_SQUARE_BRACKET: "[",
		CHAR_LINE_FEED: "\n",
		CHAR_NO_BREAK_SPACE: "\xA0",
		CHAR_PERCENT: "%",
		CHAR_PLUS: "+",
		CHAR_QUESTION_MARK: "?",
		CHAR_RIGHT_ANGLE_BRACKET: ">",
		CHAR_RIGHT_CURLY_BRACE: "}",
		CHAR_RIGHT_SQUARE_BRACKET: "]",
		CHAR_SEMICOLON: ";",
		CHAR_SINGLE_QUOTE: "'",
		CHAR_SPACE: " ",
		CHAR_TAB: "	",
		CHAR_UNDERSCORE: "_",
		CHAR_VERTICAL_LINE: "|",
		CHAR_ZERO_WIDTH_NOBREAK_SPACE: "﻿"
	};
}));
//#endregion
//#region node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/parse.js
var require_parse$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var stringify = require_stringify();
	/**
	* Constants
	*/
	var { MAX_LENGTH, CHAR_BACKSLASH, CHAR_BACKTICK, CHAR_COMMA, CHAR_DOT, CHAR_LEFT_PARENTHESES, CHAR_RIGHT_PARENTHESES, CHAR_LEFT_CURLY_BRACE, CHAR_RIGHT_CURLY_BRACE, CHAR_LEFT_SQUARE_BRACKET, CHAR_RIGHT_SQUARE_BRACKET, CHAR_DOUBLE_QUOTE, CHAR_SINGLE_QUOTE, CHAR_NO_BREAK_SPACE, CHAR_ZERO_WIDTH_NOBREAK_SPACE } = require_constants$2();
	/**
	* parse
	*/
	var parse = (input, options = {}) => {
		if (typeof input !== "string") throw new TypeError("Expected a string");
		const opts = options || {};
		const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
		if (input.length > max) throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
		const ast = {
			type: "root",
			input,
			nodes: []
		};
		const stack = [ast];
		let block = ast;
		let prev = ast;
		let brackets = 0;
		const length = input.length;
		let index = 0;
		let depth = 0;
		let value;
		/**
		* Helpers
		*/
		const advance = () => input[index++];
		const push = (node) => {
			if (node.type === "text" && prev.type === "dot") prev.type = "text";
			if (prev && prev.type === "text" && node.type === "text") {
				prev.value += node.value;
				return;
			}
			block.nodes.push(node);
			node.parent = block;
			node.prev = prev;
			prev = node;
			return node;
		};
		push({ type: "bos" });
		while (index < length) {
			block = stack[stack.length - 1];
			value = advance();
			/**
			* Invalid chars
			*/
			if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) continue;
			/**
			* Escaped chars
			*/
			if (value === CHAR_BACKSLASH) {
				push({
					type: "text",
					value: (options.keepEscaping ? value : "") + advance()
				});
				continue;
			}
			/**
			* Right square bracket (literal): ']'
			*/
			if (value === CHAR_RIGHT_SQUARE_BRACKET) {
				push({
					type: "text",
					value: "\\" + value
				});
				continue;
			}
			/**
			* Left square bracket: '['
			*/
			if (value === CHAR_LEFT_SQUARE_BRACKET) {
				brackets++;
				let next;
				while (index < length && (next = advance())) {
					value += next;
					if (next === CHAR_LEFT_SQUARE_BRACKET) {
						brackets++;
						continue;
					}
					if (next === CHAR_BACKSLASH) {
						value += advance();
						continue;
					}
					if (next === CHAR_RIGHT_SQUARE_BRACKET) {
						brackets--;
						if (brackets === 0) break;
					}
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Parentheses
			*/
			if (value === CHAR_LEFT_PARENTHESES) {
				block = push({
					type: "paren",
					nodes: []
				});
				stack.push(block);
				push({
					type: "text",
					value
				});
				continue;
			}
			if (value === CHAR_RIGHT_PARENTHESES) {
				if (block.type !== "paren") {
					push({
						type: "text",
						value
					});
					continue;
				}
				block = stack.pop();
				push({
					type: "text",
					value
				});
				block = stack[stack.length - 1];
				continue;
			}
			/**
			* Quotes: '|"|`
			*/
			if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
				const open = value;
				let next;
				if (options.keepQuotes !== true) value = "";
				while (index < length && (next = advance())) {
					if (next === CHAR_BACKSLASH) {
						value += next + advance();
						continue;
					}
					if (next === open) {
						if (options.keepQuotes === true) value += next;
						break;
					}
					value += next;
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Left curly brace: '{'
			*/
			if (value === CHAR_LEFT_CURLY_BRACE) {
				depth++;
				block = push({
					type: "brace",
					open: true,
					close: false,
					dollar: prev.value && prev.value.slice(-1) === "$" || block.dollar === true,
					depth,
					commas: 0,
					ranges: 0,
					nodes: []
				});
				stack.push(block);
				push({
					type: "open",
					value
				});
				continue;
			}
			/**
			* Right curly brace: '}'
			*/
			if (value === CHAR_RIGHT_CURLY_BRACE) {
				if (block.type !== "brace") {
					push({
						type: "text",
						value
					});
					continue;
				}
				const type = "close";
				block = stack.pop();
				block.close = true;
				push({
					type,
					value
				});
				depth--;
				block = stack[stack.length - 1];
				continue;
			}
			/**
			* Comma: ','
			*/
			if (value === CHAR_COMMA && depth > 0) {
				if (block.ranges > 0) {
					block.ranges = 0;
					const open = block.nodes.shift();
					block.nodes = [open, {
						type: "text",
						value: stringify(block)
					}];
				}
				push({
					type: "comma",
					value
				});
				block.commas++;
				continue;
			}
			/**
			* Dot: '.'
			*/
			if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
				const siblings = block.nodes;
				if (depth === 0 || siblings.length === 0) {
					push({
						type: "text",
						value
					});
					continue;
				}
				if (prev.type === "dot") {
					block.range = [];
					prev.value += value;
					prev.type = "range";
					if (block.nodes.length !== 3 && block.nodes.length !== 5) {
						block.invalid = true;
						block.ranges = 0;
						prev.type = "text";
						continue;
					}
					block.ranges++;
					block.args = [];
					continue;
				}
				if (prev.type === "range") {
					siblings.pop();
					const before = siblings[siblings.length - 1];
					before.value += prev.value + value;
					prev = before;
					block.ranges--;
					continue;
				}
				push({
					type: "dot",
					value
				});
				continue;
			}
			/**
			* Text
			*/
			push({
				type: "text",
				value
			});
		}
		do {
			block = stack.pop();
			if (block.type !== "root") {
				block.nodes.forEach((node) => {
					if (!node.nodes) {
						if (node.type === "open") node.isOpen = true;
						if (node.type === "close") node.isClose = true;
						if (!node.nodes) node.type = "text";
						node.invalid = true;
					}
				});
				const parent = stack[stack.length - 1];
				const index = parent.nodes.indexOf(block);
				parent.nodes.splice(index, 1, ...block.nodes);
			}
		} while (stack.length > 0);
		push({ type: "eos" });
		return ast;
	};
	module.exports = parse;
}));
//#endregion
//#region node_modules/.pnpm/braces@3.0.3/node_modules/braces/index.js
var require_braces = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var stringify = require_stringify();
	var compile = require_compile();
	var expand = require_expand();
	var parse = require_parse$1();
	/**
	* Expand the given pattern or create a regex-compatible string.
	*
	* ```js
	* const braces = require('braces');
	* console.log(braces('{a,b,c}', { compile: true })); //=> ['(a|b|c)']
	* console.log(braces('{a,b,c}')); //=> ['a', 'b', 'c']
	* ```
	* @param {String} `str`
	* @param {Object} `options`
	* @return {String}
	* @api public
	*/
	var braces = (input, options = {}) => {
		let output = [];
		if (Array.isArray(input)) for (const pattern of input) {
			const result = braces.create(pattern, options);
			if (Array.isArray(result)) output.push(...result);
			else output.push(result);
		}
		else output = [].concat(braces.create(input, options));
		if (options && options.expand === true && options.nodupes === true) output = [...new Set(output)];
		return output;
	};
	/**
	* Parse the given `str` with the given `options`.
	*
	* ```js
	* // braces.parse(pattern, [, options]);
	* const ast = braces.parse('a/{b,c}/d');
	* console.log(ast);
	* ```
	* @param {String} pattern Brace pattern to parse
	* @param {Object} options
	* @return {Object} Returns an AST
	* @api public
	*/
	braces.parse = (input, options = {}) => parse(input, options);
	/**
	* Creates a braces string from an AST, or an AST node.
	*
	* ```js
	* const braces = require('braces');
	* let ast = braces.parse('foo/{a,b}/bar');
	* console.log(stringify(ast.nodes[2])); //=> '{a,b}'
	* ```
	* @param {String} `input` Brace pattern or AST.
	* @param {Object} `options`
	* @return {Array} Returns an array of expanded values.
	* @api public
	*/
	braces.stringify = (input, options = {}) => {
		if (typeof input === "string") return stringify(braces.parse(input, options), options);
		return stringify(input, options);
	};
	/**
	* Compiles a brace pattern into a regex-compatible, optimized string.
	* This method is called by the main [braces](#braces) function by default.
	*
	* ```js
	* const braces = require('braces');
	* console.log(braces.compile('a/{b,c}/d'));
	* //=> ['a/(b|c)/d']
	* ```
	* @param {String} `input` Brace pattern or AST.
	* @param {Object} `options`
	* @return {Array} Returns an array of expanded values.
	* @api public
	*/
	braces.compile = (input, options = {}) => {
		if (typeof input === "string") input = braces.parse(input, options);
		return compile(input, options);
	};
	/**
	* Expands a brace pattern into an array. This method is called by the
	* main [braces](#braces) function when `options.expand` is true. Before
	* using this method it's recommended that you read the [performance notes](#performance))
	* and advantages of using [.compile](#compile) instead.
	*
	* ```js
	* const braces = require('braces');
	* console.log(braces.expand('a/{b,c}/d'));
	* //=> ['a/b/d', 'a/c/d'];
	* ```
	* @param {String} `pattern` Brace pattern
	* @param {Object} `options`
	* @return {Array} Returns an array of expanded values.
	* @api public
	*/
	braces.expand = (input, options = {}) => {
		if (typeof input === "string") input = braces.parse(input, options);
		let result = expand(input, options);
		if (options.noempty === true) result = result.filter(Boolean);
		if (options.nodupes === true) result = [...new Set(result)];
		return result;
	};
	/**
	* Processes a brace pattern and returns either an expanded array
	* (if `options.expand` is true), a highly optimized regex-compatible string.
	* This method is called by the main [braces](#braces) function.
	*
	* ```js
	* const braces = require('braces');
	* console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
	* //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
	* ```
	* @param {String} `pattern` Brace pattern
	* @param {Object} `options`
	* @return {Array} Returns an array of expanded values.
	* @api public
	*/
	braces.create = (input, options = {}) => {
		if (input === "" || input.length < 3) return [input];
		return options.expand !== true ? braces.compile(input, options) : braces.expand(input, options);
	};
	/**
	* Expose "braces"
	*/
	module.exports = braces;
}));
//#endregion
//#region node_modules/.pnpm/picomatch@2.3.2/node_modules/picomatch/lib/constants.js
var require_constants$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var path$9 = __require("path");
	var WIN_SLASH = "\\\\/";
	var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
	var DEFAULT_MAX_EXTGLOB_RECURSION = 0;
	/**
	* Posix glob regex
	*/
	var DOT_LITERAL = "\\.";
	var PLUS_LITERAL = "\\+";
	var QMARK_LITERAL = "\\?";
	var SLASH_LITERAL = "\\/";
	var ONE_CHAR = "(?=.)";
	var QMARK = "[^/]";
	var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
	var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
	var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
	var POSIX_CHARS = {
		DOT_LITERAL,
		PLUS_LITERAL,
		QMARK_LITERAL,
		SLASH_LITERAL,
		ONE_CHAR,
		QMARK,
		END_ANCHOR,
		DOTS_SLASH,
		NO_DOT: `(?!${DOT_LITERAL})`,
		NO_DOTS: `(?!${START_ANCHOR}${DOTS_SLASH})`,
		NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`,
		NO_DOTS_SLASH: `(?!${DOTS_SLASH})`,
		QMARK_NO_DOT: `[^.${SLASH_LITERAL}]`,
		STAR: `${QMARK}*?`,
		START_ANCHOR
	};
	/**
	* Windows glob regex
	*/
	var WINDOWS_CHARS = {
		...POSIX_CHARS,
		SLASH_LITERAL: `[${WIN_SLASH}]`,
		QMARK: WIN_NO_SLASH,
		STAR: `${WIN_NO_SLASH}*?`,
		DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
		NO_DOT: `(?!${DOT_LITERAL})`,
		NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
		NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
		NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
		QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
		START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
		END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
	};
	module.exports = {
		DEFAULT_MAX_EXTGLOB_RECURSION,
		MAX_LENGTH: 1024 * 64,
		POSIX_REGEX_SOURCE: {
			__proto__: null,
			alnum: "a-zA-Z0-9",
			alpha: "a-zA-Z",
			ascii: "\\x00-\\x7F",
			blank: " \\t",
			cntrl: "\\x00-\\x1F\\x7F",
			digit: "0-9",
			graph: "\\x21-\\x7E",
			lower: "a-z",
			print: "\\x20-\\x7E ",
			punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
			space: " \\t\\r\\n\\v\\f",
			upper: "A-Z",
			word: "A-Za-z0-9_",
			xdigit: "A-Fa-f0-9"
		},
		REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
		REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
		REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
		REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
		REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
		REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
		REPLACEMENTS: {
			__proto__: null,
			"***": "*",
			"**/**": "**",
			"**/**/**": "**"
		},
		CHAR_0: 48,
		CHAR_9: 57,
		CHAR_UPPERCASE_A: 65,
		CHAR_LOWERCASE_A: 97,
		CHAR_UPPERCASE_Z: 90,
		CHAR_LOWERCASE_Z: 122,
		CHAR_LEFT_PARENTHESES: 40,
		CHAR_RIGHT_PARENTHESES: 41,
		CHAR_ASTERISK: 42,
		CHAR_AMPERSAND: 38,
		CHAR_AT: 64,
		CHAR_BACKWARD_SLASH: 92,
		CHAR_CARRIAGE_RETURN: 13,
		CHAR_CIRCUMFLEX_ACCENT: 94,
		CHAR_COLON: 58,
		CHAR_COMMA: 44,
		CHAR_DOT: 46,
		CHAR_DOUBLE_QUOTE: 34,
		CHAR_EQUAL: 61,
		CHAR_EXCLAMATION_MARK: 33,
		CHAR_FORM_FEED: 12,
		CHAR_FORWARD_SLASH: 47,
		CHAR_GRAVE_ACCENT: 96,
		CHAR_HASH: 35,
		CHAR_HYPHEN_MINUS: 45,
		CHAR_LEFT_ANGLE_BRACKET: 60,
		CHAR_LEFT_CURLY_BRACE: 123,
		CHAR_LEFT_SQUARE_BRACKET: 91,
		CHAR_LINE_FEED: 10,
		CHAR_NO_BREAK_SPACE: 160,
		CHAR_PERCENT: 37,
		CHAR_PLUS: 43,
		CHAR_QUESTION_MARK: 63,
		CHAR_RIGHT_ANGLE_BRACKET: 62,
		CHAR_RIGHT_CURLY_BRACE: 125,
		CHAR_RIGHT_SQUARE_BRACKET: 93,
		CHAR_SEMICOLON: 59,
		CHAR_SINGLE_QUOTE: 39,
		CHAR_SPACE: 32,
		CHAR_TAB: 9,
		CHAR_UNDERSCORE: 95,
		CHAR_VERTICAL_LINE: 124,
		CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
		SEP: path$9.sep,
		extglobChars(chars) {
			return {
				"!": {
					type: "negate",
					open: "(?:(?!(?:",
					close: `))${chars.STAR})`
				},
				"?": {
					type: "qmark",
					open: "(?:",
					close: ")?"
				},
				"+": {
					type: "plus",
					open: "(?:",
					close: ")+"
				},
				"*": {
					type: "star",
					open: "(?:",
					close: ")*"
				},
				"@": {
					type: "at",
					open: "(?:",
					close: ")"
				}
			};
		},
		globChars(win32) {
			return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/picomatch@2.3.2/node_modules/picomatch/lib/utils.js
var require_utils$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var path$8 = __require("path");
	var win32 = process.platform === "win32";
	var { REGEX_BACKSLASH, REGEX_REMOVE_BACKSLASH, REGEX_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_GLOBAL } = require_constants$1();
	exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
	exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
	exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
	exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
	exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
	exports.removeBackslashes = (str) => {
		return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
			return match === "\\" ? "" : match;
		});
	};
	exports.supportsLookbehinds = () => {
		const segs = process.version.slice(1).split(".").map(Number);
		if (segs.length === 3 && segs[0] >= 9 || segs[0] === 8 && segs[1] >= 10) return true;
		return false;
	};
	exports.isWindows = (options) => {
		if (options && typeof options.windows === "boolean") return options.windows;
		return win32 === true || path$8.sep === "\\";
	};
	exports.escapeLast = (input, char, lastIdx) => {
		const idx = input.lastIndexOf(char, lastIdx);
		if (idx === -1) return input;
		if (input[idx - 1] === "\\") return exports.escapeLast(input, char, idx - 1);
		return `${input.slice(0, idx)}\\${input.slice(idx)}`;
	};
	exports.removePrefix = (input, state = {}) => {
		let output = input;
		if (output.startsWith("./")) {
			output = output.slice(2);
			state.prefix = "./";
		}
		return output;
	};
	exports.wrapOutput = (input, state = {}, options = {}) => {
		let output = `${options.contains ? "" : "^"}(?:${input})${options.contains ? "" : "$"}`;
		if (state.negated === true) output = `(?:^(?!${output}).*$)`;
		return output;
	};
}));
//#endregion
//#region node_modules/.pnpm/picomatch@2.3.2/node_modules/picomatch/lib/scan.js
var require_scan = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var utils = require_utils$2();
	var { CHAR_ASTERISK, CHAR_AT, CHAR_BACKWARD_SLASH, CHAR_COMMA, CHAR_DOT, CHAR_EXCLAMATION_MARK, CHAR_FORWARD_SLASH, CHAR_LEFT_CURLY_BRACE, CHAR_LEFT_PARENTHESES, CHAR_LEFT_SQUARE_BRACKET, CHAR_PLUS, CHAR_QUESTION_MARK, CHAR_RIGHT_CURLY_BRACE, CHAR_RIGHT_PARENTHESES, CHAR_RIGHT_SQUARE_BRACKET } = require_constants$1();
	var isPathSeparator = (code) => {
		return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
	};
	var depth = (token) => {
		if (token.isPrefix !== true) token.depth = token.isGlobstar ? Infinity : 1;
	};
	/**
	* Quickly scans a glob pattern and returns an object with a handful of
	* useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
	* `glob` (the actual pattern), `negated` (true if the path starts with `!` but not
	* with `!(`) and `negatedExtglob` (true if the path starts with `!(`).
	*
	* ```js
	* const pm = require('picomatch');
	* console.log(pm.scan('foo/bar/*.js'));
	* { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
	* ```
	* @param {String} `str`
	* @param {Object} `options`
	* @return {Object} Returns an object with tokens and regex source string.
	* @api public
	*/
	var scan = (input, options) => {
		const opts = options || {};
		const length = input.length - 1;
		const scanToEnd = opts.parts === true || opts.scanToEnd === true;
		const slashes = [];
		const tokens = [];
		const parts = [];
		let str = input;
		let index = -1;
		let start = 0;
		let lastIndex = 0;
		let isBrace = false;
		let isBracket = false;
		let isGlob = false;
		let isExtglob = false;
		let isGlobstar = false;
		let braceEscaped = false;
		let backslashes = false;
		let negated = false;
		let negatedExtglob = false;
		let finished = false;
		let braces = 0;
		let prev;
		let code;
		let token = {
			value: "",
			depth: 0,
			isGlob: false
		};
		const eos = () => index >= length;
		const peek = () => str.charCodeAt(index + 1);
		const advance = () => {
			prev = code;
			return str.charCodeAt(++index);
		};
		while (index < length) {
			code = advance();
			let next;
			if (code === CHAR_BACKWARD_SLASH) {
				backslashes = token.backslashes = true;
				code = advance();
				if (code === CHAR_LEFT_CURLY_BRACE) braceEscaped = true;
				continue;
			}
			if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
				braces++;
				while (eos() !== true && (code = advance())) {
					if (code === CHAR_BACKWARD_SLASH) {
						backslashes = token.backslashes = true;
						advance();
						continue;
					}
					if (code === CHAR_LEFT_CURLY_BRACE) {
						braces++;
						continue;
					}
					if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
						isBrace = token.isBrace = true;
						isGlob = token.isGlob = true;
						finished = true;
						if (scanToEnd === true) continue;
						break;
					}
					if (braceEscaped !== true && code === CHAR_COMMA) {
						isBrace = token.isBrace = true;
						isGlob = token.isGlob = true;
						finished = true;
						if (scanToEnd === true) continue;
						break;
					}
					if (code === CHAR_RIGHT_CURLY_BRACE) {
						braces--;
						if (braces === 0) {
							braceEscaped = false;
							isBrace = token.isBrace = true;
							finished = true;
							break;
						}
					}
				}
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_FORWARD_SLASH) {
				slashes.push(index);
				tokens.push(token);
				token = {
					value: "",
					depth: 0,
					isGlob: false
				};
				if (finished === true) continue;
				if (prev === CHAR_DOT && index === start + 1) {
					start += 2;
					continue;
				}
				lastIndex = index + 1;
				continue;
			}
			if (opts.noext !== true) {
				if ((code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK) === true && peek() === CHAR_LEFT_PARENTHESES) {
					isGlob = token.isGlob = true;
					isExtglob = token.isExtglob = true;
					finished = true;
					if (code === CHAR_EXCLAMATION_MARK && index === start) negatedExtglob = true;
					if (scanToEnd === true) {
						while (eos() !== true && (code = advance())) {
							if (code === CHAR_BACKWARD_SLASH) {
								backslashes = token.backslashes = true;
								code = advance();
								continue;
							}
							if (code === CHAR_RIGHT_PARENTHESES) {
								isGlob = token.isGlob = true;
								finished = true;
								break;
							}
						}
						continue;
					}
					break;
				}
			}
			if (code === CHAR_ASTERISK) {
				if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
				isGlob = token.isGlob = true;
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_QUESTION_MARK) {
				isGlob = token.isGlob = true;
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_LEFT_SQUARE_BRACKET) {
				while (eos() !== true && (next = advance())) {
					if (next === CHAR_BACKWARD_SLASH) {
						backslashes = token.backslashes = true;
						advance();
						continue;
					}
					if (next === CHAR_RIGHT_SQUARE_BRACKET) {
						isBracket = token.isBracket = true;
						isGlob = token.isGlob = true;
						finished = true;
						break;
					}
				}
				if (scanToEnd === true) continue;
				break;
			}
			if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
				negated = token.negated = true;
				start++;
				continue;
			}
			if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
				isGlob = token.isGlob = true;
				if (scanToEnd === true) {
					while (eos() !== true && (code = advance())) {
						if (code === CHAR_LEFT_PARENTHESES) {
							backslashes = token.backslashes = true;
							code = advance();
							continue;
						}
						if (code === CHAR_RIGHT_PARENTHESES) {
							finished = true;
							break;
						}
					}
					continue;
				}
				break;
			}
			if (isGlob === true) {
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
		}
		if (opts.noext === true) {
			isExtglob = false;
			isGlob = false;
		}
		let base = str;
		let prefix = "";
		let glob = "";
		if (start > 0) {
			prefix = str.slice(0, start);
			str = str.slice(start);
			lastIndex -= start;
		}
		if (base && isGlob === true && lastIndex > 0) {
			base = str.slice(0, lastIndex);
			glob = str.slice(lastIndex);
		} else if (isGlob === true) {
			base = "";
			glob = str;
		} else base = str;
		if (base && base !== "" && base !== "/" && base !== str) {
			if (isPathSeparator(base.charCodeAt(base.length - 1))) base = base.slice(0, -1);
		}
		if (opts.unescape === true) {
			if (glob) glob = utils.removeBackslashes(glob);
			if (base && backslashes === true) base = utils.removeBackslashes(base);
		}
		const state = {
			prefix,
			input,
			start,
			base,
			glob,
			isBrace,
			isBracket,
			isGlob,
			isExtglob,
			isGlobstar,
			negated,
			negatedExtglob
		};
		if (opts.tokens === true) {
			state.maxDepth = 0;
			if (!isPathSeparator(code)) tokens.push(token);
			state.tokens = tokens;
		}
		if (opts.parts === true || opts.tokens === true) {
			let prevIndex;
			for (let idx = 0; idx < slashes.length; idx++) {
				const n = prevIndex ? prevIndex + 1 : start;
				const i = slashes[idx];
				const value = input.slice(n, i);
				if (opts.tokens) {
					if (idx === 0 && start !== 0) {
						tokens[idx].isPrefix = true;
						tokens[idx].value = prefix;
					} else tokens[idx].value = value;
					depth(tokens[idx]);
					state.maxDepth += tokens[idx].depth;
				}
				if (idx !== 0 || value !== "") parts.push(value);
				prevIndex = i;
			}
			if (prevIndex && prevIndex + 1 < input.length) {
				const value = input.slice(prevIndex + 1);
				parts.push(value);
				if (opts.tokens) {
					tokens[tokens.length - 1].value = value;
					depth(tokens[tokens.length - 1]);
					state.maxDepth += tokens[tokens.length - 1].depth;
				}
			}
			state.slashes = slashes;
			state.parts = parts;
		}
		return state;
	};
	module.exports = scan;
}));
//#endregion
//#region node_modules/.pnpm/picomatch@2.3.2/node_modules/picomatch/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var constants = require_constants$1();
	var utils = require_utils$2();
	/**
	* Constants
	*/
	var { MAX_LENGTH, POSIX_REGEX_SOURCE, REGEX_NON_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_BACKREF, REPLACEMENTS } = constants;
	/**
	* Helpers
	*/
	var expandRange = (args, options) => {
		if (typeof options.expandRange === "function") return options.expandRange(...args, options);
		args.sort();
		const value = `[${args.join("-")}]`;
		try {
			new RegExp(value);
		} catch (ex) {
			return args.map((v) => utils.escapeRegex(v)).join("..");
		}
		return value;
	};
	/**
	* Create the message for a syntax error
	*/
	var syntaxError = (type, char) => {
		return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
	};
	var splitTopLevel = (input) => {
		const parts = [];
		let bracket = 0;
		let paren = 0;
		let quote = 0;
		let value = "";
		let escaped = false;
		for (const ch of input) {
			if (escaped === true) {
				value += ch;
				escaped = false;
				continue;
			}
			if (ch === "\\") {
				value += ch;
				escaped = true;
				continue;
			}
			if (ch === "\"") {
				quote = quote === 1 ? 0 : 1;
				value += ch;
				continue;
			}
			if (quote === 0) {
				if (ch === "[") bracket++;
				else if (ch === "]" && bracket > 0) bracket--;
				else if (bracket === 0) {
					if (ch === "(") paren++;
					else if (ch === ")" && paren > 0) paren--;
					else if (ch === "|" && paren === 0) {
						parts.push(value);
						value = "";
						continue;
					}
				}
			}
			value += ch;
		}
		parts.push(value);
		return parts;
	};
	var isPlainBranch = (branch) => {
		let escaped = false;
		for (const ch of branch) {
			if (escaped === true) {
				escaped = false;
				continue;
			}
			if (ch === "\\") {
				escaped = true;
				continue;
			}
			if (/[?*+@!()[\]{}]/.test(ch)) return false;
		}
		return true;
	};
	var normalizeSimpleBranch = (branch) => {
		let value = branch.trim();
		let changed = true;
		while (changed === true) {
			changed = false;
			if (/^@\([^\\()[\]{}|]+\)$/.test(value)) {
				value = value.slice(2, -1);
				changed = true;
			}
		}
		if (!isPlainBranch(value)) return;
		return value.replace(/\\(.)/g, "$1");
	};
	var hasRepeatedCharPrefixOverlap = (branches) => {
		const values = branches.map(normalizeSimpleBranch).filter(Boolean);
		for (let i = 0; i < values.length; i++) for (let j = i + 1; j < values.length; j++) {
			const a = values[i];
			const b = values[j];
			const char = a[0];
			if (!char || a !== char.repeat(a.length) || b !== char.repeat(b.length)) continue;
			if (a === b || a.startsWith(b) || b.startsWith(a)) return true;
		}
		return false;
	};
	var parseRepeatedExtglob = (pattern, requireEnd = true) => {
		if (pattern[0] !== "+" && pattern[0] !== "*" || pattern[1] !== "(") return;
		let bracket = 0;
		let paren = 0;
		let quote = 0;
		let escaped = false;
		for (let i = 1; i < pattern.length; i++) {
			const ch = pattern[i];
			if (escaped === true) {
				escaped = false;
				continue;
			}
			if (ch === "\\") {
				escaped = true;
				continue;
			}
			if (ch === "\"") {
				quote = quote === 1 ? 0 : 1;
				continue;
			}
			if (quote === 1) continue;
			if (ch === "[") {
				bracket++;
				continue;
			}
			if (ch === "]" && bracket > 0) {
				bracket--;
				continue;
			}
			if (bracket > 0) continue;
			if (ch === "(") {
				paren++;
				continue;
			}
			if (ch === ")") {
				paren--;
				if (paren === 0) {
					if (requireEnd === true && i !== pattern.length - 1) return;
					return {
						type: pattern[0],
						body: pattern.slice(2, i),
						end: i
					};
				}
			}
		}
	};
	var getStarExtglobSequenceOutput = (pattern) => {
		let index = 0;
		const chars = [];
		while (index < pattern.length) {
			const match = parseRepeatedExtglob(pattern.slice(index), false);
			if (!match || match.type !== "*") return;
			const branches = splitTopLevel(match.body).map((branch) => branch.trim());
			if (branches.length !== 1) return;
			const branch = normalizeSimpleBranch(branches[0]);
			if (!branch || branch.length !== 1) return;
			chars.push(branch);
			index += match.end + 1;
		}
		if (chars.length < 1) return;
		return `${chars.length === 1 ? utils.escapeRegex(chars[0]) : `[${chars.map((ch) => utils.escapeRegex(ch)).join("")}]`}*`;
	};
	var repeatedExtglobRecursion = (pattern) => {
		let depth = 0;
		let value = pattern.trim();
		let match = parseRepeatedExtglob(value);
		while (match) {
			depth++;
			value = match.body.trim();
			match = parseRepeatedExtglob(value);
		}
		return depth;
	};
	var analyzeRepeatedExtglob = (body, options) => {
		if (options.maxExtglobRecursion === false) return { risky: false };
		const max = typeof options.maxExtglobRecursion === "number" ? options.maxExtglobRecursion : constants.DEFAULT_MAX_EXTGLOB_RECURSION;
		const branches = splitTopLevel(body).map((branch) => branch.trim());
		if (branches.length > 1) {
			if (branches.some((branch) => branch === "") || branches.some((branch) => /^[*?]+$/.test(branch)) || hasRepeatedCharPrefixOverlap(branches)) return { risky: true };
		}
		for (const branch of branches) {
			const safeOutput = getStarExtglobSequenceOutput(branch);
			if (safeOutput) return {
				risky: true,
				safeOutput
			};
			if (repeatedExtglobRecursion(branch) > max) return { risky: true };
		}
		return { risky: false };
	};
	/**
	* Parse the given input string.
	* @param {String} input
	* @param {Object} options
	* @return {Object}
	*/
	var parse = (input, options) => {
		if (typeof input !== "string") throw new TypeError("Expected a string");
		input = REPLACEMENTS[input] || input;
		const opts = { ...options };
		const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
		let len = input.length;
		if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
		const bos = {
			type: "bos",
			value: "",
			output: opts.prepend || ""
		};
		const tokens = [bos];
		const capture = opts.capture ? "" : "?:";
		const win32 = utils.isWindows(options);
		const PLATFORM_CHARS = constants.globChars(win32);
		const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
		const { DOT_LITERAL, PLUS_LITERAL, SLASH_LITERAL, ONE_CHAR, DOTS_SLASH, NO_DOT, NO_DOT_SLASH, NO_DOTS_SLASH, QMARK, QMARK_NO_DOT, STAR, START_ANCHOR } = PLATFORM_CHARS;
		const globstar = (opts) => {
			return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
		};
		const nodot = opts.dot ? "" : NO_DOT;
		const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
		let star = opts.bash === true ? globstar(opts) : STAR;
		if (opts.capture) star = `(${star})`;
		if (typeof opts.noext === "boolean") opts.noextglob = opts.noext;
		const state = {
			input,
			index: -1,
			start: 0,
			dot: opts.dot === true,
			consumed: "",
			output: "",
			prefix: "",
			backtrack: false,
			negated: false,
			brackets: 0,
			braces: 0,
			parens: 0,
			quotes: 0,
			globstar: false,
			tokens
		};
		input = utils.removePrefix(input, state);
		len = input.length;
		const extglobs = [];
		const braces = [];
		const stack = [];
		let prev = bos;
		let value;
		/**
		* Tokenizing helpers
		*/
		const eos = () => state.index === len - 1;
		const peek = state.peek = (n = 1) => input[state.index + n];
		const advance = state.advance = () => input[++state.index] || "";
		const remaining = () => input.slice(state.index + 1);
		const consume = (value = "", num = 0) => {
			state.consumed += value;
			state.index += num;
		};
		const append = (token) => {
			state.output += token.output != null ? token.output : token.value;
			consume(token.value);
		};
		const negate = () => {
			let count = 1;
			while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
				advance();
				state.start++;
				count++;
			}
			if (count % 2 === 0) return false;
			state.negated = true;
			state.start++;
			return true;
		};
		const increment = (type) => {
			state[type]++;
			stack.push(type);
		};
		const decrement = (type) => {
			state[type]--;
			stack.pop();
		};
		/**
		* Push tokens onto the tokens array. This helper speeds up
		* tokenizing by 1) helping us avoid backtracking as much as possible,
		* and 2) helping us avoid creating extra tokens when consecutive
		* characters are plain text. This improves performance and simplifies
		* lookbehinds.
		*/
		const push = (tok) => {
			if (prev.type === "globstar") {
				const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
				const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
				if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
					state.output = state.output.slice(0, -prev.output.length);
					prev.type = "star";
					prev.value = "*";
					prev.output = star;
					state.output += prev.output;
				}
			}
			if (extglobs.length && tok.type !== "paren") extglobs[extglobs.length - 1].inner += tok.value;
			if (tok.value || tok.output) append(tok);
			if (prev && prev.type === "text" && tok.type === "text") {
				prev.value += tok.value;
				prev.output = (prev.output || "") + tok.value;
				return;
			}
			tok.prev = prev;
			tokens.push(tok);
			prev = tok;
		};
		const extglobOpen = (type, value) => {
			const token = {
				...EXTGLOB_CHARS[value],
				conditions: 1,
				inner: ""
			};
			token.prev = prev;
			token.parens = state.parens;
			token.output = state.output;
			token.startIndex = state.index;
			token.tokensIndex = tokens.length;
			const output = (opts.capture ? "(" : "") + token.open;
			increment("parens");
			push({
				type,
				value,
				output: state.output ? "" : ONE_CHAR
			});
			push({
				type: "paren",
				extglob: true,
				value: advance(),
				output
			});
			extglobs.push(token);
		};
		const extglobClose = (token) => {
			const literal = input.slice(token.startIndex, state.index + 1);
			const analysis = analyzeRepeatedExtglob(input.slice(token.startIndex + 2, state.index), opts);
			if ((token.type === "plus" || token.type === "star") && analysis.risky) {
				const safeOutput = analysis.safeOutput ? (token.output ? "" : ONE_CHAR) + (opts.capture ? `(${analysis.safeOutput})` : analysis.safeOutput) : void 0;
				const open = tokens[token.tokensIndex];
				open.type = "text";
				open.value = literal;
				open.output = safeOutput || utils.escapeRegex(literal);
				for (let i = token.tokensIndex + 1; i < tokens.length; i++) {
					tokens[i].value = "";
					tokens[i].output = "";
					delete tokens[i].suffix;
				}
				state.output = token.output + open.output;
				state.backtrack = true;
				push({
					type: "paren",
					extglob: true,
					value,
					output: ""
				});
				decrement("parens");
				return;
			}
			let output = token.close + (opts.capture ? ")" : "");
			let rest;
			if (token.type === "negate") {
				let extglobStar = star;
				if (token.inner && token.inner.length > 1 && token.inner.includes("/")) extglobStar = globstar(opts);
				if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) output = token.close = `)$))${extglobStar}`;
				if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) output = token.close = `)${parse(rest, {
					...options,
					fastpaths: false
				}).output})${extglobStar})`;
				if (token.prev.type === "bos") state.negatedExtglob = true;
			}
			push({
				type: "paren",
				extglob: true,
				value,
				output
			});
			decrement("parens");
		};
		/**
		* Fast paths
		*/
		if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
			let backslashes = false;
			let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
				if (first === "\\") {
					backslashes = true;
					return m;
				}
				if (first === "?") {
					if (esc) return esc + first + (rest ? QMARK.repeat(rest.length) : "");
					if (index === 0) return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
					return QMARK.repeat(chars.length);
				}
				if (first === ".") return DOT_LITERAL.repeat(chars.length);
				if (first === "*") {
					if (esc) return esc + first + (rest ? star : "");
					return star;
				}
				return esc ? m : `\\${m}`;
			});
			if (backslashes === true) if (opts.unescape === true) output = output.replace(/\\/g, "");
			else output = output.replace(/\\+/g, (m) => {
				return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
			});
			if (output === input && opts.contains === true) {
				state.output = input;
				return state;
			}
			state.output = utils.wrapOutput(output, state, options);
			return state;
		}
		/**
		* Tokenize input until we reach end-of-string
		*/
		while (!eos()) {
			value = advance();
			if (value === "\0") continue;
			/**
			* Escaped characters
			*/
			if (value === "\\") {
				const next = peek();
				if (next === "/" && opts.bash !== true) continue;
				if (next === "." || next === ";") continue;
				if (!next) {
					value += "\\";
					push({
						type: "text",
						value
					});
					continue;
				}
				const match = /^\\+/.exec(remaining());
				let slashes = 0;
				if (match && match[0].length > 2) {
					slashes = match[0].length;
					state.index += slashes;
					if (slashes % 2 !== 0) value += "\\";
				}
				if (opts.unescape === true) value = advance();
				else value += advance();
				if (state.brackets === 0) {
					push({
						type: "text",
						value
					});
					continue;
				}
			}
			/**
			* If we're inside a regex character class, continue
			* until we reach the closing bracket.
			*/
			if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
				if (opts.posix !== false && value === ":") {
					const inner = prev.value.slice(1);
					if (inner.includes("[")) {
						prev.posix = true;
						if (inner.includes(":")) {
							const idx = prev.value.lastIndexOf("[");
							const pre = prev.value.slice(0, idx);
							const posix = POSIX_REGEX_SOURCE[prev.value.slice(idx + 2)];
							if (posix) {
								prev.value = pre + posix;
								state.backtrack = true;
								advance();
								if (!bos.output && tokens.indexOf(prev) === 1) bos.output = ONE_CHAR;
								continue;
							}
						}
					}
				}
				if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") value = `\\${value}`;
				if (value === "]" && (prev.value === "[" || prev.value === "[^")) value = `\\${value}`;
				if (opts.posix === true && value === "!" && prev.value === "[") value = "^";
				prev.value += value;
				append({ value });
				continue;
			}
			/**
			* If we're inside a quoted string, continue
			* until we reach the closing double quote.
			*/
			if (state.quotes === 1 && value !== "\"") {
				value = utils.escapeRegex(value);
				prev.value += value;
				append({ value });
				continue;
			}
			/**
			* Double quotes
			*/
			if (value === "\"") {
				state.quotes = state.quotes === 1 ? 0 : 1;
				if (opts.keepQuotes === true) push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Parentheses
			*/
			if (value === "(") {
				increment("parens");
				push({
					type: "paren",
					value
				});
				continue;
			}
			if (value === ")") {
				if (state.parens === 0 && opts.strictBrackets === true) throw new SyntaxError(syntaxError("opening", "("));
				const extglob = extglobs[extglobs.length - 1];
				if (extglob && state.parens === extglob.parens + 1) {
					extglobClose(extglobs.pop());
					continue;
				}
				push({
					type: "paren",
					value,
					output: state.parens ? ")" : "\\)"
				});
				decrement("parens");
				continue;
			}
			/**
			* Square brackets
			*/
			if (value === "[") {
				if (opts.nobracket === true || !remaining().includes("]")) {
					if (opts.nobracket !== true && opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
					value = `\\${value}`;
				} else increment("brackets");
				push({
					type: "bracket",
					value
				});
				continue;
			}
			if (value === "]") {
				if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
					push({
						type: "text",
						value,
						output: `\\${value}`
					});
					continue;
				}
				if (state.brackets === 0) {
					if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("opening", "["));
					push({
						type: "text",
						value,
						output: `\\${value}`
					});
					continue;
				}
				decrement("brackets");
				const prevValue = prev.value.slice(1);
				if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) value = `/${value}`;
				prev.value += value;
				append({ value });
				if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) continue;
				const escaped = utils.escapeRegex(prev.value);
				state.output = state.output.slice(0, -prev.value.length);
				if (opts.literalBrackets === true) {
					state.output += escaped;
					prev.value = escaped;
					continue;
				}
				prev.value = `(${capture}${escaped}|${prev.value})`;
				state.output += prev.value;
				continue;
			}
			/**
			* Braces
			*/
			if (value === "{" && opts.nobrace !== true) {
				increment("braces");
				const open = {
					type: "brace",
					value,
					output: "(",
					outputIndex: state.output.length,
					tokensIndex: state.tokens.length
				};
				braces.push(open);
				push(open);
				continue;
			}
			if (value === "}") {
				const brace = braces[braces.length - 1];
				if (opts.nobrace === true || !brace) {
					push({
						type: "text",
						value,
						output: value
					});
					continue;
				}
				let output = ")";
				if (brace.dots === true) {
					const arr = tokens.slice();
					const range = [];
					for (let i = arr.length - 1; i >= 0; i--) {
						tokens.pop();
						if (arr[i].type === "brace") break;
						if (arr[i].type !== "dots") range.unshift(arr[i].value);
					}
					output = expandRange(range, opts);
					state.backtrack = true;
				}
				if (brace.comma !== true && brace.dots !== true) {
					const out = state.output.slice(0, brace.outputIndex);
					const toks = state.tokens.slice(brace.tokensIndex);
					brace.value = brace.output = "\\{";
					value = output = "\\}";
					state.output = out;
					for (const t of toks) state.output += t.output || t.value;
				}
				push({
					type: "brace",
					value,
					output
				});
				decrement("braces");
				braces.pop();
				continue;
			}
			/**
			* Pipes
			*/
			if (value === "|") {
				if (extglobs.length > 0) extglobs[extglobs.length - 1].conditions++;
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Commas
			*/
			if (value === ",") {
				let output = value;
				const brace = braces[braces.length - 1];
				if (brace && stack[stack.length - 1] === "braces") {
					brace.comma = true;
					output = "|";
				}
				push({
					type: "comma",
					value,
					output
				});
				continue;
			}
			/**
			* Slashes
			*/
			if (value === "/") {
				if (prev.type === "dot" && state.index === state.start + 1) {
					state.start = state.index + 1;
					state.consumed = "";
					state.output = "";
					tokens.pop();
					prev = bos;
					continue;
				}
				push({
					type: "slash",
					value,
					output: SLASH_LITERAL
				});
				continue;
			}
			/**
			* Dots
			*/
			if (value === ".") {
				if (state.braces > 0 && prev.type === "dot") {
					if (prev.value === ".") prev.output = DOT_LITERAL;
					const brace = braces[braces.length - 1];
					prev.type = "dots";
					prev.output += value;
					prev.value += value;
					brace.dots = true;
					continue;
				}
				if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
					push({
						type: "text",
						value,
						output: DOT_LITERAL
					});
					continue;
				}
				push({
					type: "dot",
					value,
					output: DOT_LITERAL
				});
				continue;
			}
			/**
			* Question marks
			*/
			if (value === "?") {
				if (!(prev && prev.value === "(") && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					extglobOpen("qmark", value);
					continue;
				}
				if (prev && prev.type === "paren") {
					const next = peek();
					let output = value;
					if (next === "<" && !utils.supportsLookbehinds()) throw new Error("Node.js v10 or higher is required for regex lookbehinds");
					if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) output = `\\${value}`;
					push({
						type: "text",
						value,
						output
					});
					continue;
				}
				if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
					push({
						type: "qmark",
						value,
						output: QMARK_NO_DOT
					});
					continue;
				}
				push({
					type: "qmark",
					value,
					output: QMARK
				});
				continue;
			}
			/**
			* Exclamation
			*/
			if (value === "!") {
				if (opts.noextglob !== true && peek() === "(") {
					if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
						extglobOpen("negate", value);
						continue;
					}
				}
				if (opts.nonegate !== true && state.index === 0) {
					negate();
					continue;
				}
			}
			/**
			* Plus
			*/
			if (value === "+") {
				if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					extglobOpen("plus", value);
					continue;
				}
				if (prev && prev.value === "(" || opts.regex === false) {
					push({
						type: "plus",
						value,
						output: PLUS_LITERAL
					});
					continue;
				}
				if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
					push({
						type: "plus",
						value
					});
					continue;
				}
				push({
					type: "plus",
					value: PLUS_LITERAL
				});
				continue;
			}
			/**
			* Plain text
			*/
			if (value === "@") {
				if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					push({
						type: "at",
						extglob: true,
						value,
						output: ""
					});
					continue;
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Plain text
			*/
			if (value !== "*") {
				if (value === "$" || value === "^") value = `\\${value}`;
				const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
				if (match) {
					value += match[0];
					state.index += match[0].length;
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Stars
			*/
			if (prev && (prev.type === "globstar" || prev.star === true)) {
				prev.type = "star";
				prev.star = true;
				prev.value += value;
				prev.output = star;
				state.backtrack = true;
				state.globstar = true;
				consume(value);
				continue;
			}
			let rest = remaining();
			if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
				extglobOpen("star", value);
				continue;
			}
			if (prev.type === "star") {
				if (opts.noglobstar === true) {
					consume(value);
					continue;
				}
				const prior = prev.prev;
				const before = prior.prev;
				const isStart = prior.type === "slash" || prior.type === "bos";
				const afterStar = before && (before.type === "star" || before.type === "globstar");
				if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
					push({
						type: "star",
						value,
						output: ""
					});
					continue;
				}
				const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
				const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
				if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
					push({
						type: "star",
						value,
						output: ""
					});
					continue;
				}
				while (rest.slice(0, 3) === "/**") {
					const after = input[state.index + 4];
					if (after && after !== "/") break;
					rest = rest.slice(3);
					consume("/**", 3);
				}
				if (prior.type === "bos" && eos()) {
					prev.type = "globstar";
					prev.value += value;
					prev.output = globstar(opts);
					state.output = prev.output;
					state.globstar = true;
					consume(value);
					continue;
				}
				if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
					state.output = state.output.slice(0, -(prior.output + prev.output).length);
					prior.output = `(?:${prior.output}`;
					prev.type = "globstar";
					prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
					prev.value += value;
					state.globstar = true;
					state.output += prior.output + prev.output;
					consume(value);
					continue;
				}
				if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
					const end = rest[1] !== void 0 ? "|$" : "";
					state.output = state.output.slice(0, -(prior.output + prev.output).length);
					prior.output = `(?:${prior.output}`;
					prev.type = "globstar";
					prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
					prev.value += value;
					state.output += prior.output + prev.output;
					state.globstar = true;
					consume(value + advance());
					push({
						type: "slash",
						value: "/",
						output: ""
					});
					continue;
				}
				if (prior.type === "bos" && rest[0] === "/") {
					prev.type = "globstar";
					prev.value += value;
					prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
					state.output = prev.output;
					state.globstar = true;
					consume(value + advance());
					push({
						type: "slash",
						value: "/",
						output: ""
					});
					continue;
				}
				state.output = state.output.slice(0, -prev.output.length);
				prev.type = "globstar";
				prev.output = globstar(opts);
				prev.value += value;
				state.output += prev.output;
				state.globstar = true;
				consume(value);
				continue;
			}
			const token = {
				type: "star",
				value,
				output: star
			};
			if (opts.bash === true) {
				token.output = ".*?";
				if (prev.type === "bos" || prev.type === "slash") token.output = nodot + token.output;
				push(token);
				continue;
			}
			if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
				token.output = value;
				push(token);
				continue;
			}
			if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
				if (prev.type === "dot") {
					state.output += NO_DOT_SLASH;
					prev.output += NO_DOT_SLASH;
				} else if (opts.dot === true) {
					state.output += NO_DOTS_SLASH;
					prev.output += NO_DOTS_SLASH;
				} else {
					state.output += nodot;
					prev.output += nodot;
				}
				if (peek() !== "*") {
					state.output += ONE_CHAR;
					prev.output += ONE_CHAR;
				}
			}
			push(token);
		}
		while (state.brackets > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
			state.output = utils.escapeLast(state.output, "[");
			decrement("brackets");
		}
		while (state.parens > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
			state.output = utils.escapeLast(state.output, "(");
			decrement("parens");
		}
		while (state.braces > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
			state.output = utils.escapeLast(state.output, "{");
			decrement("braces");
		}
		if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) push({
			type: "maybe_slash",
			value: "",
			output: `${SLASH_LITERAL}?`
		});
		if (state.backtrack === true) {
			state.output = "";
			for (const token of state.tokens) {
				state.output += token.output != null ? token.output : token.value;
				if (token.suffix) state.output += token.suffix;
			}
		}
		return state;
	};
	/**
	* Fast paths for creating regular expressions for common glob patterns.
	* This can significantly speed up processing and has very little downside
	* impact when none of the fast paths match.
	*/
	parse.fastpaths = (input, options) => {
		const opts = { ...options };
		const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
		const len = input.length;
		if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
		input = REPLACEMENTS[input] || input;
		const win32 = utils.isWindows(options);
		const { DOT_LITERAL, SLASH_LITERAL, ONE_CHAR, DOTS_SLASH, NO_DOT, NO_DOTS, NO_DOTS_SLASH, STAR, START_ANCHOR } = constants.globChars(win32);
		const nodot = opts.dot ? NO_DOTS : NO_DOT;
		const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
		const capture = opts.capture ? "" : "?:";
		const state = {
			negated: false,
			prefix: ""
		};
		let star = opts.bash === true ? ".*?" : STAR;
		if (opts.capture) star = `(${star})`;
		const globstar = (opts) => {
			if (opts.noglobstar === true) return star;
			return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
		};
		const create = (str) => {
			switch (str) {
				case "*": return `${nodot}${ONE_CHAR}${star}`;
				case ".*": return `${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "*.*": return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "*/*": return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
				case "**": return nodot + globstar(opts);
				case "**/*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
				case "**/*.*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "**/.*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
				default: {
					const match = /^(.*?)\.(\w+)$/.exec(str);
					if (!match) return;
					const source = create(match[1]);
					if (!source) return;
					return source + DOT_LITERAL + match[2];
				}
			}
		};
		let source = create(utils.removePrefix(input, state));
		if (source && opts.strictSlashes !== true) source += `${SLASH_LITERAL}?`;
		return source;
	};
	module.exports = parse;
}));
//#endregion
//#region node_modules/.pnpm/picomatch@2.3.2/node_modules/picomatch/lib/picomatch.js
var require_picomatch$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var path$7 = __require("path");
	var scan = require_scan();
	var parse = require_parse();
	var utils = require_utils$2();
	var constants = require_constants$1();
	var isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
	/**
	* Creates a matcher function from one or more glob patterns. The
	* returned function takes a string to match as its first argument,
	* and returns true if the string is a match. The returned matcher
	* function also takes a boolean as the second argument that, when true,
	* returns an object with additional information.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch(glob[, options]);
	*
	* const isMatch = picomatch('*.!(*a)');
	* console.log(isMatch('a.a')); //=> false
	* console.log(isMatch('a.b')); //=> true
	* ```
	* @name picomatch
	* @param {String|Array} `globs` One or more glob patterns.
	* @param {Object=} `options`
	* @return {Function=} Returns a matcher function.
	* @api public
	*/
	var picomatch = (glob, options, returnState = false) => {
		if (Array.isArray(glob)) {
			const fns = glob.map((input) => picomatch(input, options, returnState));
			const arrayMatcher = (str) => {
				for (const isMatch of fns) {
					const state = isMatch(str);
					if (state) return state;
				}
				return false;
			};
			return arrayMatcher;
		}
		const isState = isObject(glob) && glob.tokens && glob.input;
		if (glob === "" || typeof glob !== "string" && !isState) throw new TypeError("Expected pattern to be a non-empty string");
		const opts = options || {};
		const posix = utils.isWindows(options);
		const regex = isState ? picomatch.compileRe(glob, options) : picomatch.makeRe(glob, options, false, true);
		const state = regex.state;
		delete regex.state;
		let isIgnored = () => false;
		if (opts.ignore) {
			const ignoreOpts = {
				...options,
				ignore: null,
				onMatch: null,
				onResult: null
			};
			isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
		}
		const matcher = (input, returnObject = false) => {
			const { isMatch, match, output } = picomatch.test(input, regex, options, {
				glob,
				posix
			});
			const result = {
				glob,
				state,
				regex,
				posix,
				input,
				output,
				match,
				isMatch
			};
			if (typeof opts.onResult === "function") opts.onResult(result);
			if (isMatch === false) {
				result.isMatch = false;
				return returnObject ? result : false;
			}
			if (isIgnored(input)) {
				if (typeof opts.onIgnore === "function") opts.onIgnore(result);
				result.isMatch = false;
				return returnObject ? result : false;
			}
			if (typeof opts.onMatch === "function") opts.onMatch(result);
			return returnObject ? result : true;
		};
		if (returnState) matcher.state = state;
		return matcher;
	};
	/**
	* Test `input` with the given `regex`. This is used by the main
	* `picomatch()` function to test the input string.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.test(input, regex[, options]);
	*
	* console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
	* // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
	* ```
	* @param {String} `input` String to test.
	* @param {RegExp} `regex`
	* @return {Object} Returns an object with matching info.
	* @api public
	*/
	picomatch.test = (input, regex, options, { glob, posix } = {}) => {
		if (typeof input !== "string") throw new TypeError("Expected input to be a string");
		if (input === "") return {
			isMatch: false,
			output: ""
		};
		const opts = options || {};
		const format = opts.format || (posix ? utils.toPosixSlashes : null);
		let match = input === glob;
		let output = match && format ? format(input) : input;
		if (match === false) {
			output = format ? format(input) : input;
			match = output === glob;
		}
		if (match === false || opts.capture === true) if (opts.matchBase === true || opts.basename === true) match = picomatch.matchBase(input, regex, options, posix);
		else match = regex.exec(output);
		return {
			isMatch: Boolean(match),
			match,
			output
		};
	};
	/**
	* Match the basename of a filepath.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.matchBase(input, glob[, options]);
	* console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
	* ```
	* @param {String} `input` String to test.
	* @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
	* @return {Boolean}
	* @api public
	*/
	picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
		return (glob instanceof RegExp ? glob : picomatch.makeRe(glob, options)).test(path$7.basename(input));
	};
	/**
	* Returns true if **any** of the given glob `patterns` match the specified `string`.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.isMatch(string, patterns[, options]);
	*
	* console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
	* console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
	* ```
	* @param {String|Array} str The string to test.
	* @param {String|Array} patterns One or more glob patterns to use for matching.
	* @param {Object} [options] See available [options](#options).
	* @return {Boolean} Returns true if any patterns match `str`
	* @api public
	*/
	picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
	/**
	* Parse a glob pattern to create the source string for a regular
	* expression.
	*
	* ```js
	* const picomatch = require('picomatch');
	* const result = picomatch.parse(pattern[, options]);
	* ```
	* @param {String} `pattern`
	* @param {Object} `options`
	* @return {Object} Returns an object with useful properties and output to be used as a regex source string.
	* @api public
	*/
	picomatch.parse = (pattern, options) => {
		if (Array.isArray(pattern)) return pattern.map((p) => picomatch.parse(p, options));
		return parse(pattern, {
			...options,
			fastpaths: false
		});
	};
	/**
	* Scan a glob pattern to separate the pattern into segments.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.scan(input[, options]);
	*
	* const result = picomatch.scan('!./foo/*.js');
	* console.log(result);
	* { prefix: '!./',
	*   input: '!./foo/*.js',
	*   start: 3,
	*   base: 'foo',
	*   glob: '*.js',
	*   isBrace: false,
	*   isBracket: false,
	*   isGlob: true,
	*   isExtglob: false,
	*   isGlobstar: false,
	*   negated: true }
	* ```
	* @param {String} `input` Glob pattern to scan.
	* @param {Object} `options`
	* @return {Object} Returns an object with
	* @api public
	*/
	picomatch.scan = (input, options) => scan(input, options);
	/**
	* Compile a regular expression from the `state` object returned by the
	* [parse()](#parse) method.
	*
	* @param {Object} `state`
	* @param {Object} `options`
	* @param {Boolean} `returnOutput` Intended for implementors, this argument allows you to return the raw output from the parser.
	* @param {Boolean} `returnState` Adds the state to a `state` property on the returned regex. Useful for implementors and debugging.
	* @return {RegExp}
	* @api public
	*/
	picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
		if (returnOutput === true) return state.output;
		const opts = options || {};
		const prepend = opts.contains ? "" : "^";
		const append = opts.contains ? "" : "$";
		let source = `${prepend}(?:${state.output})${append}`;
		if (state && state.negated === true) source = `^(?!${source}).*$`;
		const regex = picomatch.toRegex(source, options);
		if (returnState === true) regex.state = state;
		return regex;
	};
	/**
	* Create a regular expression from a parsed glob pattern.
	*
	* ```js
	* const picomatch = require('picomatch');
	* const state = picomatch.parse('*.js');
	* // picomatch.compileRe(state[, options]);
	*
	* console.log(picomatch.compileRe(state));
	* //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	* ```
	* @param {String} `state` The object returned from the `.parse` method.
	* @param {Object} `options`
	* @param {Boolean} `returnOutput` Implementors may use this argument to return the compiled output, instead of a regular expression. This is not exposed on the options to prevent end-users from mutating the result.
	* @param {Boolean} `returnState` Implementors may use this argument to return the state from the parsed glob with the returned regular expression.
	* @return {RegExp} Returns a regex created from the given pattern.
	* @api public
	*/
	picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
		if (!input || typeof input !== "string") throw new TypeError("Expected a non-empty string");
		let parsed = {
			negated: false,
			fastpaths: true
		};
		if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) parsed.output = parse.fastpaths(input, options);
		if (!parsed.output) parsed = parse(input, options);
		return picomatch.compileRe(parsed, options, returnOutput, returnState);
	};
	/**
	* Create a regular expression from the given regex source string.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.toRegex(source[, options]);
	*
	* const { output } = picomatch.parse('*.js');
	* console.log(picomatch.toRegex(output));
	* //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	* ```
	* @param {String} `source` Regular expression source string.
	* @param {Object} `options`
	* @return {RegExp}
	* @api public
	*/
	picomatch.toRegex = (source, options) => {
		try {
			const opts = options || {};
			return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
		} catch (err) {
			if (options && options.debug === true) throw err;
			return /$^/;
		}
	};
	/**
	* Picomatch constants.
	* @return {Object}
	*/
	picomatch.constants = constants;
	/**
	* Expose "picomatch"
	*/
	module.exports = picomatch;
}));
//#endregion
//#region node_modules/.pnpm/picomatch@2.3.2/node_modules/picomatch/index.js
var require_picomatch = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_picomatch$1();
}));
//#endregion
//#region node_modules/.pnpm/micromatch@4.0.8/node_modules/micromatch/index.js
var require_micromatch = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var util = __require("util");
	var braces = require_braces();
	var picomatch = require_picomatch();
	var utils = require_utils$2();
	var isEmptyString = (v) => v === "" || v === "./";
	var hasBraces = (v) => {
		const index = v.indexOf("{");
		return index > -1 && v.indexOf("}", index) > -1;
	};
	/**
	* Returns an array of strings that match one or more glob patterns.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm(list, patterns[, options]);
	*
	* console.log(mm(['a.js', 'a.txt'], ['*.js']));
	* //=> [ 'a.js' ]
	* ```
	* @param {String|Array<string>} `list` List of strings to match.
	* @param {String|Array<string>} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options)
	* @return {Array} Returns an array of matches
	* @summary false
	* @api public
	*/
	var micromatch = (list, patterns, options) => {
		patterns = [].concat(patterns);
		list = [].concat(list);
		let omit = /* @__PURE__ */ new Set();
		let keep = /* @__PURE__ */ new Set();
		let items = /* @__PURE__ */ new Set();
		let negatives = 0;
		let onResult = (state) => {
			items.add(state.output);
			if (options && options.onResult) options.onResult(state);
		};
		for (let i = 0; i < patterns.length; i++) {
			let isMatch = picomatch(String(patterns[i]), {
				...options,
				onResult
			}, true);
			let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
			if (negated) negatives++;
			for (let item of list) {
				let matched = isMatch(item, true);
				if (!(negated ? !matched.isMatch : matched.isMatch)) continue;
				if (negated) omit.add(matched.output);
				else {
					omit.delete(matched.output);
					keep.add(matched.output);
				}
			}
		}
		let matches = (negatives === patterns.length ? [...items] : [...keep]).filter((item) => !omit.has(item));
		if (options && matches.length === 0) {
			if (options.failglob === true) throw new Error(`No matches found for "${patterns.join(", ")}"`);
			if (options.nonull === true || options.nullglob === true) return options.unescape ? patterns.map((p) => p.replace(/\\/g, "")) : patterns;
		}
		return matches;
	};
	/**
	* Backwards compatibility
	*/
	micromatch.match = micromatch;
	/**
	* Returns a matcher function from the given glob `pattern` and `options`.
	* The returned function takes a string to match as its only argument and returns
	* true if the string is a match.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.matcher(pattern[, options]);
	*
	* const isMatch = mm.matcher('*.!(*a)');
	* console.log(isMatch('a.a')); //=> false
	* console.log(isMatch('a.b')); //=> true
	* ```
	* @param {String} `pattern` Glob pattern
	* @param {Object} `options`
	* @return {Function} Returns a matcher function.
	* @api public
	*/
	micromatch.matcher = (pattern, options) => picomatch(pattern, options);
	/**
	* Returns true if **any** of the given glob `patterns` match the specified `string`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.isMatch(string, patterns[, options]);
	*
	* console.log(mm.isMatch('a.a', ['b.*', '*.a'])); //=> true
	* console.log(mm.isMatch('a.a', 'b.*')); //=> false
	* ```
	* @param {String} `str` The string to test.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `[options]` See available [options](#options).
	* @return {Boolean} Returns true if any patterns match `str`
	* @api public
	*/
	micromatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
	/**
	* Backwards compatibility
	*/
	micromatch.any = micromatch.isMatch;
	/**
	* Returns a list of strings that _**do not match any**_ of the given `patterns`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.not(list, patterns[, options]);
	*
	* console.log(mm.not(['a.a', 'b.b', 'c.c'], '*.a'));
	* //=> ['b.b', 'c.c']
	* ```
	* @param {Array} `list` Array of strings to match.
	* @param {String|Array} `patterns` One or more glob pattern to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Array} Returns an array of strings that **do not match** the given patterns.
	* @api public
	*/
	micromatch.not = (list, patterns, options = {}) => {
		patterns = [].concat(patterns).map(String);
		let result = /* @__PURE__ */ new Set();
		let items = [];
		let onResult = (state) => {
			if (options.onResult) options.onResult(state);
			items.push(state.output);
		};
		let matches = new Set(micromatch(list, patterns, {
			...options,
			onResult
		}));
		for (let item of items) if (!matches.has(item)) result.add(item);
		return [...result];
	};
	/**
	* Returns true if the given `string` contains the given pattern. Similar
	* to [.isMatch](#isMatch) but the pattern can match any part of the string.
	*
	* ```js
	* var mm = require('micromatch');
	* // mm.contains(string, pattern[, options]);
	*
	* console.log(mm.contains('aa/bb/cc', '*b'));
	* //=> true
	* console.log(mm.contains('aa/bb/cc', '*d'));
	* //=> false
	* ```
	* @param {String} `str` The string to match.
	* @param {String|Array} `patterns` Glob pattern to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Boolean} Returns true if any of the patterns matches any part of `str`.
	* @api public
	*/
	micromatch.contains = (str, pattern, options) => {
		if (typeof str !== "string") throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
		if (Array.isArray(pattern)) return pattern.some((p) => micromatch.contains(str, p, options));
		if (typeof pattern === "string") {
			if (isEmptyString(str) || isEmptyString(pattern)) return false;
			if (str.includes(pattern) || str.startsWith("./") && str.slice(2).includes(pattern)) return true;
		}
		return micromatch.isMatch(str, pattern, {
			...options,
			contains: true
		});
	};
	/**
	* Filter the keys of the given object with the given `glob` pattern
	* and `options`. Does not attempt to match nested keys. If you need this feature,
	* use [glob-object][] instead.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.matchKeys(object, patterns[, options]);
	*
	* const obj = { aa: 'a', ab: 'b', ac: 'c' };
	* console.log(mm.matchKeys(obj, '*b'));
	* //=> { ab: 'b' }
	* ```
	* @param {Object} `object` The object with keys to filter.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Object} Returns an object with only keys that match the given patterns.
	* @api public
	*/
	micromatch.matchKeys = (obj, patterns, options) => {
		if (!utils.isObject(obj)) throw new TypeError("Expected the first argument to be an object");
		let keys = micromatch(Object.keys(obj), patterns, options);
		let res = {};
		for (let key of keys) res[key] = obj[key];
		return res;
	};
	/**
	* Returns true if some of the strings in the given `list` match any of the given glob `patterns`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.some(list, patterns[, options]);
	*
	* console.log(mm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
	* // true
	* console.log(mm.some(['foo.js'], ['*.js', '!foo.js']));
	* // false
	* ```
	* @param {String|Array} `list` The string or array of strings to test. Returns as soon as the first match is found.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Boolean} Returns true if any `patterns` matches any of the strings in `list`
	* @api public
	*/
	micromatch.some = (list, patterns, options) => {
		let items = [].concat(list);
		for (let pattern of [].concat(patterns)) {
			let isMatch = picomatch(String(pattern), options);
			if (items.some((item) => isMatch(item))) return true;
		}
		return false;
	};
	/**
	* Returns true if every string in the given `list` matches
	* any of the given glob `patterns`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.every(list, patterns[, options]);
	*
	* console.log(mm.every('foo.js', ['foo.js']));
	* // true
	* console.log(mm.every(['foo.js', 'bar.js'], ['*.js']));
	* // true
	* console.log(mm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
	* // false
	* console.log(mm.every(['foo.js'], ['*.js', '!foo.js']));
	* // false
	* ```
	* @param {String|Array} `list` The string or array of strings to test.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Boolean} Returns true if all `patterns` matches all of the strings in `list`
	* @api public
	*/
	micromatch.every = (list, patterns, options) => {
		let items = [].concat(list);
		for (let pattern of [].concat(patterns)) {
			let isMatch = picomatch(String(pattern), options);
			if (!items.every((item) => isMatch(item))) return false;
		}
		return true;
	};
	/**
	* Returns true if **all** of the given `patterns` match
	* the specified string.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.all(string, patterns[, options]);
	*
	* console.log(mm.all('foo.js', ['foo.js']));
	* // true
	*
	* console.log(mm.all('foo.js', ['*.js', '!foo.js']));
	* // false
	*
	* console.log(mm.all('foo.js', ['*.js', 'foo.js']));
	* // true
	*
	* console.log(mm.all('foo.js', ['*.js', 'f*', '*o*', '*o.js']));
	* // true
	* ```
	* @param {String|Array} `str` The string to test.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Boolean} Returns true if any patterns match `str`
	* @api public
	*/
	micromatch.all = (str, patterns, options) => {
		if (typeof str !== "string") throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
		return [].concat(patterns).every((p) => picomatch(p, options)(str));
	};
	/**
	* Returns an array of matches captured by `pattern` in `string, or `null` if the pattern did not match.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.capture(pattern, string[, options]);
	*
	* console.log(mm.capture('test/*.js', 'test/foo.js'));
	* //=> ['foo']
	* console.log(mm.capture('test/*.js', 'foo/bar.css'));
	* //=> null
	* ```
	* @param {String} `glob` Glob pattern to use for matching.
	* @param {String} `input` String to match
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Array|null} Returns an array of captures if the input matches the glob pattern, otherwise `null`.
	* @api public
	*/
	micromatch.capture = (glob, input, options) => {
		let posix = utils.isWindows(options);
		let match = picomatch.makeRe(String(glob), {
			...options,
			capture: true
		}).exec(posix ? utils.toPosixSlashes(input) : input);
		if (match) return match.slice(1).map((v) => v === void 0 ? "" : v);
	};
	/**
	* Create a regular expression from the given glob `pattern`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.makeRe(pattern[, options]);
	*
	* console.log(mm.makeRe('*.js'));
	* //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
	* ```
	* @param {String} `pattern` A glob pattern to convert to regex.
	* @param {Object} `options`
	* @return {RegExp} Returns a regex created from the given pattern.
	* @api public
	*/
	micromatch.makeRe = (...args) => picomatch.makeRe(...args);
	/**
	* Scan a glob pattern to separate the pattern into segments. Used
	* by the [split](#split) method.
	*
	* ```js
	* const mm = require('micromatch');
	* const state = mm.scan(pattern[, options]);
	* ```
	* @param {String} `pattern`
	* @param {Object} `options`
	* @return {Object} Returns an object with
	* @api public
	*/
	micromatch.scan = (...args) => picomatch.scan(...args);
	/**
	* Parse a glob pattern to create the source string for a regular
	* expression.
	*
	* ```js
	* const mm = require('micromatch');
	* const state = mm.parse(pattern[, options]);
	* ```
	* @param {String} `glob`
	* @param {Object} `options`
	* @return {Object} Returns an object with useful properties and output to be used as regex source string.
	* @api public
	*/
	micromatch.parse = (patterns, options) => {
		let res = [];
		for (let pattern of [].concat(patterns || [])) for (let str of braces(String(pattern), options)) res.push(picomatch.parse(str, options));
		return res;
	};
	/**
	* Process the given brace `pattern`.
	*
	* ```js
	* const { braces } = require('micromatch');
	* console.log(braces('foo/{a,b,c}/bar'));
	* //=> [ 'foo/(a|b|c)/bar' ]
	*
	* console.log(braces('foo/{a,b,c}/bar', { expand: true }));
	* //=> [ 'foo/a/bar', 'foo/b/bar', 'foo/c/bar' ]
	* ```
	* @param {String} `pattern` String with brace pattern to process.
	* @param {Object} `options` Any [options](#options) to change how expansion is performed. See the [braces][] library for all available options.
	* @return {Array}
	* @api public
	*/
	micromatch.braces = (pattern, options) => {
		if (typeof pattern !== "string") throw new TypeError("Expected a string");
		if (options && options.nobrace === true || !hasBraces(pattern)) return [pattern];
		return braces(pattern, options);
	};
	/**
	* Expand braces
	*/
	micromatch.braceExpand = (pattern, options) => {
		if (typeof pattern !== "string") throw new TypeError("Expected a string");
		return micromatch.braces(pattern, {
			...options,
			expand: true
		});
	};
	/**
	* Expose micromatch
	*/
	micromatch.hasBraces = hasBraces;
	module.exports = micromatch;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/utils/pattern.js
var require_pattern = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isAbsolute = exports.partitionAbsoluteAndRelative = exports.removeDuplicateSlashes = exports.matchAny = exports.convertPatternsToRe = exports.makeRe = exports.getPatternParts = exports.expandBraceExpansion = exports.expandPatternsWithBraceExpansion = exports.isAffectDepthOfReadingPattern = exports.endsWithSlashGlobStar = exports.hasGlobStar = exports.getBaseDirectory = exports.isPatternRelatedToParentDirectory = exports.getPatternsOutsideCurrentDirectory = exports.getPatternsInsideCurrentDirectory = exports.getPositivePatterns = exports.getNegativePatterns = exports.isPositivePattern = exports.isNegativePattern = exports.convertToNegativePattern = exports.convertToPositivePattern = exports.isDynamicPattern = exports.isStaticPattern = void 0;
	var path$6 = __require("path");
	var globParent = require_glob_parent();
	var micromatch = require_micromatch();
	var GLOBSTAR = "**";
	var ESCAPE_SYMBOL = "\\";
	var COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
	var REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[[^[]*]/;
	var REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\([^(]*\|[^|]*\)/;
	var GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\([^(]*\)/;
	var BRACE_EXPANSION_SEPARATORS_RE = /,|\.\./;
	/**
	* Matches a sequence of two or more consecutive slashes, excluding the first two slashes at the beginning of the string.
	* The latter is due to the presence of the device path at the beginning of the UNC path.
	*/
	var DOUBLE_SLASH_RE = /(?!^)\/{2,}/g;
	function isStaticPattern(pattern, options = {}) {
		return !isDynamicPattern(pattern, options);
	}
	exports.isStaticPattern = isStaticPattern;
	function isDynamicPattern(pattern, options = {}) {
		/**
		* A special case with an empty string is necessary for matching patterns that start with a forward slash.
		* An empty string cannot be a dynamic pattern.
		* For example, the pattern `/lib/*` will be spread into parts: '', 'lib', '*'.
		*/
		if (pattern === "") return false;
		/**
		* When the `caseSensitiveMatch` option is disabled, all patterns must be marked as dynamic, because we cannot check
		* filepath directly (without read directory).
		*/
		if (options.caseSensitiveMatch === false || pattern.includes(ESCAPE_SYMBOL)) return true;
		if (COMMON_GLOB_SYMBOLS_RE.test(pattern) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) || REGEX_GROUP_SYMBOLS_RE.test(pattern)) return true;
		if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) return true;
		if (options.braceExpansion !== false && hasBraceExpansion(pattern)) return true;
		return false;
	}
	exports.isDynamicPattern = isDynamicPattern;
	function hasBraceExpansion(pattern) {
		const openingBraceIndex = pattern.indexOf("{");
		if (openingBraceIndex === -1) return false;
		const closingBraceIndex = pattern.indexOf("}", openingBraceIndex + 1);
		if (closingBraceIndex === -1) return false;
		const braceContent = pattern.slice(openingBraceIndex, closingBraceIndex);
		return BRACE_EXPANSION_SEPARATORS_RE.test(braceContent);
	}
	function convertToPositivePattern(pattern) {
		return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
	}
	exports.convertToPositivePattern = convertToPositivePattern;
	function convertToNegativePattern(pattern) {
		return "!" + pattern;
	}
	exports.convertToNegativePattern = convertToNegativePattern;
	function isNegativePattern(pattern) {
		return pattern.startsWith("!") && pattern[1] !== "(";
	}
	exports.isNegativePattern = isNegativePattern;
	function isPositivePattern(pattern) {
		return !isNegativePattern(pattern);
	}
	exports.isPositivePattern = isPositivePattern;
	function getNegativePatterns(patterns) {
		return patterns.filter(isNegativePattern);
	}
	exports.getNegativePatterns = getNegativePatterns;
	function getPositivePatterns(patterns) {
		return patterns.filter(isPositivePattern);
	}
	exports.getPositivePatterns = getPositivePatterns;
	/**
	* Returns patterns that can be applied inside the current directory.
	*
	* @example
	* // ['./*', '*', 'a/*']
	* getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
	*/
	function getPatternsInsideCurrentDirectory(patterns) {
		return patterns.filter((pattern) => !isPatternRelatedToParentDirectory(pattern));
	}
	exports.getPatternsInsideCurrentDirectory = getPatternsInsideCurrentDirectory;
	/**
	* Returns patterns to be expanded relative to (outside) the current directory.
	*
	* @example
	* // ['../*', './../*']
	* getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
	*/
	function getPatternsOutsideCurrentDirectory(patterns) {
		return patterns.filter(isPatternRelatedToParentDirectory);
	}
	exports.getPatternsOutsideCurrentDirectory = getPatternsOutsideCurrentDirectory;
	function isPatternRelatedToParentDirectory(pattern) {
		return pattern.startsWith("..") || pattern.startsWith("./..");
	}
	exports.isPatternRelatedToParentDirectory = isPatternRelatedToParentDirectory;
	function getBaseDirectory(pattern) {
		return globParent(pattern, { flipBackslashes: false });
	}
	exports.getBaseDirectory = getBaseDirectory;
	function hasGlobStar(pattern) {
		return pattern.includes(GLOBSTAR);
	}
	exports.hasGlobStar = hasGlobStar;
	function endsWithSlashGlobStar(pattern) {
		return pattern.endsWith("/" + GLOBSTAR);
	}
	exports.endsWithSlashGlobStar = endsWithSlashGlobStar;
	function isAffectDepthOfReadingPattern(pattern) {
		const basename = path$6.basename(pattern);
		return endsWithSlashGlobStar(pattern) || isStaticPattern(basename);
	}
	exports.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
	function expandPatternsWithBraceExpansion(patterns) {
		return patterns.reduce((collection, pattern) => {
			return collection.concat(expandBraceExpansion(pattern));
		}, []);
	}
	exports.expandPatternsWithBraceExpansion = expandPatternsWithBraceExpansion;
	function expandBraceExpansion(pattern) {
		const patterns = micromatch.braces(pattern, {
			expand: true,
			nodupes: true,
			keepEscaping: true
		});
		/**
		* Sort the patterns by length so that the same depth patterns are processed side by side.
		* `a/{b,}/{c,}/*` – `['a///*', 'a/b//*', 'a//c/*', 'a/b/c/*']`
		*/
		patterns.sort((a, b) => a.length - b.length);
		/**
		* Micromatch can return an empty string in the case of patterns like `{a,}`.
		*/
		return patterns.filter((pattern) => pattern !== "");
	}
	exports.expandBraceExpansion = expandBraceExpansion;
	function getPatternParts(pattern, options) {
		let { parts } = micromatch.scan(pattern, Object.assign(Object.assign({}, options), { parts: true }));
		/**
		* The scan method returns an empty array in some cases.
		* See micromatch/picomatch#58 for more details.
		*/
		if (parts.length === 0) parts = [pattern];
		/**
		* The scan method does not return an empty part for the pattern with a forward slash.
		* This is another part of micromatch/picomatch#58.
		*/
		if (parts[0].startsWith("/")) {
			parts[0] = parts[0].slice(1);
			parts.unshift("");
		}
		return parts;
	}
	exports.getPatternParts = getPatternParts;
	function makeRe(pattern, options) {
		return micromatch.makeRe(pattern, options);
	}
	exports.makeRe = makeRe;
	function convertPatternsToRe(patterns, options) {
		return patterns.map((pattern) => makeRe(pattern, options));
	}
	exports.convertPatternsToRe = convertPatternsToRe;
	function matchAny(entry, patternsRe) {
		return patternsRe.some((patternRe) => patternRe.test(entry));
	}
	exports.matchAny = matchAny;
	/**
	* This package only works with forward slashes as a path separator.
	* Because of this, we cannot use the standard `path.normalize` method, because on Windows platform it will use of backslashes.
	*/
	function removeDuplicateSlashes(pattern) {
		return pattern.replace(DOUBLE_SLASH_RE, "/");
	}
	exports.removeDuplicateSlashes = removeDuplicateSlashes;
	function partitionAbsoluteAndRelative(patterns) {
		const absolute = [];
		const relative = [];
		for (const pattern of patterns) if (isAbsolute(pattern)) absolute.push(pattern);
		else relative.push(pattern);
		return [absolute, relative];
	}
	exports.partitionAbsoluteAndRelative = partitionAbsoluteAndRelative;
	function isAbsolute(pattern) {
		return path$6.isAbsolute(pattern);
	}
	exports.isAbsolute = isAbsolute;
}));
//#endregion
//#region node_modules/.pnpm/merge2@1.4.1/node_modules/merge2/index.js
var require_merge2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var PassThrough = __require("stream").PassThrough;
	var slice = Array.prototype.slice;
	module.exports = merge2;
	function merge2() {
		const streamsQueue = [];
		const args = slice.call(arguments);
		let merging = false;
		let options = args[args.length - 1];
		if (options && !Array.isArray(options) && options.pipe == null) args.pop();
		else options = {};
		const doEnd = options.end !== false;
		const doPipeError = options.pipeError === true;
		if (options.objectMode == null) options.objectMode = true;
		if (options.highWaterMark == null) options.highWaterMark = 64 * 1024;
		const mergedStream = PassThrough(options);
		function addStream() {
			for (let i = 0, len = arguments.length; i < len; i++) streamsQueue.push(pauseStreams(arguments[i], options));
			mergeStream();
			return this;
		}
		function mergeStream() {
			if (merging) return;
			merging = true;
			let streams = streamsQueue.shift();
			if (!streams) {
				process.nextTick(endStream);
				return;
			}
			if (!Array.isArray(streams)) streams = [streams];
			let pipesCount = streams.length + 1;
			function next() {
				if (--pipesCount > 0) return;
				merging = false;
				mergeStream();
			}
			function pipe(stream) {
				function onend() {
					stream.removeListener("merge2UnpipeEnd", onend);
					stream.removeListener("end", onend);
					if (doPipeError) stream.removeListener("error", onerror);
					next();
				}
				function onerror(err) {
					mergedStream.emit("error", err);
				}
				if (stream._readableState.endEmitted) return next();
				stream.on("merge2UnpipeEnd", onend);
				stream.on("end", onend);
				if (doPipeError) stream.on("error", onerror);
				stream.pipe(mergedStream, { end: false });
				stream.resume();
			}
			for (let i = 0; i < streams.length; i++) pipe(streams[i]);
			next();
		}
		function endStream() {
			merging = false;
			mergedStream.emit("queueDrain");
			if (doEnd) mergedStream.end();
		}
		mergedStream.setMaxListeners(0);
		mergedStream.add = addStream;
		mergedStream.on("unpipe", function(stream) {
			stream.emit("merge2UnpipeEnd");
		});
		if (args.length) addStream.apply(null, args);
		return mergedStream;
	}
	function pauseStreams(streams, options) {
		if (!Array.isArray(streams)) {
			if (!streams._readableState && streams.pipe) streams = streams.pipe(PassThrough(options));
			if (!streams._readableState || !streams.pause || !streams.pipe) throw new Error("Only readable stream can be merged.");
			streams.pause();
		} else for (let i = 0, len = streams.length; i < len; i++) streams[i] = pauseStreams(streams[i], options);
		return streams;
	}
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/utils/stream.js
var require_stream$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.merge = void 0;
	var merge2 = require_merge2();
	function merge(streams) {
		const mergedStream = merge2(streams);
		streams.forEach((stream) => {
			stream.once("error", (error) => mergedStream.emit("error", error));
		});
		mergedStream.once("close", () => propagateCloseEventToSources(streams));
		mergedStream.once("end", () => propagateCloseEventToSources(streams));
		return mergedStream;
	}
	exports.merge = merge;
	function propagateCloseEventToSources(streams) {
		streams.forEach((stream) => stream.emit("close"));
	}
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/utils/string.js
var require_string = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isEmpty = exports.isString = void 0;
	function isString(input) {
		return typeof input === "string";
	}
	exports.isString = isString;
	function isEmpty(input) {
		return input === "";
	}
	exports.isEmpty = isEmpty;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/utils/index.js
var require_utils$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.string = exports.stream = exports.pattern = exports.path = exports.fs = exports.errno = exports.array = void 0;
	exports.array = require_array();
	exports.errno = require_errno();
	exports.fs = require_fs$3();
	exports.path = require_path();
	exports.pattern = require_pattern();
	exports.stream = require_stream$3();
	exports.string = require_string();
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/managers/tasks.js
var require_tasks = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.convertPatternGroupToTask = exports.convertPatternGroupsToTasks = exports.groupPatternsByBaseDirectory = exports.getNegativePatternsAsPositive = exports.getPositivePatterns = exports.convertPatternsToTasks = exports.generate = void 0;
	var utils = require_utils$1();
	function generate(input, settings) {
		const patterns = processPatterns(input, settings);
		const ignore = processPatterns(settings.ignore, settings);
		const positivePatterns = getPositivePatterns(patterns);
		const negativePatterns = getNegativePatternsAsPositive(patterns, ignore);
		const staticPatterns = positivePatterns.filter((pattern) => utils.pattern.isStaticPattern(pattern, settings));
		const dynamicPatterns = positivePatterns.filter((pattern) => utils.pattern.isDynamicPattern(pattern, settings));
		const staticTasks = convertPatternsToTasks(staticPatterns, negativePatterns, false);
		const dynamicTasks = convertPatternsToTasks(dynamicPatterns, negativePatterns, true);
		return staticTasks.concat(dynamicTasks);
	}
	exports.generate = generate;
	function processPatterns(input, settings) {
		let patterns = input;
		/**
		* The original pattern like `{,*,**,a/*}` can lead to problems checking the depth when matching entry
		* and some problems with the micromatch package (see fast-glob issues: #365, #394).
		*
		* To solve this problem, we expand all patterns containing brace expansion. This can lead to a slight slowdown
		* in matching in the case of a large set of patterns after expansion.
		*/
		if (settings.braceExpansion) patterns = utils.pattern.expandPatternsWithBraceExpansion(patterns);
		/**
		* If the `baseNameMatch` option is enabled, we must add globstar to patterns, so that they can be used
		* at any nesting level.
		*
		* We do this here, because otherwise we have to complicate the filtering logic. For example, we need to change
		* the pattern in the filter before creating a regular expression. There is no need to change the patterns
		* in the application. Only on the input.
		*/
		if (settings.baseNameMatch) patterns = patterns.map((pattern) => pattern.includes("/") ? pattern : `**/${pattern}`);
		/**
		* This method also removes duplicate slashes that may have been in the pattern or formed as a result of expansion.
		*/
		return patterns.map((pattern) => utils.pattern.removeDuplicateSlashes(pattern));
	}
	/**
	* Returns tasks grouped by basic pattern directories.
	*
	* Patterns that can be found inside (`./`) and outside (`../`) the current directory are handled separately.
	* This is necessary because directory traversal starts at the base directory and goes deeper.
	*/
	function convertPatternsToTasks(positive, negative, dynamic) {
		const tasks = [];
		const patternsOutsideCurrentDirectory = utils.pattern.getPatternsOutsideCurrentDirectory(positive);
		const patternsInsideCurrentDirectory = utils.pattern.getPatternsInsideCurrentDirectory(positive);
		const outsideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsOutsideCurrentDirectory);
		const insideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsInsideCurrentDirectory);
		tasks.push(...convertPatternGroupsToTasks(outsideCurrentDirectoryGroup, negative, dynamic));
		if ("." in insideCurrentDirectoryGroup) tasks.push(convertPatternGroupToTask(".", patternsInsideCurrentDirectory, negative, dynamic));
		else tasks.push(...convertPatternGroupsToTasks(insideCurrentDirectoryGroup, negative, dynamic));
		return tasks;
	}
	exports.convertPatternsToTasks = convertPatternsToTasks;
	function getPositivePatterns(patterns) {
		return utils.pattern.getPositivePatterns(patterns);
	}
	exports.getPositivePatterns = getPositivePatterns;
	function getNegativePatternsAsPositive(patterns, ignore) {
		return utils.pattern.getNegativePatterns(patterns).concat(ignore).map(utils.pattern.convertToPositivePattern);
	}
	exports.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
	function groupPatternsByBaseDirectory(patterns) {
		return patterns.reduce((collection, pattern) => {
			const base = utils.pattern.getBaseDirectory(pattern);
			if (base in collection) collection[base].push(pattern);
			else collection[base] = [pattern];
			return collection;
		}, {});
	}
	exports.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
	function convertPatternGroupsToTasks(positive, negative, dynamic) {
		return Object.keys(positive).map((base) => {
			return convertPatternGroupToTask(base, positive[base], negative, dynamic);
		});
	}
	exports.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
	function convertPatternGroupToTask(base, positive, negative, dynamic) {
		return {
			dynamic,
			positive,
			negative,
			base,
			patterns: [].concat(positive, negative.map(utils.pattern.convertToNegativePattern))
		};
	}
	exports.convertPatternGroupToTask = convertPatternGroupToTask;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/providers/async.js
var require_async$5 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.read = void 0;
	function read(path, settings, callback) {
		settings.fs.lstat(path, (lstatError, lstat) => {
			if (lstatError !== null) {
				callFailureCallback(callback, lstatError);
				return;
			}
			if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
				callSuccessCallback(callback, lstat);
				return;
			}
			settings.fs.stat(path, (statError, stat) => {
				if (statError !== null) {
					if (settings.throwErrorOnBrokenSymbolicLink) {
						callFailureCallback(callback, statError);
						return;
					}
					callSuccessCallback(callback, lstat);
					return;
				}
				if (settings.markSymbolicLink) stat.isSymbolicLink = () => true;
				callSuccessCallback(callback, stat);
			});
		});
	}
	exports.read = read;
	function callFailureCallback(callback, error) {
		callback(error);
	}
	function callSuccessCallback(callback, result) {
		callback(null, result);
	}
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/providers/sync.js
var require_sync$5 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.read = void 0;
	function read(path, settings) {
		const lstat = settings.fs.lstatSync(path);
		if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) return lstat;
		try {
			const stat = settings.fs.statSync(path);
			if (settings.markSymbolicLink) stat.isSymbolicLink = () => true;
			return stat;
		} catch (error) {
			if (!settings.throwErrorOnBrokenSymbolicLink) return lstat;
			throw error;
		}
	}
	exports.read = read;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/adapters/fs.js
var require_fs$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createFileSystemAdapter = exports.FILE_SYSTEM_ADAPTER = void 0;
	var fs$4 = __require("fs");
	exports.FILE_SYSTEM_ADAPTER = {
		lstat: fs$4.lstat,
		stat: fs$4.stat,
		lstatSync: fs$4.lstatSync,
		statSync: fs$4.statSync
	};
	function createFileSystemAdapter(fsMethods) {
		if (fsMethods === void 0) return exports.FILE_SYSTEM_ADAPTER;
		return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
	}
	exports.createFileSystemAdapter = createFileSystemAdapter;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/settings.js
var require_settings$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var fs = require_fs$2();
	var Settings = class {
		constructor(_options = {}) {
			this._options = _options;
			this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
			this.fs = fs.createFileSystemAdapter(this._options.fs);
			this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
			this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
		}
		_getValue(option, value) {
			return option !== null && option !== void 0 ? option : value;
		}
	};
	exports.default = Settings;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/index.js
var require_out$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.statSync = exports.stat = exports.Settings = void 0;
	var async = require_async$5();
	var sync = require_sync$5();
	var settings_1 = require_settings$3();
	exports.Settings = settings_1.default;
	function stat(path, optionsOrSettingsOrCallback, callback) {
		if (typeof optionsOrSettingsOrCallback === "function") {
			async.read(path, getSettings(), optionsOrSettingsOrCallback);
			return;
		}
		async.read(path, getSettings(optionsOrSettingsOrCallback), callback);
	}
	exports.stat = stat;
	function statSync(path, optionsOrSettings) {
		const settings = getSettings(optionsOrSettings);
		return sync.read(path, settings);
	}
	exports.statSync = statSync;
	function getSettings(settingsOrOptions = {}) {
		if (settingsOrOptions instanceof settings_1.default) return settingsOrOptions;
		return new settings_1.default(settingsOrOptions);
	}
}));
//#endregion
//#region node_modules/.pnpm/queue-microtask@1.2.3/node_modules/queue-microtask/index.js
var require_queue_microtask = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
	var promise;
	module.exports = typeof queueMicrotask === "function" ? queueMicrotask.bind(typeof window !== "undefined" ? window : global) : (cb) => (promise || (promise = Promise.resolve())).then(cb).catch((err) => setTimeout(() => {
		throw err;
	}, 0));
}));
//#endregion
//#region node_modules/.pnpm/run-parallel@1.2.0/node_modules/run-parallel/index.js
var require_run_parallel = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
	module.exports = runParallel;
	var queueMicrotask = require_queue_microtask();
	function runParallel(tasks, cb) {
		let results, pending, keys;
		let isSync = true;
		if (Array.isArray(tasks)) {
			results = [];
			pending = tasks.length;
		} else {
			keys = Object.keys(tasks);
			results = {};
			pending = keys.length;
		}
		function done(err) {
			function end() {
				if (cb) cb(err, results);
				cb = null;
			}
			if (isSync) queueMicrotask(end);
			else end();
		}
		function each(i, err, result) {
			results[i] = result;
			if (--pending === 0 || err) done(err);
		}
		if (!pending) done(null);
		else if (keys) keys.forEach(function(key) {
			tasks[key](function(err, result) {
				each(key, err, result);
			});
		});
		else tasks.forEach(function(task, i) {
			task(function(err, result) {
				each(i, err, result);
			});
		});
		isSync = false;
	}
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES = void 0;
	var NODE_PROCESS_VERSION_PARTS = process.versions.node.split(".");
	if (NODE_PROCESS_VERSION_PARTS[0] === void 0 || NODE_PROCESS_VERSION_PARTS[1] === void 0) throw new Error(`Unexpected behavior. The 'process.versions.node' variable has invalid value: ${process.versions.node}`);
	var MAJOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
	var MINOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
	var SUPPORTED_MAJOR_VERSION = 10;
	/**
	* IS `true` for Node.js 10.10 and greater.
	*/
	exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES = MAJOR_VERSION > SUPPORTED_MAJOR_VERSION || MAJOR_VERSION === SUPPORTED_MAJOR_VERSION && MINOR_VERSION >= 10;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/utils/fs.js
var require_fs$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createDirentFromStats = void 0;
	var DirentFromStats = class {
		constructor(name, stats) {
			this.name = name;
			this.isBlockDevice = stats.isBlockDevice.bind(stats);
			this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
			this.isDirectory = stats.isDirectory.bind(stats);
			this.isFIFO = stats.isFIFO.bind(stats);
			this.isFile = stats.isFile.bind(stats);
			this.isSocket = stats.isSocket.bind(stats);
			this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
		}
	};
	function createDirentFromStats(name, stats) {
		return new DirentFromStats(name, stats);
	}
	exports.createDirentFromStats = createDirentFromStats;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/utils/index.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.fs = void 0;
	exports.fs = require_fs$1();
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/common.js
var require_common$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.joinPathSegments = void 0;
	function joinPathSegments(a, b, separator) {
		/**
		* The correct handling of cases when the first segment is a root (`/`, `C:/`) or UNC path (`//?/C:/`).
		*/
		if (a.endsWith(separator)) return a + b;
		return a + separator + b;
	}
	exports.joinPathSegments = joinPathSegments;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/async.js
var require_async$4 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.readdir = exports.readdirWithFileTypes = exports.read = void 0;
	var fsStat = require_out$3();
	var rpl = require_run_parallel();
	var constants_1 = require_constants();
	var utils = require_utils();
	var common = require_common$1();
	function read(directory, settings, callback) {
		if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
			readdirWithFileTypes(directory, settings, callback);
			return;
		}
		readdir(directory, settings, callback);
	}
	exports.read = read;
	function readdirWithFileTypes(directory, settings, callback) {
		settings.fs.readdir(directory, { withFileTypes: true }, (readdirError, dirents) => {
			if (readdirError !== null) {
				callFailureCallback(callback, readdirError);
				return;
			}
			const entries = dirents.map((dirent) => ({
				dirent,
				name: dirent.name,
				path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
			}));
			if (!settings.followSymbolicLinks) {
				callSuccessCallback(callback, entries);
				return;
			}
			rpl(entries.map((entry) => makeRplTaskEntry(entry, settings)), (rplError, rplEntries) => {
				if (rplError !== null) {
					callFailureCallback(callback, rplError);
					return;
				}
				callSuccessCallback(callback, rplEntries);
			});
		});
	}
	exports.readdirWithFileTypes = readdirWithFileTypes;
	function makeRplTaskEntry(entry, settings) {
		return (done) => {
			if (!entry.dirent.isSymbolicLink()) {
				done(null, entry);
				return;
			}
			settings.fs.stat(entry.path, (statError, stats) => {
				if (statError !== null) {
					if (settings.throwErrorOnBrokenSymbolicLink) {
						done(statError);
						return;
					}
					done(null, entry);
					return;
				}
				entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
				done(null, entry);
			});
		};
	}
	function readdir(directory, settings, callback) {
		settings.fs.readdir(directory, (readdirError, names) => {
			if (readdirError !== null) {
				callFailureCallback(callback, readdirError);
				return;
			}
			rpl(names.map((name) => {
				const path = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
				return (done) => {
					fsStat.stat(path, settings.fsStatSettings, (error, stats) => {
						if (error !== null) {
							done(error);
							return;
						}
						const entry = {
							name,
							path,
							dirent: utils.fs.createDirentFromStats(name, stats)
						};
						if (settings.stats) entry.stats = stats;
						done(null, entry);
					});
				};
			}), (rplError, entries) => {
				if (rplError !== null) {
					callFailureCallback(callback, rplError);
					return;
				}
				callSuccessCallback(callback, entries);
			});
		});
	}
	exports.readdir = readdir;
	function callFailureCallback(callback, error) {
		callback(error);
	}
	function callSuccessCallback(callback, result) {
		callback(null, result);
	}
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/sync.js
var require_sync$4 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.readdir = exports.readdirWithFileTypes = exports.read = void 0;
	var fsStat = require_out$3();
	var constants_1 = require_constants();
	var utils = require_utils();
	var common = require_common$1();
	function read(directory, settings) {
		if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) return readdirWithFileTypes(directory, settings);
		return readdir(directory, settings);
	}
	exports.read = read;
	function readdirWithFileTypes(directory, settings) {
		return settings.fs.readdirSync(directory, { withFileTypes: true }).map((dirent) => {
			const entry = {
				dirent,
				name: dirent.name,
				path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
			};
			if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) try {
				const stats = settings.fs.statSync(entry.path);
				entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
			} catch (error) {
				if (settings.throwErrorOnBrokenSymbolicLink) throw error;
			}
			return entry;
		});
	}
	exports.readdirWithFileTypes = readdirWithFileTypes;
	function readdir(directory, settings) {
		return settings.fs.readdirSync(directory).map((name) => {
			const entryPath = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
			const stats = fsStat.statSync(entryPath, settings.fsStatSettings);
			const entry = {
				name,
				path: entryPath,
				dirent: utils.fs.createDirentFromStats(name, stats)
			};
			if (settings.stats) entry.stats = stats;
			return entry;
		});
	}
	exports.readdir = readdir;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/adapters/fs.js
var require_fs = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createFileSystemAdapter = exports.FILE_SYSTEM_ADAPTER = void 0;
	var fs$3 = __require("fs");
	exports.FILE_SYSTEM_ADAPTER = {
		lstat: fs$3.lstat,
		stat: fs$3.stat,
		lstatSync: fs$3.lstatSync,
		statSync: fs$3.statSync,
		readdir: fs$3.readdir,
		readdirSync: fs$3.readdirSync
	};
	function createFileSystemAdapter(fsMethods) {
		if (fsMethods === void 0) return exports.FILE_SYSTEM_ADAPTER;
		return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
	}
	exports.createFileSystemAdapter = createFileSystemAdapter;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/settings.js
var require_settings$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var path$5 = __require("path");
	var fsStat = require_out$3();
	var fs = require_fs();
	var Settings = class {
		constructor(_options = {}) {
			this._options = _options;
			this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
			this.fs = fs.createFileSystemAdapter(this._options.fs);
			this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path$5.sep);
			this.stats = this._getValue(this._options.stats, false);
			this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
			this.fsStatSettings = new fsStat.Settings({
				followSymbolicLink: this.followSymbolicLinks,
				fs: this.fs,
				throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
			});
		}
		_getValue(option, value) {
			return option !== null && option !== void 0 ? option : value;
		}
	};
	exports.default = Settings;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/index.js
var require_out$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Settings = exports.scandirSync = exports.scandir = void 0;
	var async = require_async$4();
	var sync = require_sync$4();
	var settings_1 = require_settings$2();
	exports.Settings = settings_1.default;
	function scandir(path, optionsOrSettingsOrCallback, callback) {
		if (typeof optionsOrSettingsOrCallback === "function") {
			async.read(path, getSettings(), optionsOrSettingsOrCallback);
			return;
		}
		async.read(path, getSettings(optionsOrSettingsOrCallback), callback);
	}
	exports.scandir = scandir;
	function scandirSync(path, optionsOrSettings) {
		const settings = getSettings(optionsOrSettings);
		return sync.read(path, settings);
	}
	exports.scandirSync = scandirSync;
	function getSettings(settingsOrOptions = {}) {
		if (settingsOrOptions instanceof settings_1.default) return settingsOrOptions;
		return new settings_1.default(settingsOrOptions);
	}
}));
//#endregion
//#region node_modules/.pnpm/reusify@1.1.0/node_modules/reusify/reusify.js
var require_reusify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function reusify(Constructor) {
		var head = new Constructor();
		var tail = head;
		function get() {
			var current = head;
			if (current.next) head = current.next;
			else {
				head = new Constructor();
				tail = head;
			}
			current.next = null;
			return current;
		}
		function release(obj) {
			tail.next = obj;
			tail = obj;
		}
		return {
			get,
			release
		};
	}
	module.exports = reusify;
}));
//#endregion
//#region node_modules/.pnpm/fastq@1.20.1/node_modules/fastq/queue.js
var require_queue = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var reusify = require_reusify();
	function fastqueue(context, worker, _concurrency) {
		if (typeof context === "function") {
			_concurrency = worker;
			worker = context;
			context = null;
		}
		if (!(_concurrency >= 1)) throw new Error("fastqueue concurrency must be equal to or greater than 1");
		var cache = reusify(Task);
		var queueHead = null;
		var queueTail = null;
		var _running = 0;
		var errorHandler = null;
		var self = {
			push,
			drain: noop,
			saturated: noop,
			pause,
			paused: false,
			get concurrency() {
				return _concurrency;
			},
			set concurrency(value) {
				if (!(value >= 1)) throw new Error("fastqueue concurrency must be equal to or greater than 1");
				_concurrency = value;
				if (self.paused) return;
				for (; queueHead && _running < _concurrency;) {
					_running++;
					release();
				}
			},
			running,
			resume,
			idle,
			length,
			getQueue,
			unshift,
			empty: noop,
			kill,
			killAndDrain,
			error,
			abort
		};
		return self;
		function running() {
			return _running;
		}
		function pause() {
			self.paused = true;
		}
		function length() {
			var current = queueHead;
			var counter = 0;
			while (current) {
				current = current.next;
				counter++;
			}
			return counter;
		}
		function getQueue() {
			var current = queueHead;
			var tasks = [];
			while (current) {
				tasks.push(current.value);
				current = current.next;
			}
			return tasks;
		}
		function resume() {
			if (!self.paused) return;
			self.paused = false;
			if (queueHead === null) {
				_running++;
				release();
				return;
			}
			for (; queueHead && _running < _concurrency;) {
				_running++;
				release();
			}
		}
		function idle() {
			return _running === 0 && self.length() === 0;
		}
		function push(value, done) {
			var current = cache.get();
			current.context = context;
			current.release = release;
			current.value = value;
			current.callback = done || noop;
			current.errorHandler = errorHandler;
			if (_running >= _concurrency || self.paused) if (queueTail) {
				queueTail.next = current;
				queueTail = current;
			} else {
				queueHead = current;
				queueTail = current;
				self.saturated();
			}
			else {
				_running++;
				worker.call(context, current.value, current.worked);
			}
		}
		function unshift(value, done) {
			var current = cache.get();
			current.context = context;
			current.release = release;
			current.value = value;
			current.callback = done || noop;
			current.errorHandler = errorHandler;
			if (_running >= _concurrency || self.paused) if (queueHead) {
				current.next = queueHead;
				queueHead = current;
			} else {
				queueHead = current;
				queueTail = current;
				self.saturated();
			}
			else {
				_running++;
				worker.call(context, current.value, current.worked);
			}
		}
		function release(holder) {
			if (holder) cache.release(holder);
			var next = queueHead;
			if (next && _running <= _concurrency) if (!self.paused) {
				if (queueTail === queueHead) queueTail = null;
				queueHead = next.next;
				next.next = null;
				worker.call(context, next.value, next.worked);
				if (queueTail === null) self.empty();
			} else _running--;
			else if (--_running === 0) self.drain();
		}
		function kill() {
			queueHead = null;
			queueTail = null;
			self.drain = noop;
		}
		function killAndDrain() {
			queueHead = null;
			queueTail = null;
			self.drain();
			self.drain = noop;
		}
		function abort() {
			var current = queueHead;
			queueHead = null;
			queueTail = null;
			while (current) {
				var next = current.next;
				var callback = current.callback;
				var errorHandler = current.errorHandler;
				var val = current.value;
				var context = current.context;
				current.value = null;
				current.callback = noop;
				current.errorHandler = null;
				if (errorHandler) errorHandler(/* @__PURE__ */ new Error("abort"), val);
				callback.call(context, /* @__PURE__ */ new Error("abort"));
				current.release(current);
				current = next;
			}
			self.drain = noop;
		}
		function error(handler) {
			errorHandler = handler;
		}
	}
	function noop() {}
	function Task() {
		this.value = null;
		this.callback = noop;
		this.next = null;
		this.release = noop;
		this.context = null;
		this.errorHandler = null;
		var self = this;
		this.worked = function worked(err, result) {
			var callback = self.callback;
			var errorHandler = self.errorHandler;
			var val = self.value;
			self.value = null;
			self.callback = noop;
			if (self.errorHandler) errorHandler(err, val);
			callback.call(self.context, err, result);
			self.release(self);
		};
	}
	function queueAsPromised(context, worker, _concurrency) {
		if (typeof context === "function") {
			_concurrency = worker;
			worker = context;
			context = null;
		}
		function asyncWrapper(arg, cb) {
			worker.call(this, arg).then(function(res) {
				cb(null, res);
			}, cb);
		}
		var queue = fastqueue(context, asyncWrapper, _concurrency);
		var pushCb = queue.push;
		var unshiftCb = queue.unshift;
		queue.push = push;
		queue.unshift = unshift;
		queue.drained = drained;
		return queue;
		function push(value) {
			var p = new Promise(function(resolve, reject) {
				pushCb(value, function(err, result) {
					if (err) {
						reject(err);
						return;
					}
					resolve(result);
				});
			});
			p.catch(noop);
			return p;
		}
		function unshift(value) {
			var p = new Promise(function(resolve, reject) {
				unshiftCb(value, function(err, result) {
					if (err) {
						reject(err);
						return;
					}
					resolve(result);
				});
			});
			p.catch(noop);
			return p;
		}
		function drained() {
			return new Promise(function(resolve) {
				process.nextTick(function() {
					if (queue.idle()) resolve();
					else {
						var previousDrain = queue.drain;
						queue.drain = function() {
							if (typeof previousDrain === "function") previousDrain();
							resolve();
							queue.drain = previousDrain;
						};
					}
				});
			});
		}
	}
	module.exports = fastqueue;
	module.exports.promise = queueAsPromised;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/common.js
var require_common = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.joinPathSegments = exports.replacePathSegmentSeparator = exports.isAppliedFilter = exports.isFatalError = void 0;
	function isFatalError(settings, error) {
		if (settings.errorFilter === null) return true;
		return !settings.errorFilter(error);
	}
	exports.isFatalError = isFatalError;
	function isAppliedFilter(filter, value) {
		return filter === null || filter(value);
	}
	exports.isAppliedFilter = isAppliedFilter;
	function replacePathSegmentSeparator(filepath, separator) {
		return filepath.split(/[/\\]/).join(separator);
	}
	exports.replacePathSegmentSeparator = replacePathSegmentSeparator;
	function joinPathSegments(a, b, separator) {
		if (a === "") return b;
		/**
		* The correct handling of cases when the first segment is a root (`/`, `C:/`) or UNC path (`//?/C:/`).
		*/
		if (a.endsWith(separator)) return a + b;
		return a + separator + b;
	}
	exports.joinPathSegments = joinPathSegments;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/reader.js
var require_reader$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var common = require_common();
	var Reader = class {
		constructor(_root, _settings) {
			this._root = _root;
			this._settings = _settings;
			this._root = common.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
		}
	};
	exports.default = Reader;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/async.js
var require_async$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var events_1 = __require("events");
	var fsScandir = require_out$2();
	var fastq = require_queue();
	var common = require_common();
	var reader_1 = require_reader$1();
	var AsyncReader = class extends reader_1.default {
		constructor(_root, _settings) {
			super(_root, _settings);
			this._settings = _settings;
			this._scandir = fsScandir.scandir;
			this._emitter = new events_1.EventEmitter();
			this._queue = fastq(this._worker.bind(this), this._settings.concurrency);
			this._isFatalError = false;
			this._isDestroyed = false;
			this._queue.drain = () => {
				if (!this._isFatalError) this._emitter.emit("end");
			};
		}
		read() {
			this._isFatalError = false;
			this._isDestroyed = false;
			setImmediate(() => {
				this._pushToQueue(this._root, this._settings.basePath);
			});
			return this._emitter;
		}
		get isDestroyed() {
			return this._isDestroyed;
		}
		destroy() {
			if (this._isDestroyed) throw new Error("The reader is already destroyed");
			this._isDestroyed = true;
			this._queue.killAndDrain();
		}
		onEntry(callback) {
			this._emitter.on("entry", callback);
		}
		onError(callback) {
			this._emitter.once("error", callback);
		}
		onEnd(callback) {
			this._emitter.once("end", callback);
		}
		_pushToQueue(directory, base) {
			const queueItem = {
				directory,
				base
			};
			this._queue.push(queueItem, (error) => {
				if (error !== null) this._handleError(error);
			});
		}
		_worker(item, done) {
			this._scandir(item.directory, this._settings.fsScandirSettings, (error, entries) => {
				if (error !== null) {
					done(error, void 0);
					return;
				}
				for (const entry of entries) this._handleEntry(entry, item.base);
				done(null, void 0);
			});
		}
		_handleError(error) {
			if (this._isDestroyed || !common.isFatalError(this._settings, error)) return;
			this._isFatalError = true;
			this._isDestroyed = true;
			this._emitter.emit("error", error);
		}
		_handleEntry(entry, base) {
			if (this._isDestroyed || this._isFatalError) return;
			const fullpath = entry.path;
			if (base !== void 0) entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
			if (common.isAppliedFilter(this._settings.entryFilter, entry)) this._emitEntry(entry);
			if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) this._pushToQueue(fullpath, base === void 0 ? void 0 : entry.path);
		}
		_emitEntry(entry) {
			this._emitter.emit("entry", entry);
		}
	};
	exports.default = AsyncReader;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/async.js
var require_async$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var async_1 = require_async$3();
	var AsyncProvider = class {
		constructor(_root, _settings) {
			this._root = _root;
			this._settings = _settings;
			this._reader = new async_1.default(this._root, this._settings);
			this._storage = [];
		}
		read(callback) {
			this._reader.onError((error) => {
				callFailureCallback(callback, error);
			});
			this._reader.onEntry((entry) => {
				this._storage.push(entry);
			});
			this._reader.onEnd(() => {
				callSuccessCallback(callback, this._storage);
			});
			this._reader.read();
		}
	};
	exports.default = AsyncProvider;
	function callFailureCallback(callback, error) {
		callback(error);
	}
	function callSuccessCallback(callback, entries) {
		callback(null, entries);
	}
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/stream.js
var require_stream$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var stream_1$2 = __require("stream");
	var async_1 = require_async$3();
	var StreamProvider = class {
		constructor(_root, _settings) {
			this._root = _root;
			this._settings = _settings;
			this._reader = new async_1.default(this._root, this._settings);
			this._stream = new stream_1$2.Readable({
				objectMode: true,
				read: () => {},
				destroy: () => {
					if (!this._reader.isDestroyed) this._reader.destroy();
				}
			});
		}
		read() {
			this._reader.onError((error) => {
				this._stream.emit("error", error);
			});
			this._reader.onEntry((entry) => {
				this._stream.push(entry);
			});
			this._reader.onEnd(() => {
				this._stream.push(null);
			});
			this._reader.read();
			return this._stream;
		}
	};
	exports.default = StreamProvider;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/sync.js
var require_sync$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var fsScandir = require_out$2();
	var common = require_common();
	var reader_1 = require_reader$1();
	var SyncReader = class extends reader_1.default {
		constructor() {
			super(...arguments);
			this._scandir = fsScandir.scandirSync;
			this._storage = [];
			this._queue = /* @__PURE__ */ new Set();
		}
		read() {
			this._pushToQueue(this._root, this._settings.basePath);
			this._handleQueue();
			return this._storage;
		}
		_pushToQueue(directory, base) {
			this._queue.add({
				directory,
				base
			});
		}
		_handleQueue() {
			for (const item of this._queue.values()) this._handleDirectory(item.directory, item.base);
		}
		_handleDirectory(directory, base) {
			try {
				const entries = this._scandir(directory, this._settings.fsScandirSettings);
				for (const entry of entries) this._handleEntry(entry, base);
			} catch (error) {
				this._handleError(error);
			}
		}
		_handleError(error) {
			if (!common.isFatalError(this._settings, error)) return;
			throw error;
		}
		_handleEntry(entry, base) {
			const fullpath = entry.path;
			if (base !== void 0) entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
			if (common.isAppliedFilter(this._settings.entryFilter, entry)) this._pushToStorage(entry);
			if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) this._pushToQueue(fullpath, base === void 0 ? void 0 : entry.path);
		}
		_pushToStorage(entry) {
			this._storage.push(entry);
		}
	};
	exports.default = SyncReader;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/sync.js
var require_sync$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var sync_1 = require_sync$3();
	var SyncProvider = class {
		constructor(_root, _settings) {
			this._root = _root;
			this._settings = _settings;
			this._reader = new sync_1.default(this._root, this._settings);
		}
		read() {
			return this._reader.read();
		}
	};
	exports.default = SyncProvider;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/settings.js
var require_settings$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var path$4 = __require("path");
	var fsScandir = require_out$2();
	var Settings = class {
		constructor(_options = {}) {
			this._options = _options;
			this.basePath = this._getValue(this._options.basePath, void 0);
			this.concurrency = this._getValue(this._options.concurrency, Number.POSITIVE_INFINITY);
			this.deepFilter = this._getValue(this._options.deepFilter, null);
			this.entryFilter = this._getValue(this._options.entryFilter, null);
			this.errorFilter = this._getValue(this._options.errorFilter, null);
			this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path$4.sep);
			this.fsScandirSettings = new fsScandir.Settings({
				followSymbolicLinks: this._options.followSymbolicLinks,
				fs: this._options.fs,
				pathSegmentSeparator: this._options.pathSegmentSeparator,
				stats: this._options.stats,
				throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
			});
		}
		_getValue(option, value) {
			return option !== null && option !== void 0 ? option : value;
		}
	};
	exports.default = Settings;
}));
//#endregion
//#region node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/index.js
var require_out$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Settings = exports.walkStream = exports.walkSync = exports.walk = void 0;
	var async_1 = require_async$2();
	var stream_1 = require_stream$2();
	var sync_1 = require_sync$2();
	var settings_1 = require_settings$1();
	exports.Settings = settings_1.default;
	function walk(directory, optionsOrSettingsOrCallback, callback) {
		if (typeof optionsOrSettingsOrCallback === "function") {
			new async_1.default(directory, getSettings()).read(optionsOrSettingsOrCallback);
			return;
		}
		new async_1.default(directory, getSettings(optionsOrSettingsOrCallback)).read(callback);
	}
	exports.walk = walk;
	function walkSync(directory, optionsOrSettings) {
		const settings = getSettings(optionsOrSettings);
		return new sync_1.default(directory, settings).read();
	}
	exports.walkSync = walkSync;
	function walkStream(directory, optionsOrSettings) {
		const settings = getSettings(optionsOrSettings);
		return new stream_1.default(directory, settings).read();
	}
	exports.walkStream = walkStream;
	function getSettings(settingsOrOptions = {}) {
		if (settingsOrOptions instanceof settings_1.default) return settingsOrOptions;
		return new settings_1.default(settingsOrOptions);
	}
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/readers/reader.js
var require_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var path$3 = __require("path");
	var fsStat = require_out$3();
	var utils = require_utils$1();
	var Reader = class {
		constructor(_settings) {
			this._settings = _settings;
			this._fsStatSettings = new fsStat.Settings({
				followSymbolicLink: this._settings.followSymbolicLinks,
				fs: this._settings.fs,
				throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
			});
		}
		_getFullEntryPath(filepath) {
			return path$3.resolve(this._settings.cwd, filepath);
		}
		_makeEntry(stats, pattern) {
			const entry = {
				name: pattern,
				path: pattern,
				dirent: utils.fs.createDirentFromStats(pattern, stats)
			};
			if (this._settings.stats) entry.stats = stats;
			return entry;
		}
		_isFatalError(error) {
			return !utils.errno.isEnoentCodeError(error) && !this._settings.suppressErrors;
		}
	};
	exports.default = Reader;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/readers/stream.js
var require_stream$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var stream_1$1 = __require("stream");
	var fsStat = require_out$3();
	var fsWalk = require_out$1();
	var reader_1 = require_reader();
	var ReaderStream = class extends reader_1.default {
		constructor() {
			super(...arguments);
			this._walkStream = fsWalk.walkStream;
			this._stat = fsStat.stat;
		}
		dynamic(root, options) {
			return this._walkStream(root, options);
		}
		static(patterns, options) {
			const filepaths = patterns.map(this._getFullEntryPath, this);
			const stream = new stream_1$1.PassThrough({ objectMode: true });
			stream._write = (index, _enc, done) => {
				return this._getEntry(filepaths[index], patterns[index], options).then((entry) => {
					if (entry !== null && options.entryFilter(entry)) stream.push(entry);
					if (index === filepaths.length - 1) stream.end();
					done();
				}).catch(done);
			};
			for (let i = 0; i < filepaths.length; i++) stream.write(i);
			return stream;
		}
		_getEntry(filepath, pattern, options) {
			return this._getStat(filepath).then((stats) => this._makeEntry(stats, pattern)).catch((error) => {
				if (options.errorFilter(error)) return null;
				throw error;
			});
		}
		_getStat(filepath) {
			return new Promise((resolve, reject) => {
				this._stat(filepath, this._fsStatSettings, (error, stats) => {
					return error === null ? resolve(stats) : reject(error);
				});
			});
		}
	};
	exports.default = ReaderStream;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/readers/async.js
var require_async$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var fsWalk = require_out$1();
	var reader_1 = require_reader();
	var stream_1 = require_stream$1();
	var ReaderAsync = class extends reader_1.default {
		constructor() {
			super(...arguments);
			this._walkAsync = fsWalk.walk;
			this._readerStream = new stream_1.default(this._settings);
		}
		dynamic(root, options) {
			return new Promise((resolve, reject) => {
				this._walkAsync(root, options, (error, entries) => {
					if (error === null) resolve(entries);
					else reject(error);
				});
			});
		}
		async static(patterns, options) {
			const entries = [];
			const stream = this._readerStream.static(patterns, options);
			return new Promise((resolve, reject) => {
				stream.once("error", reject);
				stream.on("data", (entry) => entries.push(entry));
				stream.once("end", () => resolve(entries));
			});
		}
	};
	exports.default = ReaderAsync;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/matchers/matcher.js
var require_matcher = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var utils = require_utils$1();
	var Matcher = class {
		constructor(_patterns, _settings, _micromatchOptions) {
			this._patterns = _patterns;
			this._settings = _settings;
			this._micromatchOptions = _micromatchOptions;
			this._storage = [];
			this._fillStorage();
		}
		_fillStorage() {
			for (const pattern of this._patterns) {
				const segments = this._getPatternSegments(pattern);
				const sections = this._splitSegmentsIntoSections(segments);
				this._storage.push({
					complete: sections.length <= 1,
					pattern,
					segments,
					sections
				});
			}
		}
		_getPatternSegments(pattern) {
			return utils.pattern.getPatternParts(pattern, this._micromatchOptions).map((part) => {
				if (!utils.pattern.isDynamicPattern(part, this._settings)) return {
					dynamic: false,
					pattern: part
				};
				return {
					dynamic: true,
					pattern: part,
					patternRe: utils.pattern.makeRe(part, this._micromatchOptions)
				};
			});
		}
		_splitSegmentsIntoSections(segments) {
			return utils.array.splitWhen(segments, (segment) => segment.dynamic && utils.pattern.hasGlobStar(segment.pattern));
		}
	};
	exports.default = Matcher;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/matchers/partial.js
var require_partial = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var matcher_1 = require_matcher();
	var PartialMatcher = class extends matcher_1.default {
		match(filepath) {
			const parts = filepath.split("/");
			const levels = parts.length;
			const patterns = this._storage.filter((info) => !info.complete || info.segments.length > levels);
			for (const pattern of patterns) {
				const section = pattern.sections[0];
				/**
				* In this case, the pattern has a globstar and we must read all directories unconditionally,
				* but only if the level has reached the end of the first group.
				*
				* fixtures/{a,b}/**
				*  ^ true/false  ^ always true
				*/
				if (!pattern.complete && levels > section.length) return true;
				if (parts.every((part, index) => {
					const segment = pattern.segments[index];
					if (segment.dynamic && segment.patternRe.test(part)) return true;
					if (!segment.dynamic && segment.pattern === part) return true;
					return false;
				})) return true;
			}
			return false;
		}
	};
	exports.default = PartialMatcher;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/filters/deep.js
var require_deep = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var utils = require_utils$1();
	var partial_1 = require_partial();
	var DeepFilter = class {
		constructor(_settings, _micromatchOptions) {
			this._settings = _settings;
			this._micromatchOptions = _micromatchOptions;
		}
		getFilter(basePath, positive, negative) {
			const matcher = this._getMatcher(positive);
			const negativeRe = this._getNegativePatternsRe(negative);
			return (entry) => this._filter(basePath, entry, matcher, negativeRe);
		}
		_getMatcher(patterns) {
			return new partial_1.default(patterns, this._settings, this._micromatchOptions);
		}
		_getNegativePatternsRe(patterns) {
			const affectDepthOfReadingPatterns = patterns.filter(utils.pattern.isAffectDepthOfReadingPattern);
			return utils.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
		}
		_filter(basePath, entry, matcher, negativeRe) {
			if (this._isSkippedByDeep(basePath, entry.path)) return false;
			if (this._isSkippedSymbolicLink(entry)) return false;
			const filepath = utils.path.removeLeadingDotSegment(entry.path);
			if (this._isSkippedByPositivePatterns(filepath, matcher)) return false;
			return this._isSkippedByNegativePatterns(filepath, negativeRe);
		}
		_isSkippedByDeep(basePath, entryPath) {
			/**
			* Avoid unnecessary depth calculations when it doesn't matter.
			*/
			if (this._settings.deep === Infinity) return false;
			return this._getEntryLevel(basePath, entryPath) >= this._settings.deep;
		}
		_getEntryLevel(basePath, entryPath) {
			const entryPathDepth = entryPath.split("/").length;
			if (basePath === "") return entryPathDepth;
			return entryPathDepth - basePath.split("/").length;
		}
		_isSkippedSymbolicLink(entry) {
			return !this._settings.followSymbolicLinks && entry.dirent.isSymbolicLink();
		}
		_isSkippedByPositivePatterns(entryPath, matcher) {
			return !this._settings.baseNameMatch && !matcher.match(entryPath);
		}
		_isSkippedByNegativePatterns(entryPath, patternsRe) {
			return !utils.pattern.matchAny(entryPath, patternsRe);
		}
	};
	exports.default = DeepFilter;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/filters/entry.js
var require_entry$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var utils = require_utils$1();
	var EntryFilter = class {
		constructor(_settings, _micromatchOptions) {
			this._settings = _settings;
			this._micromatchOptions = _micromatchOptions;
			this.index = /* @__PURE__ */ new Map();
		}
		getFilter(positive, negative) {
			const [absoluteNegative, relativeNegative] = utils.pattern.partitionAbsoluteAndRelative(negative);
			const patterns = {
				positive: { all: utils.pattern.convertPatternsToRe(positive, this._micromatchOptions) },
				negative: {
					absolute: utils.pattern.convertPatternsToRe(absoluteNegative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true })),
					relative: utils.pattern.convertPatternsToRe(relativeNegative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true }))
				}
			};
			return (entry) => this._filter(entry, patterns);
		}
		_filter(entry, patterns) {
			const filepath = utils.path.removeLeadingDotSegment(entry.path);
			if (this._settings.unique && this._isDuplicateEntry(filepath)) return false;
			if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) return false;
			const isMatched = this._isMatchToPatternsSet(filepath, patterns, entry.dirent.isDirectory());
			if (this._settings.unique && isMatched) this._createIndexRecord(filepath);
			return isMatched;
		}
		_isDuplicateEntry(filepath) {
			return this.index.has(filepath);
		}
		_createIndexRecord(filepath) {
			this.index.set(filepath, void 0);
		}
		_onlyFileFilter(entry) {
			return this._settings.onlyFiles && !entry.dirent.isFile();
		}
		_onlyDirectoryFilter(entry) {
			return this._settings.onlyDirectories && !entry.dirent.isDirectory();
		}
		_isMatchToPatternsSet(filepath, patterns, isDirectory) {
			if (!this._isMatchToPatterns(filepath, patterns.positive.all, isDirectory)) return false;
			if (this._isMatchToPatterns(filepath, patterns.negative.relative, isDirectory)) return false;
			if (this._isMatchToAbsoluteNegative(filepath, patterns.negative.absolute, isDirectory)) return false;
			return true;
		}
		_isMatchToAbsoluteNegative(filepath, patternsRe, isDirectory) {
			if (patternsRe.length === 0) return false;
			const fullpath = utils.path.makeAbsolute(this._settings.cwd, filepath);
			return this._isMatchToPatterns(fullpath, patternsRe, isDirectory);
		}
		_isMatchToPatterns(filepath, patternsRe, isDirectory) {
			if (patternsRe.length === 0) return false;
			const isMatched = utils.pattern.matchAny(filepath, patternsRe);
			if (!isMatched && isDirectory) return utils.pattern.matchAny(filepath + "/", patternsRe);
			return isMatched;
		}
	};
	exports.default = EntryFilter;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/filters/error.js
var require_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var utils = require_utils$1();
	var ErrorFilter = class {
		constructor(_settings) {
			this._settings = _settings;
		}
		getFilter() {
			return (error) => this._isNonFatalError(error);
		}
		_isNonFatalError(error) {
			return utils.errno.isEnoentCodeError(error) || this._settings.suppressErrors;
		}
	};
	exports.default = ErrorFilter;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/transformers/entry.js
var require_entry = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var utils = require_utils$1();
	var EntryTransformer = class {
		constructor(_settings) {
			this._settings = _settings;
		}
		getTransformer() {
			return (entry) => this._transform(entry);
		}
		_transform(entry) {
			let filepath = entry.path;
			if (this._settings.absolute) {
				filepath = utils.path.makeAbsolute(this._settings.cwd, filepath);
				filepath = utils.path.unixify(filepath);
			}
			if (this._settings.markDirectories && entry.dirent.isDirectory()) filepath += "/";
			if (!this._settings.objectMode) return filepath;
			return Object.assign(Object.assign({}, entry), { path: filepath });
		}
	};
	exports.default = EntryTransformer;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/provider.js
var require_provider = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var path$2 = __require("path");
	var deep_1 = require_deep();
	var entry_1 = require_entry$1();
	var error_1 = require_error();
	var entry_2 = require_entry();
	var Provider = class {
		constructor(_settings) {
			this._settings = _settings;
			this.errorFilter = new error_1.default(this._settings);
			this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
			this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
			this.entryTransformer = new entry_2.default(this._settings);
		}
		_getRootDirectory(task) {
			return path$2.resolve(this._settings.cwd, task.base);
		}
		_getReaderOptions(task) {
			const basePath = task.base === "." ? "" : task.base;
			return {
				basePath,
				pathSegmentSeparator: "/",
				concurrency: this._settings.concurrency,
				deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
				entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
				errorFilter: this.errorFilter.getFilter(),
				followSymbolicLinks: this._settings.followSymbolicLinks,
				fs: this._settings.fs,
				stats: this._settings.stats,
				throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
				transform: this.entryTransformer.getTransformer()
			};
		}
		_getMicromatchOptions() {
			return {
				dot: this._settings.dot,
				matchBase: this._settings.baseNameMatch,
				nobrace: !this._settings.braceExpansion,
				nocase: !this._settings.caseSensitiveMatch,
				noext: !this._settings.extglob,
				noglobstar: !this._settings.globstar,
				posix: true,
				strictSlashes: false
			};
		}
	};
	exports.default = Provider;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/async.js
var require_async = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var async_1 = require_async$1();
	var provider_1 = require_provider();
	var ProviderAsync = class extends provider_1.default {
		constructor() {
			super(...arguments);
			this._reader = new async_1.default(this._settings);
		}
		async read(task) {
			const root = this._getRootDirectory(task);
			const options = this._getReaderOptions(task);
			return (await this.api(root, task, options)).map((entry) => options.transform(entry));
		}
		api(root, task, options) {
			if (task.dynamic) return this._reader.dynamic(root, options);
			return this._reader.static(task.patterns, options);
		}
	};
	exports.default = ProviderAsync;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/stream.js
var require_stream = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var stream_1 = __require("stream");
	var stream_2 = require_stream$1();
	var provider_1 = require_provider();
	var ProviderStream = class extends provider_1.default {
		constructor() {
			super(...arguments);
			this._reader = new stream_2.default(this._settings);
		}
		read(task) {
			const root = this._getRootDirectory(task);
			const options = this._getReaderOptions(task);
			const source = this.api(root, task, options);
			const destination = new stream_1.Readable({
				objectMode: true,
				read: () => {}
			});
			source.once("error", (error) => destination.emit("error", error)).on("data", (entry) => destination.emit("data", options.transform(entry))).once("end", () => destination.emit("end"));
			destination.once("close", () => source.destroy());
			return destination;
		}
		api(root, task, options) {
			if (task.dynamic) return this._reader.dynamic(root, options);
			return this._reader.static(task.patterns, options);
		}
	};
	exports.default = ProviderStream;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/readers/sync.js
var require_sync$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var fsStat = require_out$3();
	var fsWalk = require_out$1();
	var reader_1 = require_reader();
	var ReaderSync = class extends reader_1.default {
		constructor() {
			super(...arguments);
			this._walkSync = fsWalk.walkSync;
			this._statSync = fsStat.statSync;
		}
		dynamic(root, options) {
			return this._walkSync(root, options);
		}
		static(patterns, options) {
			const entries = [];
			for (const pattern of patterns) {
				const filepath = this._getFullEntryPath(pattern);
				const entry = this._getEntry(filepath, pattern, options);
				if (entry === null || !options.entryFilter(entry)) continue;
				entries.push(entry);
			}
			return entries;
		}
		_getEntry(filepath, pattern, options) {
			try {
				const stats = this._getStat(filepath);
				return this._makeEntry(stats, pattern);
			} catch (error) {
				if (options.errorFilter(error)) return null;
				throw error;
			}
		}
		_getStat(filepath) {
			return this._statSync(filepath, this._fsStatSettings);
		}
	};
	exports.default = ReaderSync;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/sync.js
var require_sync = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var sync_1 = require_sync$1();
	var provider_1 = require_provider();
	var ProviderSync = class extends provider_1.default {
		constructor() {
			super(...arguments);
			this._reader = new sync_1.default(this._settings);
		}
		read(task) {
			const root = this._getRootDirectory(task);
			const options = this._getReaderOptions(task);
			return this.api(root, task, options).map(options.transform);
		}
		api(root, task, options) {
			if (task.dynamic) return this._reader.dynamic(root, options);
			return this._reader.static(task.patterns, options);
		}
	};
	exports.default = ProviderSync;
}));
//#endregion
//#region node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/settings.js
var require_settings = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
	var fs$2 = __require("fs");
	var os = __require("os");
	/**
	* The `os.cpus` method can return zero. We expect the number of cores to be greater than zero.
	* https://github.com/nodejs/node/blob/7faeddf23a98c53896f8b574a6e66589e8fb1eb8/lib/os.js#L106-L107
	*/
	var CPU_COUNT = Math.max(os.cpus().length, 1);
	exports.DEFAULT_FILE_SYSTEM_ADAPTER = {
		lstat: fs$2.lstat,
		lstatSync: fs$2.lstatSync,
		stat: fs$2.stat,
		statSync: fs$2.statSync,
		readdir: fs$2.readdir,
		readdirSync: fs$2.readdirSync
	};
	var Settings = class {
		constructor(_options = {}) {
			this._options = _options;
			this.absolute = this._getValue(this._options.absolute, false);
			this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
			this.braceExpansion = this._getValue(this._options.braceExpansion, true);
			this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
			this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
			this.cwd = this._getValue(this._options.cwd, process.cwd());
			this.deep = this._getValue(this._options.deep, Infinity);
			this.dot = this._getValue(this._options.dot, false);
			this.extglob = this._getValue(this._options.extglob, true);
			this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
			this.fs = this._getFileSystemMethods(this._options.fs);
			this.globstar = this._getValue(this._options.globstar, true);
			this.ignore = this._getValue(this._options.ignore, []);
			this.markDirectories = this._getValue(this._options.markDirectories, false);
			this.objectMode = this._getValue(this._options.objectMode, false);
			this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
			this.onlyFiles = this._getValue(this._options.onlyFiles, true);
			this.stats = this._getValue(this._options.stats, false);
			this.suppressErrors = this._getValue(this._options.suppressErrors, false);
			this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
			this.unique = this._getValue(this._options.unique, true);
			if (this.onlyDirectories) this.onlyFiles = false;
			if (this.stats) this.objectMode = true;
			this.ignore = [].concat(this.ignore);
		}
		_getValue(option, value) {
			return option === void 0 ? value : option;
		}
		_getFileSystemMethods(methods = {}) {
			return Object.assign(Object.assign({}, exports.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
		}
	};
	exports.default = Settings;
}));
//#endregion
//#region src/helper/copy.ts
var import_out = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var taskManager = require_tasks();
	var async_1 = require_async();
	var stream_1 = require_stream();
	var sync_1 = require_sync();
	var settings_1 = require_settings();
	var utils = require_utils$1();
	async function FastGlob(source, options) {
		assertPatternsInput(source);
		const works = getWorks(source, async_1.default, options);
		const result = await Promise.all(works);
		return utils.array.flatten(result);
	}
	(function(FastGlob) {
		FastGlob.glob = FastGlob;
		FastGlob.globSync = sync;
		FastGlob.globStream = stream;
		FastGlob.async = FastGlob;
		function sync(source, options) {
			assertPatternsInput(source);
			const works = getWorks(source, sync_1.default, options);
			return utils.array.flatten(works);
		}
		FastGlob.sync = sync;
		function stream(source, options) {
			assertPatternsInput(source);
			const works = getWorks(source, stream_1.default, options);
			/**
			* The stream returned by the provider cannot work with an asynchronous iterator.
			* To support asynchronous iterators, regardless of the number of tasks, we always multiplex streams.
			* This affects performance (+25%). I don't see best solution right now.
			*/
			return utils.stream.merge(works);
		}
		FastGlob.stream = stream;
		function generateTasks(source, options) {
			assertPatternsInput(source);
			const patterns = [].concat(source);
			const settings = new settings_1.default(options);
			return taskManager.generate(patterns, settings);
		}
		FastGlob.generateTasks = generateTasks;
		function isDynamicPattern(source, options) {
			assertPatternsInput(source);
			const settings = new settings_1.default(options);
			return utils.pattern.isDynamicPattern(source, settings);
		}
		FastGlob.isDynamicPattern = isDynamicPattern;
		function escapePath(source) {
			assertPatternsInput(source);
			return utils.path.escape(source);
		}
		FastGlob.escapePath = escapePath;
		function convertPathToPattern(source) {
			assertPatternsInput(source);
			return utils.path.convertPathToPattern(source);
		}
		FastGlob.convertPathToPattern = convertPathToPattern;
		(function(posix) {
			function escapePath(source) {
				assertPatternsInput(source);
				return utils.path.escapePosixPath(source);
			}
			posix.escapePath = escapePath;
			function convertPathToPattern(source) {
				assertPatternsInput(source);
				return utils.path.convertPosixPathToPattern(source);
			}
			posix.convertPathToPattern = convertPathToPattern;
		})(FastGlob.posix || (FastGlob.posix = {}));
		(function(win32) {
			function escapePath(source) {
				assertPatternsInput(source);
				return utils.path.escapeWindowsPath(source);
			}
			win32.escapePath = escapePath;
			function convertPathToPattern(source) {
				assertPatternsInput(source);
				return utils.path.convertWindowsPathToPattern(source);
			}
			win32.convertPathToPattern = convertPathToPattern;
		})(FastGlob.win32 || (FastGlob.win32 = {}));
	})(FastGlob || (FastGlob = {}));
	function getWorks(source, _Provider, options) {
		const patterns = [].concat(source);
		const settings = new settings_1.default(options);
		const tasks = taskManager.generate(patterns, settings);
		const provider = new _Provider(settings);
		return tasks.map(provider.read, provider);
	}
	function assertPatternsInput(input) {
		if (![].concat(input).every((item) => utils.string.isString(item) && !utils.string.isEmpty(item))) throw new TypeError("Patterns must be a string (non empty) or an array of strings");
	}
	module.exports = FastGlob;
})))();
var identity = (x) => x;
async function copy(src, dest, { cwd, rename = identity, parents = true }) {
	const { createNg, createOk, checkPromiseReturn } = resultUtility;
	const sources = typeof src === "string" ? [src] : src;
	if (sources.length === 0 || dest === "") return createNg(/* @__PURE__ */ new Error("src or dest is empty"));
	const sourceFiles = await checkPromiseReturn({
		fn: () => (0, import_out.async)(sources, {
			cwd,
			dot: true,
			absolute: false,
			stats: false,
			onlyFiles: true
		}),
		err: () => /* @__PURE__ */ new Error("Failed to glob source files")
	});
	if (sourceFiles.isErr) return sourceFiles;
	const destRelativeToCwd = cwd ? resolve(cwd, dest) : dest;
	for (const p of sourceFiles.value) {
		const dirName = dirname(p);
		const baseName = rename(basename(p));
		const from = cwd ? resolve(cwd, p) : p;
		const to = parents ? join(destRelativeToCwd, dirName, baseName) : join(destRelativeToCwd, baseName);
		await mkdir(dirname(to), { recursive: true });
		await copyFile(from, to);
	}
	return createOk(() => {});
}
//#endregion
//#region src/template/common/typescript-template-install.ts
async function typescriptTemplateInstall({ root, appName, material }) {
	const { createNg, createOk, checkPromiseVoid } = resultUtility;
	const { path: templatePath } = material;
	const copySource = ["**/*"];
	mkdirSync(root, { recursive: true });
	if (!isFolderEmpty(root, appName)) return createNg(/* @__PURE__ */ new Error(`The directory ${appName} is not empty. Please choose a different project name or remove the existing directory.\n`));
	console.log(`Creating a new React app in ${(0, import_picocolors_browser.green)(root)}.`);
	console.log();
	process.chdir(root);
	const res = await copy(copySource, root, {
		parents: true,
		cwd: templatePath,
		rename: (name) => {
			switch (name) {
				case "gitignore": return `.${name}`;
				case "env": return `.${name}`;
				case "package-template.json": return "package.json";
				case "README.sample.md": return "README.md";
				default: return name;
			}
		}
	});
	if (res.isErr) return res;
	const pkgPath = path.join(root, "package.json");
	const exists = await checkPromiseVoid({
		fn: async () => {
			await fs$1.stat(pkgPath);
		},
		err: (e) => {
			if (e instanceof Error) return /* @__PURE__ */ new Error(`Failed to access package.json: ${e.message}`);
			return /* @__PURE__ */ new Error("Failed to access package.json: Unknown error");
		}
	});
	if (exists.isErr) return exists;
	const raw = await fs$1.readFile(pkgPath, "utf8");
	const pkg = JSON.parse(raw || "{}");
	if (!appName || typeof appName !== "string") return createNg(/* @__PURE__ */ new Error("Invalid app name"));
	pkg.name = appName;
	pkg.version = "0.1.0";
	const writeResult = await checkPromiseVoid({
		fn: async () => {
			await fs$1.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
		},
		err: () => /* @__PURE__ */ new Error(`Failed to update package.json name`)
	});
	if (writeResult.isErr) return writeResult;
	return createOk(noop);
}
//#endregion
//#region src/template/react/react-installer.ts
async function reactInstaller({ appPath, material }) {
	const { createNg } = resultUtility;
	const { styleSheet } = material;
	const root = resolve(appPath);
	const appName = basename(appPath);
	if (styleSheet.isNone) return createNg(/* @__PURE__ */ new Error("CSS option is required"));
	return await typescriptTemplateInstall({
		root,
		appName,
		material
	});
}
//#endregion
//#region src/template/vue/vue-static.ts
var vueFramework = ["vue-router", "nuxt"];
var vueCSSes = ["vanilla-extract", "scoped-css"];
//#endregion
//#region src/template/vue/vue-is.ts
function isVueFramework(value) {
	return typeof value === "string" && vueFramework.includes(value);
}
function isVueCss(value) {
	return typeof value === "string" && vueCSSes.includes(value);
}
//#endregion
//#region src/command/css/css-core.ts
async function cssCommand({ optionCss, isCss, csses }) {
	const { optionConversion } = optionUtility;
	const { createOk, createNg, checkPromiseReturn } = resultUtility;
	const { onPromptState } = await commanderCore;
	if (optionCss.isSome && isCss(optionCss.value)) return createOk(optionCss.value);
	const response = await checkPromiseReturn({
		fn: async () => await (0, import_prompts.default)({
			onState: onPromptState,
			type: "select",
			name: "css",
			message: "Select a CSS framework for your project:",
			choices: csses,
			initial: 0
		}),
		err: (e) => {
			if (e instanceof Error) return /* @__PURE__ */ new Error(`Prompt failed: ${e.message}`);
			return /* @__PURE__ */ new Error("Prompt failed: Unknown error");
		}
	});
	if (response.isErr) return response;
	const css = optionConversion(response.value.css);
	if (css.isSome && isCss(css.value)) return createOk(css.value);
	return createNg(/* @__PURE__ */ new Error("CSS selection is invalid"));
}
//#endregion
//#region src/command/vue/vue-css.ts
async function vueCssCommander(optionVueCss) {
	return await cssCommand({
		optionCss: optionVueCss,
		isCss: isVueCss,
		csses: [{
			title: "scoped-css",
			value: "scoped-css"
		}, {
			title: "vanilla-extract",
			value: "vanilla-extract"
		}]
	});
}
//#endregion
//#region src/command/vue/vue-framework.ts
async function vueFrameworkCommand(optionVueFramework) {
	const { onPromptState } = await commanderCore;
	const { createOk, checkPromiseReturn, createNg } = resultUtility;
	if (optionVueFramework.isSome && isVueFramework(optionVueFramework.value)) return createOk(optionVueFramework.value);
	const response = await checkPromiseReturn({
		fn: async () => await (0, import_prompts.default)({
			onState: onPromptState,
			type: "select",
			name: "framework",
			message: `Select a framework for your project:`,
			choices: [{
				title: "Vue router",
				value: "vue-router"
			}, {
				title: "Nuxt.js",
				value: "nuxt"
			}],
			initial: 0
		}),
		err: (e) => {
			if (e instanceof Error) return /* @__PURE__ */ new Error(`Prompt failed: ${e.message}`);
			return /* @__PURE__ */ new Error("Prompt failed: Unknown error");
		}
	});
	if (response.isErr) return response;
	const framework = response.value.framework;
	if (isVueFramework(framework)) return createOk(framework);
	return createNg(/* @__PURE__ */ new Error("Framework selection is invalid"));
}
//#endregion
//#region src/utils/found-file.ts
function foundFolder(paths) {
	const { createNg, createOk } = resultUtility;
	for (const p of paths) if (fs.existsSync(p)) return createOk(p);
	return createNg(/* @__PURE__ */ new Error(`Not found folder: ${paths.join(", ")}`));
}
//#endregion
//#region src/template/vue/vue-setting.ts
async function vueCli() {
	const { optionCss, optionVueFramework } = await commanderCore;
	const { createSome } = optionUtility;
	const { createOk } = resultUtility;
	const cliDir = path$1.dirname(fileURLToPath(import.meta.url));
	const frameworkResult = await vueFrameworkCommand(optionVueFramework);
	if (frameworkResult.isErr) return frameworkResult;
	const cssResult = await vueCssCommander(optionCss);
	if (cssResult.isErr) return cssResult;
	const resultPath = foundFolder([path$1.join(cliDir, "template", "vue", frameworkResult.value, cssResult.value)]);
	if (resultPath.isErr) return resultPath;
	return createOk({
		path: resultPath.value,
		styleSheet: createSome(cssResult.value)
	});
}
//#endregion
//#region src/template/vue/vue-install.ts
async function vueInstaller({ appPath, material }) {
	const { createNg } = resultUtility;
	const { styleSheet } = material;
	if (styleSheet.isNone) return createNg(/* @__PURE__ */ new Error("CSS option is required"));
	return await typescriptTemplateInstall({
		root: resolve(appPath),
		appName: basename(appPath),
		material
	});
}
//#endregion
//#region src/command/react/react-css.ts
async function cssReactCommand(optionReactCss) {
	return await cssCommand({
		optionCss: optionReactCss,
		isCss: isReactCss,
		csses: [{
			title: "tailwindCSS",
			value: "tailwind"
		}, {
			title: "vanilla-extract ",
			value: "vanilla-extract"
		}]
	});
}
//#endregion
//#region src/command/react/react-framework.ts
async function frameworkCommand(optionFramework) {
	const { createNg, createOk, checkPromiseReturn } = resultUtility;
	const { onPromptState } = await commanderCore;
	if (optionFramework.isSome && isReactFramework(optionFramework.value)) return createOk(optionFramework.value);
	const response = await checkPromiseReturn({
		fn: async () => await (0, import_prompts.default)({
			onState: onPromptState,
			type: "select",
			name: "framework",
			message: `Select a framework for your project:`,
			choices: [
				{
					title: "TanStack Router",
					value: "tanstack-router"
				},
				{
					title: "Next.js (App Router)",
					value: "next/app"
				},
				{
					title: "Next.js (Pages Router)",
					value: "next/pages"
				}
			],
			initial: 0
		}),
		err: (e) => {
			if (e instanceof Error) return /* @__PURE__ */ new Error(`Prompt failed: ${e.message}`);
			return /* @__PURE__ */ new Error("Prompt failed: Unknown error");
		}
	});
	if (response.isErr) return response;
	const framework = response.value.framework;
	if (isReactFramework(framework)) return createOk(framework);
	return createNg(/* @__PURE__ */ new Error("Framework selection is invalid"));
}
//#endregion
//#region src/template/react/react-setting.ts
async function reactCli() {
	const { optionReactFramework, optionCss } = await commanderCore;
	const { createOk } = resultUtility;
	const { createSome } = optionUtility;
	const cliDir = path$1.dirname(fileURLToPath(import.meta.url));
	const frameworResult = await frameworkCommand(optionReactFramework);
	if (frameworResult.isErr) return frameworResult;
	const cssResult = await cssReactCommand(optionCss);
	if (cssResult.isErr) return cssResult;
	const resultPath = foundFolder([path$1.join(cliDir, "template", "react", frameworResult.value, cssResult.value)]);
	if (resultPath.isErr) return resultPath;
	return createOk({
		path: resultPath.value,
		styleSheet: createSome(cssResult.value)
	});
}
//#endregion
//#region src/template/core/core.ts
async function createApp({ appPath, tech }) {
	switch (tech) {
		case "react": {
			const materialResult = await reactCli();
			if (materialResult.isErr) return materialResult;
			return await reactInstaller({
				appPath,
				material: materialResult.value
			});
		}
		case "vue": {
			const materialResult = await vueCli();
			if (materialResult.isErr) return materialResult;
			return await vueInstaller({
				appPath,
				material: materialResult.value
			});
		}
	}
}
//#endregion
//#region src/then.ts
function reactCallback() {
	console.log(`Package install: \n\n ex) npm install`);
	console.log(`Application launch: \n\n ex) npm run dev`);
}
//#endregion
//#region src/main.ts
var handleSigTerm = () => process.exit(0);
process.on("SIGTERM", handleSigTerm);
process.on("SIGINT", handleSigTerm);
async function run() {
	const { optionName, optionTechStack } = await commanderCore;
	const projectName = await nameCommand(optionName);
	if (projectName.isErr) {
		cliErrorLog(projectName.err);
		process.exit(1);
	}
	const appPath = resolve(projectName.value);
	const appName = basename(appPath);
	const techStack = await techStackCommand(optionTechStack);
	if (techStack.isErr) {
		cliErrorLog(techStack.err);
		process.exit(1);
	}
	const validation = validateNpmName(appName);
	if (!validation.valid) {
		console.error(`Could not create a project called ${appName} because of npm naming restrictions:\n\n- ${validation.problems?.join("\n- ")}\n`);
		process.exit(1);
	}
	if (existsSync(appName)) {
		console.error((0, import_picocolors_browser.red)(`The directory ${appName} already exists. Please choose a different project name or remove the existing directory.\n`));
		process.exit(1);
	}
	const installResult = await createApp({
		appPath,
		tech: techStack.value
	});
	if (installResult.isErr) {
		cliErrorLog(installResult.err);
		process.exit(1);
	}
	return {
		name: projectName.value,
		tech: techStack.value
	};
}
function techInstallInfo(techStack) {
	switch (techStack) {
		case "react": reactCallback();
	}
}
function notify(projectMaterial) {
	console.log("cd " + projectMaterial.name);
	techInstallInfo(projectMaterial.tech);
	console.log();
	console.log((0, import_picocolors_browser.bold)(`${(0, import_picocolors_browser.green)("Happy hacking!")}`));
	process.exit(0);
}
function errorExit() {
	console.error((0, import_picocolors_browser.red)("The operation was cancelled."));
	process.exit(1);
}
//#endregion
//#region src/index.ts
run().then((path) => notify(path)).catch(() => errorExit());
//#endregion
