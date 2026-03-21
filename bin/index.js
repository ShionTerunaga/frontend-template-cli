#!/usr/bin/env node
/******/ (() => {
    // webpackBootstrap
    /******/ var __webpack_modules__ = {
        /***/ 7004: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.createFileSystemAdapter = exports.FILE_SYSTEM_ADAPTER =
                void 0;
            const fs = __nccwpck_require__(9896);
            exports.FILE_SYSTEM_ADAPTER = {
                lstat: fs.lstat,
                stat: fs.stat,
                lstatSync: fs.lstatSync,
                statSync: fs.statSync,
                readdir: fs.readdir,
                readdirSync: fs.readdirSync
            };
            function createFileSystemAdapter(fsMethods) {
                if (fsMethods === undefined) {
                    return exports.FILE_SYSTEM_ADAPTER;
                }
                return Object.assign(
                    Object.assign({}, exports.FILE_SYSTEM_ADAPTER),
                    fsMethods
                );
            }
            exports.createFileSystemAdapter = createFileSystemAdapter;

            /***/
        },

        /***/ 75: /***/ (__unused_webpack_module, exports) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES = void 0;
            const NODE_PROCESS_VERSION_PARTS = process.versions.node.split(".");
            if (
                NODE_PROCESS_VERSION_PARTS[0] === undefined ||
                NODE_PROCESS_VERSION_PARTS[1] === undefined
            ) {
                throw new Error(
                    `Unexpected behavior. The 'process.versions.node' variable has invalid value: ${process.versions.node}`
                );
            }
            const MAJOR_VERSION = Number.parseInt(
                NODE_PROCESS_VERSION_PARTS[0],
                10
            );
            const MINOR_VERSION = Number.parseInt(
                NODE_PROCESS_VERSION_PARTS[1],
                10
            );
            const SUPPORTED_MAJOR_VERSION = 10;
            const SUPPORTED_MINOR_VERSION = 10;
            const IS_MATCHED_BY_MAJOR = MAJOR_VERSION > SUPPORTED_MAJOR_VERSION;
            const IS_MATCHED_BY_MAJOR_AND_MINOR =
                MAJOR_VERSION === SUPPORTED_MAJOR_VERSION &&
                MINOR_VERSION >= SUPPORTED_MINOR_VERSION;
            /**
             * IS `true` for Node.js 10.10 and greater.
             */
            exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES =
                IS_MATCHED_BY_MAJOR || IS_MATCHED_BY_MAJOR_AND_MINOR;

            /***/
        },

        /***/ 3242: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.Settings = exports.scandirSync = exports.scandir = void 0;
            const async = __nccwpck_require__(3879);
            const sync = __nccwpck_require__(124);
            const settings_1 = __nccwpck_require__(4489);
            exports.Settings = settings_1.default;
            function scandir(path, optionsOrSettingsOrCallback, callback) {
                if (typeof optionsOrSettingsOrCallback === "function") {
                    async.read(
                        path,
                        getSettings(),
                        optionsOrSettingsOrCallback
                    );
                    return;
                }
                async.read(
                    path,
                    getSettings(optionsOrSettingsOrCallback),
                    callback
                );
            }
            exports.scandir = scandir;
            function scandirSync(path, optionsOrSettings) {
                const settings = getSettings(optionsOrSettings);
                return sync.read(path, settings);
            }
            exports.scandirSync = scandirSync;
            function getSettings(settingsOrOptions = {}) {
                if (settingsOrOptions instanceof settings_1.default) {
                    return settingsOrOptions;
                }
                return new settings_1.default(settingsOrOptions);
            }

            /***/
        },

        /***/ 3879: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.readdir =
                exports.readdirWithFileTypes =
                exports.read =
                    void 0;
            const fsStat = __nccwpck_require__(1099);
            const rpl = __nccwpck_require__(9496);
            const constants_1 = __nccwpck_require__(75);
            const utils = __nccwpck_require__(5396);
            const common = __nccwpck_require__(4590);
            function read(directory, settings, callback) {
                if (
                    !settings.stats &&
                    constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES
                ) {
                    readdirWithFileTypes(directory, settings, callback);
                    return;
                }
                readdir(directory, settings, callback);
            }
            exports.read = read;
            function readdirWithFileTypes(directory, settings, callback) {
                settings.fs.readdir(
                    directory,
                    { withFileTypes: true },
                    (readdirError, dirents) => {
                        if (readdirError !== null) {
                            callFailureCallback(callback, readdirError);
                            return;
                        }
                        const entries = dirents.map((dirent) => ({
                            dirent,
                            name: dirent.name,
                            path: common.joinPathSegments(
                                directory,
                                dirent.name,
                                settings.pathSegmentSeparator
                            )
                        }));
                        if (!settings.followSymbolicLinks) {
                            callSuccessCallback(callback, entries);
                            return;
                        }
                        const tasks = entries.map((entry) =>
                            makeRplTaskEntry(entry, settings)
                        );
                        rpl(tasks, (rplError, rplEntries) => {
                            if (rplError !== null) {
                                callFailureCallback(callback, rplError);
                                return;
                            }
                            callSuccessCallback(callback, rplEntries);
                        });
                    }
                );
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
                        entry.dirent = utils.fs.createDirentFromStats(
                            entry.name,
                            stats
                        );
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
                    const tasks = names.map((name) => {
                        const path = common.joinPathSegments(
                            directory,
                            name,
                            settings.pathSegmentSeparator
                        );
                        return (done) => {
                            fsStat.stat(
                                path,
                                settings.fsStatSettings,
                                (error, stats) => {
                                    if (error !== null) {
                                        done(error);
                                        return;
                                    }
                                    const entry = {
                                        name,
                                        path,
                                        dirent: utils.fs.createDirentFromStats(
                                            name,
                                            stats
                                        )
                                    };
                                    if (settings.stats) {
                                        entry.stats = stats;
                                    }
                                    done(null, entry);
                                }
                            );
                        };
                    });
                    rpl(tasks, (rplError, entries) => {
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

            /***/
        },

        /***/ 4590: /***/ (__unused_webpack_module, exports) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.joinPathSegments = void 0;
            function joinPathSegments(a, b, separator) {
                /**
                 * The correct handling of cases when the first segment is a root (`/`, `C:/`) or UNC path (`//?/C:/`).
                 */
                if (a.endsWith(separator)) {
                    return a + b;
                }
                return a + separator + b;
            }
            exports.joinPathSegments = joinPathSegments;

            /***/
        },

        /***/ 124: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.readdir =
                exports.readdirWithFileTypes =
                exports.read =
                    void 0;
            const fsStat = __nccwpck_require__(1099);
            const constants_1 = __nccwpck_require__(75);
            const utils = __nccwpck_require__(5396);
            const common = __nccwpck_require__(4590);
            function read(directory, settings) {
                if (
                    !settings.stats &&
                    constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES
                ) {
                    return readdirWithFileTypes(directory, settings);
                }
                return readdir(directory, settings);
            }
            exports.read = read;
            function readdirWithFileTypes(directory, settings) {
                const dirents = settings.fs.readdirSync(directory, {
                    withFileTypes: true
                });
                return dirents.map((dirent) => {
                    const entry = {
                        dirent,
                        name: dirent.name,
                        path: common.joinPathSegments(
                            directory,
                            dirent.name,
                            settings.pathSegmentSeparator
                        )
                    };
                    if (
                        entry.dirent.isSymbolicLink() &&
                        settings.followSymbolicLinks
                    ) {
                        try {
                            const stats = settings.fs.statSync(entry.path);
                            entry.dirent = utils.fs.createDirentFromStats(
                                entry.name,
                                stats
                            );
                        } catch (error) {
                            if (settings.throwErrorOnBrokenSymbolicLink) {
                                throw error;
                            }
                        }
                    }
                    return entry;
                });
            }
            exports.readdirWithFileTypes = readdirWithFileTypes;
            function readdir(directory, settings) {
                const names = settings.fs.readdirSync(directory);
                return names.map((name) => {
                    const entryPath = common.joinPathSegments(
                        directory,
                        name,
                        settings.pathSegmentSeparator
                    );
                    const stats = fsStat.statSync(
                        entryPath,
                        settings.fsStatSettings
                    );
                    const entry = {
                        name,
                        path: entryPath,
                        dirent: utils.fs.createDirentFromStats(name, stats)
                    };
                    if (settings.stats) {
                        entry.stats = stats;
                    }
                    return entry;
                });
            }
            exports.readdir = readdir;

            /***/
        },

        /***/ 4489: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const path = __nccwpck_require__(6928);
            const fsStat = __nccwpck_require__(1099);
            const fs = __nccwpck_require__(7004);
            class Settings {
                constructor(_options = {}) {
                    this._options = _options;
                    this.followSymbolicLinks = this._getValue(
                        this._options.followSymbolicLinks,
                        false
                    );
                    this.fs = fs.createFileSystemAdapter(this._options.fs);
                    this.pathSegmentSeparator = this._getValue(
                        this._options.pathSegmentSeparator,
                        path.sep
                    );
                    this.stats = this._getValue(this._options.stats, false);
                    this.throwErrorOnBrokenSymbolicLink = this._getValue(
                        this._options.throwErrorOnBrokenSymbolicLink,
                        true
                    );
                    this.fsStatSettings = new fsStat.Settings({
                        followSymbolicLink: this.followSymbolicLinks,
                        fs: this.fs,
                        throwErrorOnBrokenSymbolicLink:
                            this.throwErrorOnBrokenSymbolicLink
                    });
                }
                _getValue(option, value) {
                    return option !== null && option !== void 0
                        ? option
                        : value;
                }
            }
            exports["default"] = Settings;

            /***/
        },

        /***/ 1149: /***/ (__unused_webpack_module, exports) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.createDirentFromStats = void 0;
            class DirentFromStats {
                constructor(name, stats) {
                    this.name = name;
                    this.isBlockDevice = stats.isBlockDevice.bind(stats);
                    this.isCharacterDevice =
                        stats.isCharacterDevice.bind(stats);
                    this.isDirectory = stats.isDirectory.bind(stats);
                    this.isFIFO = stats.isFIFO.bind(stats);
                    this.isFile = stats.isFile.bind(stats);
                    this.isSocket = stats.isSocket.bind(stats);
                    this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
                }
            }
            function createDirentFromStats(name, stats) {
                return new DirentFromStats(name, stats);
            }
            exports.createDirentFromStats = createDirentFromStats;

            /***/
        },

        /***/ 5396: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.fs = void 0;
            const fs = __nccwpck_require__(1149);
            exports.fs = fs;

            /***/
        },

        /***/ 2597: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.createFileSystemAdapter = exports.FILE_SYSTEM_ADAPTER =
                void 0;
            const fs = __nccwpck_require__(9896);
            exports.FILE_SYSTEM_ADAPTER = {
                lstat: fs.lstat,
                stat: fs.stat,
                lstatSync: fs.lstatSync,
                statSync: fs.statSync
            };
            function createFileSystemAdapter(fsMethods) {
                if (fsMethods === undefined) {
                    return exports.FILE_SYSTEM_ADAPTER;
                }
                return Object.assign(
                    Object.assign({}, exports.FILE_SYSTEM_ADAPTER),
                    fsMethods
                );
            }
            exports.createFileSystemAdapter = createFileSystemAdapter;

            /***/
        },

        /***/ 1099: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.statSync = exports.stat = exports.Settings = void 0;
            const async = __nccwpck_require__(6426);
            const sync = __nccwpck_require__(527);
            const settings_1 = __nccwpck_require__(6910);
            exports.Settings = settings_1.default;
            function stat(path, optionsOrSettingsOrCallback, callback) {
                if (typeof optionsOrSettingsOrCallback === "function") {
                    async.read(
                        path,
                        getSettings(),
                        optionsOrSettingsOrCallback
                    );
                    return;
                }
                async.read(
                    path,
                    getSettings(optionsOrSettingsOrCallback),
                    callback
                );
            }
            exports.stat = stat;
            function statSync(path, optionsOrSettings) {
                const settings = getSettings(optionsOrSettings);
                return sync.read(path, settings);
            }
            exports.statSync = statSync;
            function getSettings(settingsOrOptions = {}) {
                if (settingsOrOptions instanceof settings_1.default) {
                    return settingsOrOptions;
                }
                return new settings_1.default(settingsOrOptions);
            }

            /***/
        },

        /***/ 6426: /***/ (__unused_webpack_module, exports) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.read = void 0;
            function read(path, settings, callback) {
                settings.fs.lstat(path, (lstatError, lstat) => {
                    if (lstatError !== null) {
                        callFailureCallback(callback, lstatError);
                        return;
                    }
                    if (
                        !lstat.isSymbolicLink() ||
                        !settings.followSymbolicLink
                    ) {
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
                        if (settings.markSymbolicLink) {
                            stat.isSymbolicLink = () => true;
                        }
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

            /***/
        },

        /***/ 527: /***/ (__unused_webpack_module, exports) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.read = void 0;
            function read(path, settings) {
                const lstat = settings.fs.lstatSync(path);
                if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
                    return lstat;
                }
                try {
                    const stat = settings.fs.statSync(path);
                    if (settings.markSymbolicLink) {
                        stat.isSymbolicLink = () => true;
                    }
                    return stat;
                } catch (error) {
                    if (!settings.throwErrorOnBrokenSymbolicLink) {
                        return lstat;
                    }
                    throw error;
                }
            }
            exports.read = read;

            /***/
        },

        /***/ 6910: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const fs = __nccwpck_require__(2597);
            class Settings {
                constructor(_options = {}) {
                    this._options = _options;
                    this.followSymbolicLink = this._getValue(
                        this._options.followSymbolicLink,
                        true
                    );
                    this.fs = fs.createFileSystemAdapter(this._options.fs);
                    this.markSymbolicLink = this._getValue(
                        this._options.markSymbolicLink,
                        false
                    );
                    this.throwErrorOnBrokenSymbolicLink = this._getValue(
                        this._options.throwErrorOnBrokenSymbolicLink,
                        true
                    );
                }
                _getValue(option, value) {
                    return option !== null && option !== void 0
                        ? option
                        : value;
                }
            }
            exports["default"] = Settings;

            /***/
        },

        /***/ 9983: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.Settings =
                exports.walkStream =
                exports.walkSync =
                exports.walk =
                    void 0;
            const async_1 = __nccwpck_require__(9254);
            const stream_1 = __nccwpck_require__(2472);
            const sync_1 = __nccwpck_require__(4195);
            const settings_1 = __nccwpck_require__(746);
            exports.Settings = settings_1.default;
            function walk(directory, optionsOrSettingsOrCallback, callback) {
                if (typeof optionsOrSettingsOrCallback === "function") {
                    new async_1.default(directory, getSettings()).read(
                        optionsOrSettingsOrCallback
                    );
                    return;
                }
                new async_1.default(
                    directory,
                    getSettings(optionsOrSettingsOrCallback)
                ).read(callback);
            }
            exports.walk = walk;
            function walkSync(directory, optionsOrSettings) {
                const settings = getSettings(optionsOrSettings);
                const provider = new sync_1.default(directory, settings);
                return provider.read();
            }
            exports.walkSync = walkSync;
            function walkStream(directory, optionsOrSettings) {
                const settings = getSettings(optionsOrSettings);
                const provider = new stream_1.default(directory, settings);
                return provider.read();
            }
            exports.walkStream = walkStream;
            function getSettings(settingsOrOptions = {}) {
                if (settingsOrOptions instanceof settings_1.default) {
                    return settingsOrOptions;
                }
                return new settings_1.default(settingsOrOptions);
            }

            /***/
        },

        /***/ 9254: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const async_1 = __nccwpck_require__(8224);
            class AsyncProvider {
                constructor(_root, _settings) {
                    this._root = _root;
                    this._settings = _settings;
                    this._reader = new async_1.default(
                        this._root,
                        this._settings
                    );
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
            }
            exports["default"] = AsyncProvider;
            function callFailureCallback(callback, error) {
                callback(error);
            }
            function callSuccessCallback(callback, entries) {
                callback(null, entries);
            }

            /***/
        },

        /***/ 2472: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const stream_1 = __nccwpck_require__(2203);
            const async_1 = __nccwpck_require__(8224);
            class StreamProvider {
                constructor(_root, _settings) {
                    this._root = _root;
                    this._settings = _settings;
                    this._reader = new async_1.default(
                        this._root,
                        this._settings
                    );
                    this._stream = new stream_1.Readable({
                        objectMode: true,
                        read: () => {},
                        destroy: () => {
                            if (!this._reader.isDestroyed) {
                                this._reader.destroy();
                            }
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
            }
            exports["default"] = StreamProvider;

            /***/
        },

        /***/ 4195: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const sync_1 = __nccwpck_require__(1617);
            class SyncProvider {
                constructor(_root, _settings) {
                    this._root = _root;
                    this._settings = _settings;
                    this._reader = new sync_1.default(
                        this._root,
                        this._settings
                    );
                }
                read() {
                    return this._reader.read();
                }
            }
            exports["default"] = SyncProvider;

            /***/
        },

        /***/ 8224: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const events_1 = __nccwpck_require__(4434);
            const fsScandir = __nccwpck_require__(3242);
            const fastq = __nccwpck_require__(8713);
            const common = __nccwpck_require__(8447);
            const reader_1 = __nccwpck_require__(5509);
            class AsyncReader extends reader_1.default {
                constructor(_root, _settings) {
                    super(_root, _settings);
                    this._settings = _settings;
                    this._scandir = fsScandir.scandir;
                    this._emitter = new events_1.EventEmitter();
                    this._queue = fastq(
                        this._worker.bind(this),
                        this._settings.concurrency
                    );
                    this._isFatalError = false;
                    this._isDestroyed = false;
                    this._queue.drain = () => {
                        if (!this._isFatalError) {
                            this._emitter.emit("end");
                        }
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
                    if (this._isDestroyed) {
                        throw new Error("The reader is already destroyed");
                    }
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
                    const queueItem = { directory, base };
                    this._queue.push(queueItem, (error) => {
                        if (error !== null) {
                            this._handleError(error);
                        }
                    });
                }
                _worker(item, done) {
                    this._scandir(
                        item.directory,
                        this._settings.fsScandirSettings,
                        (error, entries) => {
                            if (error !== null) {
                                done(error, undefined);
                                return;
                            }
                            for (const entry of entries) {
                                this._handleEntry(entry, item.base);
                            }
                            done(null, undefined);
                        }
                    );
                }
                _handleError(error) {
                    if (
                        this._isDestroyed ||
                        !common.isFatalError(this._settings, error)
                    ) {
                        return;
                    }
                    this._isFatalError = true;
                    this._isDestroyed = true;
                    this._emitter.emit("error", error);
                }
                _handleEntry(entry, base) {
                    if (this._isDestroyed || this._isFatalError) {
                        return;
                    }
                    const fullpath = entry.path;
                    if (base !== undefined) {
                        entry.path = common.joinPathSegments(
                            base,
                            entry.name,
                            this._settings.pathSegmentSeparator
                        );
                    }
                    if (
                        common.isAppliedFilter(
                            this._settings.entryFilter,
                            entry
                        )
                    ) {
                        this._emitEntry(entry);
                    }
                    if (
                        entry.dirent.isDirectory() &&
                        common.isAppliedFilter(this._settings.deepFilter, entry)
                    ) {
                        this._pushToQueue(
                            fullpath,
                            base === undefined ? undefined : entry.path
                        );
                    }
                }
                _emitEntry(entry) {
                    this._emitter.emit("entry", entry);
                }
            }
            exports["default"] = AsyncReader;

            /***/
        },

        /***/ 8447: /***/ (__unused_webpack_module, exports) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.joinPathSegments =
                exports.replacePathSegmentSeparator =
                exports.isAppliedFilter =
                exports.isFatalError =
                    void 0;
            function isFatalError(settings, error) {
                if (settings.errorFilter === null) {
                    return true;
                }
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
                if (a === "") {
                    return b;
                }
                /**
                 * The correct handling of cases when the first segment is a root (`/`, `C:/`) or UNC path (`//?/C:/`).
                 */
                if (a.endsWith(separator)) {
                    return a + b;
                }
                return a + separator + b;
            }
            exports.joinPathSegments = joinPathSegments;

            /***/
        },

        /***/ 5509: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const common = __nccwpck_require__(8447);
            class Reader {
                constructor(_root, _settings) {
                    this._root = _root;
                    this._settings = _settings;
                    this._root = common.replacePathSegmentSeparator(
                        _root,
                        _settings.pathSegmentSeparator
                    );
                }
            }
            exports["default"] = Reader;

            /***/
        },

        /***/ 1617: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const fsScandir = __nccwpck_require__(3242);
            const common = __nccwpck_require__(8447);
            const reader_1 = __nccwpck_require__(5509);
            class SyncReader extends reader_1.default {
                constructor() {
                    super(...arguments);
                    this._scandir = fsScandir.scandirSync;
                    this._storage = [];
                    this._queue = new Set();
                }
                read() {
                    this._pushToQueue(this._root, this._settings.basePath);
                    this._handleQueue();
                    return this._storage;
                }
                _pushToQueue(directory, base) {
                    this._queue.add({ directory, base });
                }
                _handleQueue() {
                    for (const item of this._queue.values()) {
                        this._handleDirectory(item.directory, item.base);
                    }
                }
                _handleDirectory(directory, base) {
                    try {
                        const entries = this._scandir(
                            directory,
                            this._settings.fsScandirSettings
                        );
                        for (const entry of entries) {
                            this._handleEntry(entry, base);
                        }
                    } catch (error) {
                        this._handleError(error);
                    }
                }
                _handleError(error) {
                    if (!common.isFatalError(this._settings, error)) {
                        return;
                    }
                    throw error;
                }
                _handleEntry(entry, base) {
                    const fullpath = entry.path;
                    if (base !== undefined) {
                        entry.path = common.joinPathSegments(
                            base,
                            entry.name,
                            this._settings.pathSegmentSeparator
                        );
                    }
                    if (
                        common.isAppliedFilter(
                            this._settings.entryFilter,
                            entry
                        )
                    ) {
                        this._pushToStorage(entry);
                    }
                    if (
                        entry.dirent.isDirectory() &&
                        common.isAppliedFilter(this._settings.deepFilter, entry)
                    ) {
                        this._pushToQueue(
                            fullpath,
                            base === undefined ? undefined : entry.path
                        );
                    }
                }
                _pushToStorage(entry) {
                    this._storage.push(entry);
                }
            }
            exports["default"] = SyncReader;

            /***/
        },

        /***/ 746: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const path = __nccwpck_require__(6928);
            const fsScandir = __nccwpck_require__(3242);
            class Settings {
                constructor(_options = {}) {
                    this._options = _options;
                    this.basePath = this._getValue(
                        this._options.basePath,
                        undefined
                    );
                    this.concurrency = this._getValue(
                        this._options.concurrency,
                        Number.POSITIVE_INFINITY
                    );
                    this.deepFilter = this._getValue(
                        this._options.deepFilter,
                        null
                    );
                    this.entryFilter = this._getValue(
                        this._options.entryFilter,
                        null
                    );
                    this.errorFilter = this._getValue(
                        this._options.errorFilter,
                        null
                    );
                    this.pathSegmentSeparator = this._getValue(
                        this._options.pathSegmentSeparator,
                        path.sep
                    );
                    this.fsScandirSettings = new fsScandir.Settings({
                        followSymbolicLinks: this._options.followSymbolicLinks,
                        fs: this._options.fs,
                        pathSegmentSeparator:
                            this._options.pathSegmentSeparator,
                        stats: this._options.stats,
                        throwErrorOnBrokenSymbolicLink:
                            this._options.throwErrorOnBrokenSymbolicLink
                    });
                }
                _getValue(option, value) {
                    return option !== null && option !== void 0
                        ? option
                        : value;
                }
            }
            exports["default"] = Settings;

            /***/
        },

        /***/ 3169: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const stringify = __nccwpck_require__(5120);
            const compile = __nccwpck_require__(3632);
            const expand = __nccwpck_require__(785);
            const parse = __nccwpck_require__(4894);

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

            const braces = (input, options = {}) => {
                let output = [];

                if (Array.isArray(input)) {
                    for (const pattern of input) {
                        const result = braces.create(pattern, options);
                        if (Array.isArray(result)) {
                            output.push(...result);
                        } else {
                            output.push(result);
                        }
                    }
                } else {
                    output = [].concat(braces.create(input, options));
                }

                if (
                    options &&
                    options.expand === true &&
                    options.nodupes === true
                ) {
                    output = [...new Set(output)];
                }
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
                if (typeof input === "string") {
                    return stringify(braces.parse(input, options), options);
                }
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
                if (typeof input === "string") {
                    input = braces.parse(input, options);
                }
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
                if (typeof input === "string") {
                    input = braces.parse(input, options);
                }

                let result = expand(input, options);

                // filter out empty strings if specified
                if (options.noempty === true) {
                    result = result.filter(Boolean);
                }

                // filter out duplicates if specified
                if (options.nodupes === true) {
                    result = [...new Set(result)];
                }

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
                if (input === "" || input.length < 3) {
                    return [input];
                }

                return options.expand !== true
                    ? braces.compile(input, options)
                    : braces.expand(input, options);
            };

            /**
             * Expose "braces"
             */

            module.exports = braces;

            /***/
        },

        /***/ 3632: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const fill = __nccwpck_require__(6936);
            const utils = __nccwpck_require__(5316);

            const compile = (ast, options = {}) => {
                const walk = (node, parent = {}) => {
                    const invalidBlock = utils.isInvalidBrace(parent);
                    const invalidNode =
                        node.invalid === true && options.escapeInvalid === true;
                    const invalid =
                        invalidBlock === true || invalidNode === true;
                    const prefix = options.escapeInvalid === true ? "\\" : "";
                    let output = "";

                    if (node.isOpen === true) {
                        return prefix + node.value;
                    }

                    if (node.isClose === true) {
                        console.log("node.isClose", prefix, node.value);
                        return prefix + node.value;
                    }

                    if (node.type === "open") {
                        return invalid ? prefix + node.value : "(";
                    }

                    if (node.type === "close") {
                        return invalid ? prefix + node.value : ")";
                    }

                    if (node.type === "comma") {
                        return node.prev.type === "comma"
                            ? ""
                            : invalid
                              ? node.value
                              : "|";
                    }

                    if (node.value) {
                        return node.value;
                    }

                    if (node.nodes && node.ranges > 0) {
                        const args = utils.reduce(node.nodes);
                        const range = fill(...args, {
                            ...options,
                            wrap: false,
                            toRegex: true,
                            strictZeros: true
                        });

                        if (range.length !== 0) {
                            return args.length > 1 && range.length > 1
                                ? `(${range})`
                                : range;
                        }
                    }

                    if (node.nodes) {
                        for (const child of node.nodes) {
                            output += walk(child, node);
                        }
                    }

                    return output;
                };

                return walk(ast);
            };

            module.exports = compile;

            /***/
        },

        /***/ 5728: /***/ (module) => {
            "use strict";

            module.exports = {
                MAX_LENGTH: 10000,

                // Digits
                CHAR_0: "0" /* 0 */,
                CHAR_9: "9" /* 9 */,

                // Alphabet chars.
                CHAR_UPPERCASE_A: "A" /* A */,
                CHAR_LOWERCASE_A: "a" /* a */,
                CHAR_UPPERCASE_Z: "Z" /* Z */,
                CHAR_LOWERCASE_Z: "z" /* z */,

                CHAR_LEFT_PARENTHESES: "(" /* ( */,
                CHAR_RIGHT_PARENTHESES: ")" /* ) */,

                CHAR_ASTERISK: "*" /* * */,

                // Non-alphabetic chars.
                CHAR_AMPERSAND: "&" /* & */,
                CHAR_AT: "@" /* @ */,
                CHAR_BACKSLASH: "\\" /* \ */,
                CHAR_BACKTICK: "`" /* ` */,
                CHAR_CARRIAGE_RETURN: "\r" /* \r */,
                CHAR_CIRCUMFLEX_ACCENT: "^" /* ^ */,
                CHAR_COLON: ":" /* : */,
                CHAR_COMMA: "," /* , */,
                CHAR_DOLLAR: "$" /* . */,
                CHAR_DOT: "." /* . */,
                CHAR_DOUBLE_QUOTE: '"' /* " */,
                CHAR_EQUAL: "=" /* = */,
                CHAR_EXCLAMATION_MARK: "!" /* ! */,
                CHAR_FORM_FEED: "\f" /* \f */,
                CHAR_FORWARD_SLASH: "/" /* / */,
                CHAR_HASH: "#" /* # */,
                CHAR_HYPHEN_MINUS: "-" /* - */,
                CHAR_LEFT_ANGLE_BRACKET: "<" /* < */,
                CHAR_LEFT_CURLY_BRACE: "{" /* { */,
                CHAR_LEFT_SQUARE_BRACKET: "[" /* [ */,
                CHAR_LINE_FEED: "\n" /* \n */,
                CHAR_NO_BREAK_SPACE: "\u00A0" /* \u00A0 */,
                CHAR_PERCENT: "%" /* % */,
                CHAR_PLUS: "+" /* + */,
                CHAR_QUESTION_MARK: "?" /* ? */,
                CHAR_RIGHT_ANGLE_BRACKET: ">" /* > */,
                CHAR_RIGHT_CURLY_BRACE: "}" /* } */,
                CHAR_RIGHT_SQUARE_BRACKET: "]" /* ] */,
                CHAR_SEMICOLON: ";" /* ; */,
                CHAR_SINGLE_QUOTE: "'" /* ' */,
                CHAR_SPACE: " " /*   */,
                CHAR_TAB: "\t" /* \t */,
                CHAR_UNDERSCORE: "_" /* _ */,
                CHAR_VERTICAL_LINE: "|" /* | */,
                CHAR_ZERO_WIDTH_NOBREAK_SPACE: "\uFEFF" /* \uFEFF */
            };

            /***/
        },

        /***/ 785: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const fill = __nccwpck_require__(6936);
            const stringify = __nccwpck_require__(5120);
            const utils = __nccwpck_require__(5316);

            const append = (queue = "", stash = "", enclose = false) => {
                const result = [];

                queue = [].concat(queue);
                stash = [].concat(stash);

                if (!stash.length) return queue;
                if (!queue.length) {
                    return enclose
                        ? utils.flatten(stash).map((ele) => `{${ele}}`)
                        : stash;
                }

                for (const item of queue) {
                    if (Array.isArray(item)) {
                        for (const value of item) {
                            result.push(append(value, stash, enclose));
                        }
                    } else {
                        for (let ele of stash) {
                            if (enclose === true && typeof ele === "string")
                                ele = `{${ele}}`;
                            result.push(
                                Array.isArray(ele)
                                    ? append(item, ele, enclose)
                                    : item + ele
                            );
                        }
                    }
                }
                return utils.flatten(result);
            };

            const expand = (ast, options = {}) => {
                const rangeLimit =
                    options.rangeLimit === undefined
                        ? 1000
                        : options.rangeLimit;

                const walk = (node, parent = {}) => {
                    node.queue = [];

                    let p = parent;
                    let q = parent.queue;

                    while (
                        p.type !== "brace" &&
                        p.type !== "root" &&
                        p.parent
                    ) {
                        p = p.parent;
                        q = p.queue;
                    }

                    if (node.invalid || node.dollar) {
                        q.push(append(q.pop(), stringify(node, options)));
                        return;
                    }

                    if (
                        node.type === "brace" &&
                        node.invalid !== true &&
                        node.nodes.length === 2
                    ) {
                        q.push(append(q.pop(), ["{}"]));
                        return;
                    }

                    if (node.nodes && node.ranges > 0) {
                        const args = utils.reduce(node.nodes);

                        if (
                            utils.exceedsLimit(
                                ...args,
                                options.step,
                                rangeLimit
                            )
                        ) {
                            throw new RangeError(
                                "expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit."
                            );
                        }

                        let range = fill(...args, options);
                        if (range.length === 0) {
                            range = stringify(node, options);
                        }

                        q.push(append(q.pop(), range));
                        node.nodes = [];
                        return;
                    }

                    const enclose = utils.encloseBrace(node);
                    let queue = node.queue;
                    let block = node;

                    while (
                        block.type !== "brace" &&
                        block.type !== "root" &&
                        block.parent
                    ) {
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

                        if (child.nodes) {
                            walk(child, node);
                        }
                    }

                    return queue;
                };

                return utils.flatten(walk(ast));
            };

            module.exports = expand;

            /***/
        },

        /***/ 4894: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const stringify = __nccwpck_require__(5120);

            /**
             * Constants
             */

            const {
                MAX_LENGTH,
                CHAR_BACKSLASH /* \ */,
                CHAR_BACKTICK /* ` */,
                CHAR_COMMA /* , */,
                CHAR_DOT /* . */,
                CHAR_LEFT_PARENTHESES /* ( */,
                CHAR_RIGHT_PARENTHESES /* ) */,
                CHAR_LEFT_CURLY_BRACE /* { */,
                CHAR_RIGHT_CURLY_BRACE /* } */,
                CHAR_LEFT_SQUARE_BRACKET /* [ */,
                CHAR_RIGHT_SQUARE_BRACKET /* ] */,
                CHAR_DOUBLE_QUOTE /* " */,
                CHAR_SINGLE_QUOTE /* ' */,
                CHAR_NO_BREAK_SPACE,
                CHAR_ZERO_WIDTH_NOBREAK_SPACE
            } = __nccwpck_require__(5728);

            /**
             * parse
             */

            const parse = (input, options = {}) => {
                if (typeof input !== "string") {
                    throw new TypeError("Expected a string");
                }

                const opts = options || {};
                const max =
                    typeof opts.maxLength === "number"
                        ? Math.min(MAX_LENGTH, opts.maxLength)
                        : MAX_LENGTH;
                if (input.length > max) {
                    throw new SyntaxError(
                        `Input length (${input.length}), exceeds max characters (${max})`
                    );
                }

                const ast = { type: "root", input, nodes: [] };
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
                    if (node.type === "text" && prev.type === "dot") {
                        prev.type = "text";
                    }

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

                    if (
                        value === CHAR_ZERO_WIDTH_NOBREAK_SPACE ||
                        value === CHAR_NO_BREAK_SPACE
                    ) {
                        continue;
                    }

                    /**
                     * Escaped chars
                     */

                    if (value === CHAR_BACKSLASH) {
                        push({
                            type: "text",
                            value:
                                (options.keepEscaping ? value : "") + advance()
                        });
                        continue;
                    }

                    /**
                     * Right square bracket (literal): ']'
                     */

                    if (value === CHAR_RIGHT_SQUARE_BRACKET) {
                        push({ type: "text", value: "\\" + value });
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

                                if (brackets === 0) {
                                    break;
                                }
                            }
                        }

                        push({ type: "text", value });
                        continue;
                    }

                    /**
                     * Parentheses
                     */

                    if (value === CHAR_LEFT_PARENTHESES) {
                        block = push({ type: "paren", nodes: [] });
                        stack.push(block);
                        push({ type: "text", value });
                        continue;
                    }

                    if (value === CHAR_RIGHT_PARENTHESES) {
                        if (block.type !== "paren") {
                            push({ type: "text", value });
                            continue;
                        }
                        block = stack.pop();
                        push({ type: "text", value });
                        block = stack[stack.length - 1];
                        continue;
                    }

                    /**
                     * Quotes: '|"|`
                     */

                    if (
                        value === CHAR_DOUBLE_QUOTE ||
                        value === CHAR_SINGLE_QUOTE ||
                        value === CHAR_BACKTICK
                    ) {
                        const open = value;
                        let next;

                        if (options.keepQuotes !== true) {
                            value = "";
                        }

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

                        push({ type: "text", value });
                        continue;
                    }

                    /**
                     * Left curly brace: '{'
                     */

                    if (value === CHAR_LEFT_CURLY_BRACE) {
                        depth++;

                        const dollar =
                            (prev.value && prev.value.slice(-1) === "$") ||
                            block.dollar === true;
                        const brace = {
                            type: "brace",
                            open: true,
                            close: false,
                            dollar,
                            depth,
                            commas: 0,
                            ranges: 0,
                            nodes: []
                        };

                        block = push(brace);
                        stack.push(block);
                        push({ type: "open", value });
                        continue;
                    }

                    /**
                     * Right curly brace: '}'
                     */

                    if (value === CHAR_RIGHT_CURLY_BRACE) {
                        if (block.type !== "brace") {
                            push({ type: "text", value });
                            continue;
                        }

                        const type = "close";
                        block = stack.pop();
                        block.close = true;

                        push({ type, value });
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
                            block.nodes = [
                                open,
                                { type: "text", value: stringify(block) }
                            ];
                        }

                        push({ type: "comma", value });
                        block.commas++;
                        continue;
                    }

                    /**
                     * Dot: '.'
                     */

                    if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
                        const siblings = block.nodes;

                        if (depth === 0 || siblings.length === 0) {
                            push({ type: "text", value });
                            continue;
                        }

                        if (prev.type === "dot") {
                            block.range = [];
                            prev.value += value;
                            prev.type = "range";

                            if (
                                block.nodes.length !== 3 &&
                                block.nodes.length !== 5
                            ) {
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

                        push({ type: "dot", value });
                        continue;
                    }

                    /**
                     * Text
                     */

                    push({ type: "text", value });
                }

                // Mark imbalanced braces and brackets as invalid
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

                        // get the location of the block on parent.nodes (block's siblings)
                        const parent = stack[stack.length - 1];
                        const index = parent.nodes.indexOf(block);
                        // replace the (invalid) block with it's nodes
                        parent.nodes.splice(index, 1, ...block.nodes);
                    }
                } while (stack.length > 0);

                push({ type: "eos" });
                return ast;
            };

            module.exports = parse;

            /***/
        },

        /***/ 5120: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const utils = __nccwpck_require__(5316);

            module.exports = (ast, options = {}) => {
                const stringify = (node, parent = {}) => {
                    const invalidBlock =
                        options.escapeInvalid && utils.isInvalidBrace(parent);
                    const invalidNode =
                        node.invalid === true && options.escapeInvalid === true;
                    let output = "";

                    if (node.value) {
                        if (
                            (invalidBlock || invalidNode) &&
                            utils.isOpenOrClose(node)
                        ) {
                            return "\\" + node.value;
                        }
                        return node.value;
                    }

                    if (node.value) {
                        return node.value;
                    }

                    if (node.nodes) {
                        for (const child of node.nodes) {
                            output += stringify(child);
                        }
                    }
                    return output;
                };

                return stringify(ast);
            };

            /***/
        },

        /***/ 5316: /***/ (__unused_webpack_module, exports) => {
            "use strict";

            exports.isInteger = (num) => {
                if (typeof num === "number") {
                    return Number.isInteger(num);
                }
                if (typeof num === "string" && num.trim() !== "") {
                    return Number.isInteger(Number(num));
                }
                return false;
            };

            /**
             * Find a node of the given type
             */

            exports.find = (node, type) =>
                node.nodes.find((node) => node.type === type);

            /**
             * Find a node of the given type
             */

            exports.exceedsLimit = (min, max, step = 1, limit) => {
                if (limit === false) return false;
                if (!exports.isInteger(min) || !exports.isInteger(max))
                    return false;
                return (Number(max) - Number(min)) / Number(step) >= limit;
            };

            /**
             * Escape the given node with '\\' before node.value
             */

            exports.escapeNode = (block, n = 0, type) => {
                const node = block.nodes[n];
                if (!node) return;

                if (
                    (type && node.type === type) ||
                    node.type === "open" ||
                    node.type === "close"
                ) {
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
                if ((node.commas >> (0 + node.ranges)) >> 0 === 0) {
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
                if ((block.commas >> (0 + block.ranges)) >> 0 === 0) {
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
                if (node.type === "open" || node.type === "close") {
                    return true;
                }
                return node.open === true || node.close === true;
            };

            /**
             * Reduce an array of text nodes.
             */

            exports.reduce = (nodes) =>
                nodes.reduce((acc, node) => {
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

                        if (ele !== undefined) {
                            result.push(ele);
                        }
                    }
                    return result;
                };

                flat(args);
                return result;
            };

            /***/
        },

        /***/ 7823: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const taskManager = __nccwpck_require__(7054);
            const async_1 = __nccwpck_require__(6598);
            const stream_1 = __nccwpck_require__(8280);
            const sync_1 = __nccwpck_require__(5683);
            const settings_1 = __nccwpck_require__(7146);
            const utils = __nccwpck_require__(4649);
            async function FastGlob(source, options) {
                assertPatternsInput(source);
                const works = getWorks(source, async_1.default, options);
                const result = await Promise.all(works);
                return utils.array.flatten(result);
            }
            // https://github.com/typescript-eslint/typescript-eslint/issues/60
            // eslint-disable-next-line no-redeclare
            (function (FastGlob) {
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
                let posix;
                (function (posix) {
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
                })((posix = FastGlob.posix || (FastGlob.posix = {})));
                let win32;
                (function (win32) {
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
                })((win32 = FastGlob.win32 || (FastGlob.win32 = {})));
            })(FastGlob || (FastGlob = {}));
            function getWorks(source, _Provider, options) {
                const patterns = [].concat(source);
                const settings = new settings_1.default(options);
                const tasks = taskManager.generate(patterns, settings);
                const provider = new _Provider(settings);
                return tasks.map(provider.read, provider);
            }
            function assertPatternsInput(input) {
                const source = [].concat(input);
                const isValidSource = source.every(
                    (item) =>
                        utils.string.isString(item) &&
                        !utils.string.isEmpty(item)
                );
                if (!isValidSource) {
                    throw new TypeError(
                        "Patterns must be a string (non empty) or an array of strings"
                    );
                }
            }
            module.exports = FastGlob;

            /***/
        },

        /***/ 7054: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.convertPatternGroupToTask =
                exports.convertPatternGroupsToTasks =
                exports.groupPatternsByBaseDirectory =
                exports.getNegativePatternsAsPositive =
                exports.getPositivePatterns =
                exports.convertPatternsToTasks =
                exports.generate =
                    void 0;
            const utils = __nccwpck_require__(4649);
            function generate(input, settings) {
                const patterns = processPatterns(input, settings);
                const ignore = processPatterns(settings.ignore, settings);
                const positivePatterns = getPositivePatterns(patterns);
                const negativePatterns = getNegativePatternsAsPositive(
                    patterns,
                    ignore
                );
                const staticPatterns = positivePatterns.filter((pattern) =>
                    utils.pattern.isStaticPattern(pattern, settings)
                );
                const dynamicPatterns = positivePatterns.filter((pattern) =>
                    utils.pattern.isDynamicPattern(pattern, settings)
                );
                const staticTasks = convertPatternsToTasks(
                    staticPatterns,
                    negativePatterns,
                    /* dynamic */ false
                );
                const dynamicTasks = convertPatternsToTasks(
                    dynamicPatterns,
                    negativePatterns,
                    /* dynamic */ true
                );
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
                if (settings.braceExpansion) {
                    patterns =
                        utils.pattern.expandPatternsWithBraceExpansion(
                            patterns
                        );
                }
                /**
                 * If the `baseNameMatch` option is enabled, we must add globstar to patterns, so that they can be used
                 * at any nesting level.
                 *
                 * We do this here, because otherwise we have to complicate the filtering logic. For example, we need to change
                 * the pattern in the filter before creating a regular expression. There is no need to change the patterns
                 * in the application. Only on the input.
                 */
                if (settings.baseNameMatch) {
                    patterns = patterns.map((pattern) =>
                        pattern.includes("/") ? pattern : `**/${pattern}`
                    );
                }
                /**
                 * This method also removes duplicate slashes that may have been in the pattern or formed as a result of expansion.
                 */
                return patterns.map((pattern) =>
                    utils.pattern.removeDuplicateSlashes(pattern)
                );
            }
            /**
             * Returns tasks grouped by basic pattern directories.
             *
             * Patterns that can be found inside (`./`) and outside (`../`) the current directory are handled separately.
             * This is necessary because directory traversal starts at the base directory and goes deeper.
             */
            function convertPatternsToTasks(positive, negative, dynamic) {
                const tasks = [];
                const patternsOutsideCurrentDirectory =
                    utils.pattern.getPatternsOutsideCurrentDirectory(positive);
                const patternsInsideCurrentDirectory =
                    utils.pattern.getPatternsInsideCurrentDirectory(positive);
                const outsideCurrentDirectoryGroup =
                    groupPatternsByBaseDirectory(
                        patternsOutsideCurrentDirectory
                    );
                const insideCurrentDirectoryGroup =
                    groupPatternsByBaseDirectory(
                        patternsInsideCurrentDirectory
                    );
                tasks.push(
                    ...convertPatternGroupsToTasks(
                        outsideCurrentDirectoryGroup,
                        negative,
                        dynamic
                    )
                );
                /*
                 * For the sake of reducing future accesses to the file system, we merge all tasks within the current directory
                 * into a global task, if at least one pattern refers to the root (`.`). In this case, the global task covers the rest.
                 */
                if ("." in insideCurrentDirectoryGroup) {
                    tasks.push(
                        convertPatternGroupToTask(
                            ".",
                            patternsInsideCurrentDirectory,
                            negative,
                            dynamic
                        )
                    );
                } else {
                    tasks.push(
                        ...convertPatternGroupsToTasks(
                            insideCurrentDirectoryGroup,
                            negative,
                            dynamic
                        )
                    );
                }
                return tasks;
            }
            exports.convertPatternsToTasks = convertPatternsToTasks;
            function getPositivePatterns(patterns) {
                return utils.pattern.getPositivePatterns(patterns);
            }
            exports.getPositivePatterns = getPositivePatterns;
            function getNegativePatternsAsPositive(patterns, ignore) {
                const negative = utils.pattern
                    .getNegativePatterns(patterns)
                    .concat(ignore);
                const positive = negative.map(
                    utils.pattern.convertToPositivePattern
                );
                return positive;
            }
            exports.getNegativePatternsAsPositive =
                getNegativePatternsAsPositive;
            function groupPatternsByBaseDirectory(patterns) {
                const group = {};
                return patterns.reduce((collection, pattern) => {
                    const base = utils.pattern.getBaseDirectory(pattern);
                    if (base in collection) {
                        collection[base].push(pattern);
                    } else {
                        collection[base] = [pattern];
                    }
                    return collection;
                }, group);
            }
            exports.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
            function convertPatternGroupsToTasks(positive, negative, dynamic) {
                return Object.keys(positive).map((base) => {
                    return convertPatternGroupToTask(
                        base,
                        positive[base],
                        negative,
                        dynamic
                    );
                });
            }
            exports.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
            function convertPatternGroupToTask(
                base,
                positive,
                negative,
                dynamic
            ) {
                return {
                    dynamic,
                    positive,
                    negative,
                    base,
                    patterns: [].concat(
                        positive,
                        negative.map(utils.pattern.convertToNegativePattern)
                    )
                };
            }
            exports.convertPatternGroupToTask = convertPatternGroupToTask;

            /***/
        },

        /***/ 6598: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const async_1 = __nccwpck_require__(1616);
            const provider_1 = __nccwpck_require__(389);
            class ProviderAsync extends provider_1.default {
                constructor() {
                    super(...arguments);
                    this._reader = new async_1.default(this._settings);
                }
                async read(task) {
                    const root = this._getRootDirectory(task);
                    const options = this._getReaderOptions(task);
                    const entries = await this.api(root, task, options);
                    return entries.map((entry) => options.transform(entry));
                }
                api(root, task, options) {
                    if (task.dynamic) {
                        return this._reader.dynamic(root, options);
                    }
                    return this._reader.static(task.patterns, options);
                }
            }
            exports["default"] = ProviderAsync;

            /***/
        },

        /***/ 9562: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const utils = __nccwpck_require__(4649);
            const partial_1 = __nccwpck_require__(8677);
            class DeepFilter {
                constructor(_settings, _micromatchOptions) {
                    this._settings = _settings;
                    this._micromatchOptions = _micromatchOptions;
                }
                getFilter(basePath, positive, negative) {
                    const matcher = this._getMatcher(positive);
                    const negativeRe = this._getNegativePatternsRe(negative);
                    return (entry) =>
                        this._filter(basePath, entry, matcher, negativeRe);
                }
                _getMatcher(patterns) {
                    return new partial_1.default(
                        patterns,
                        this._settings,
                        this._micromatchOptions
                    );
                }
                _getNegativePatternsRe(patterns) {
                    const affectDepthOfReadingPatterns = patterns.filter(
                        utils.pattern.isAffectDepthOfReadingPattern
                    );
                    return utils.pattern.convertPatternsToRe(
                        affectDepthOfReadingPatterns,
                        this._micromatchOptions
                    );
                }
                _filter(basePath, entry, matcher, negativeRe) {
                    if (this._isSkippedByDeep(basePath, entry.path)) {
                        return false;
                    }
                    if (this._isSkippedSymbolicLink(entry)) {
                        return false;
                    }
                    const filepath = utils.path.removeLeadingDotSegment(
                        entry.path
                    );
                    if (this._isSkippedByPositivePatterns(filepath, matcher)) {
                        return false;
                    }
                    return this._isSkippedByNegativePatterns(
                        filepath,
                        negativeRe
                    );
                }
                _isSkippedByDeep(basePath, entryPath) {
                    /**
                     * Avoid unnecessary depth calculations when it doesn't matter.
                     */
                    if (this._settings.deep === Infinity) {
                        return false;
                    }
                    return (
                        this._getEntryLevel(basePath, entryPath) >=
                        this._settings.deep
                    );
                }
                _getEntryLevel(basePath, entryPath) {
                    const entryPathDepth = entryPath.split("/").length;
                    if (basePath === "") {
                        return entryPathDepth;
                    }
                    const basePathDepth = basePath.split("/").length;
                    return entryPathDepth - basePathDepth;
                }
                _isSkippedSymbolicLink(entry) {
                    return (
                        !this._settings.followSymbolicLinks &&
                        entry.dirent.isSymbolicLink()
                    );
                }
                _isSkippedByPositivePatterns(entryPath, matcher) {
                    return (
                        !this._settings.baseNameMatch &&
                        !matcher.match(entryPath)
                    );
                }
                _isSkippedByNegativePatterns(entryPath, patternsRe) {
                    return !utils.pattern.matchAny(entryPath, patternsRe);
                }
            }
            exports["default"] = DeepFilter;

            /***/
        },

        /***/ 3786: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const utils = __nccwpck_require__(4649);
            class EntryFilter {
                constructor(_settings, _micromatchOptions) {
                    this._settings = _settings;
                    this._micromatchOptions = _micromatchOptions;
                    this.index = new Map();
                }
                getFilter(positive, negative) {
                    const [absoluteNegative, relativeNegative] =
                        utils.pattern.partitionAbsoluteAndRelative(negative);
                    const patterns = {
                        positive: {
                            all: utils.pattern.convertPatternsToRe(
                                positive,
                                this._micromatchOptions
                            )
                        },
                        negative: {
                            absolute: utils.pattern.convertPatternsToRe(
                                absoluteNegative,
                                Object.assign(
                                    Object.assign({}, this._micromatchOptions),
                                    { dot: true }
                                )
                            ),
                            relative: utils.pattern.convertPatternsToRe(
                                relativeNegative,
                                Object.assign(
                                    Object.assign({}, this._micromatchOptions),
                                    { dot: true }
                                )
                            )
                        }
                    };
                    return (entry) => this._filter(entry, patterns);
                }
                _filter(entry, patterns) {
                    const filepath = utils.path.removeLeadingDotSegment(
                        entry.path
                    );
                    if (
                        this._settings.unique &&
                        this._isDuplicateEntry(filepath)
                    ) {
                        return false;
                    }
                    if (
                        this._onlyFileFilter(entry) ||
                        this._onlyDirectoryFilter(entry)
                    ) {
                        return false;
                    }
                    const isMatched = this._isMatchToPatternsSet(
                        filepath,
                        patterns,
                        entry.dirent.isDirectory()
                    );
                    if (this._settings.unique && isMatched) {
                        this._createIndexRecord(filepath);
                    }
                    return isMatched;
                }
                _isDuplicateEntry(filepath) {
                    return this.index.has(filepath);
                }
                _createIndexRecord(filepath) {
                    this.index.set(filepath, undefined);
                }
                _onlyFileFilter(entry) {
                    return this._settings.onlyFiles && !entry.dirent.isFile();
                }
                _onlyDirectoryFilter(entry) {
                    return (
                        this._settings.onlyDirectories &&
                        !entry.dirent.isDirectory()
                    );
                }
                _isMatchToPatternsSet(filepath, patterns, isDirectory) {
                    const isMatched = this._isMatchToPatterns(
                        filepath,
                        patterns.positive.all,
                        isDirectory
                    );
                    if (!isMatched) {
                        return false;
                    }
                    const isMatchedByRelativeNegative = this._isMatchToPatterns(
                        filepath,
                        patterns.negative.relative,
                        isDirectory
                    );
                    if (isMatchedByRelativeNegative) {
                        return false;
                    }
                    const isMatchedByAbsoluteNegative =
                        this._isMatchToAbsoluteNegative(
                            filepath,
                            patterns.negative.absolute,
                            isDirectory
                        );
                    if (isMatchedByAbsoluteNegative) {
                        return false;
                    }
                    return true;
                }
                _isMatchToAbsoluteNegative(filepath, patternsRe, isDirectory) {
                    if (patternsRe.length === 0) {
                        return false;
                    }
                    const fullpath = utils.path.makeAbsolute(
                        this._settings.cwd,
                        filepath
                    );
                    return this._isMatchToPatterns(
                        fullpath,
                        patternsRe,
                        isDirectory
                    );
                }
                _isMatchToPatterns(filepath, patternsRe, isDirectory) {
                    if (patternsRe.length === 0) {
                        return false;
                    }
                    // Trying to match files and directories by patterns.
                    const isMatched = utils.pattern.matchAny(
                        filepath,
                        patternsRe
                    );
                    // A pattern with a trailling slash can be used for directory matching.
                    // To apply such pattern, we need to add a tralling slash to the path.
                    if (!isMatched && isDirectory) {
                        return utils.pattern.matchAny(
                            filepath + "/",
                            patternsRe
                        );
                    }
                    return isMatched;
                }
            }
            exports["default"] = EntryFilter;

            /***/
        },

        /***/ 7900: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const utils = __nccwpck_require__(4649);
            class ErrorFilter {
                constructor(_settings) {
                    this._settings = _settings;
                }
                getFilter() {
                    return (error) => this._isNonFatalError(error);
                }
                _isNonFatalError(error) {
                    return (
                        utils.errno.isEnoentCodeError(error) ||
                        this._settings.suppressErrors
                    );
                }
            }
            exports["default"] = ErrorFilter;

            /***/
        },

        /***/ 893: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const utils = __nccwpck_require__(4649);
            class Matcher {
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
                        const sections =
                            this._splitSegmentsIntoSections(segments);
                        this._storage.push({
                            complete: sections.length <= 1,
                            pattern,
                            segments,
                            sections
                        });
                    }
                }
                _getPatternSegments(pattern) {
                    const parts = utils.pattern.getPatternParts(
                        pattern,
                        this._micromatchOptions
                    );
                    return parts.map((part) => {
                        const dynamic = utils.pattern.isDynamicPattern(
                            part,
                            this._settings
                        );
                        if (!dynamic) {
                            return {
                                dynamic: false,
                                pattern: part
                            };
                        }
                        return {
                            dynamic: true,
                            pattern: part,
                            patternRe: utils.pattern.makeRe(
                                part,
                                this._micromatchOptions
                            )
                        };
                    });
                }
                _splitSegmentsIntoSections(segments) {
                    return utils.array.splitWhen(
                        segments,
                        (segment) =>
                            segment.dynamic &&
                            utils.pattern.hasGlobStar(segment.pattern)
                    );
                }
            }
            exports["default"] = Matcher;

            /***/
        },

        /***/ 8677: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const matcher_1 = __nccwpck_require__(893);
            class PartialMatcher extends matcher_1.default {
                match(filepath) {
                    const parts = filepath.split("/");
                    const levels = parts.length;
                    const patterns = this._storage.filter(
                        (info) =>
                            !info.complete || info.segments.length > levels
                    );
                    for (const pattern of patterns) {
                        const section = pattern.sections[0];
                        /**
                         * In this case, the pattern has a globstar and we must read all directories unconditionally,
                         * but only if the level has reached the end of the first group.
                         *
                         * fixtures/{a,b}/**
                         *  ^ true/false  ^ always true
                         */
                        if (!pattern.complete && levels > section.length) {
                            return true;
                        }
                        const match = parts.every((part, index) => {
                            const segment = pattern.segments[index];
                            if (
                                segment.dynamic &&
                                segment.patternRe.test(part)
                            ) {
                                return true;
                            }
                            if (!segment.dynamic && segment.pattern === part) {
                                return true;
                            }
                            return false;
                        });
                        if (match) {
                            return true;
                        }
                    }
                    return false;
                }
            }
            exports["default"] = PartialMatcher;

            /***/
        },

        /***/ 389: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const path = __nccwpck_require__(6928);
            const deep_1 = __nccwpck_require__(9562);
            const entry_1 = __nccwpck_require__(3786);
            const error_1 = __nccwpck_require__(7900);
            const entry_2 = __nccwpck_require__(1675);
            class Provider {
                constructor(_settings) {
                    this._settings = _settings;
                    this.errorFilter = new error_1.default(this._settings);
                    this.entryFilter = new entry_1.default(
                        this._settings,
                        this._getMicromatchOptions()
                    );
                    this.deepFilter = new deep_1.default(
                        this._settings,
                        this._getMicromatchOptions()
                    );
                    this.entryTransformer = new entry_2.default(this._settings);
                }
                _getRootDirectory(task) {
                    return path.resolve(this._settings.cwd, task.base);
                }
                _getReaderOptions(task) {
                    const basePath = task.base === "." ? "" : task.base;
                    return {
                        basePath,
                        pathSegmentSeparator: "/",
                        concurrency: this._settings.concurrency,
                        deepFilter: this.deepFilter.getFilter(
                            basePath,
                            task.positive,
                            task.negative
                        ),
                        entryFilter: this.entryFilter.getFilter(
                            task.positive,
                            task.negative
                        ),
                        errorFilter: this.errorFilter.getFilter(),
                        followSymbolicLinks: this._settings.followSymbolicLinks,
                        fs: this._settings.fs,
                        stats: this._settings.stats,
                        throwErrorOnBrokenSymbolicLink:
                            this._settings.throwErrorOnBrokenSymbolicLink,
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
            }
            exports["default"] = Provider;

            /***/
        },

        /***/ 8280: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const stream_1 = __nccwpck_require__(2203);
            const stream_2 = __nccwpck_require__(9082);
            const provider_1 = __nccwpck_require__(389);
            class ProviderStream extends provider_1.default {
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
                    source
                        .once("error", (error) =>
                            destination.emit("error", error)
                        )
                        .on("data", (entry) =>
                            destination.emit("data", options.transform(entry))
                        )
                        .once("end", () => destination.emit("end"));
                    destination.once("close", () => source.destroy());
                    return destination;
                }
                api(root, task, options) {
                    if (task.dynamic) {
                        return this._reader.dynamic(root, options);
                    }
                    return this._reader.static(task.patterns, options);
                }
            }
            exports["default"] = ProviderStream;

            /***/
        },

        /***/ 5683: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const sync_1 = __nccwpck_require__(1553);
            const provider_1 = __nccwpck_require__(389);
            class ProviderSync extends provider_1.default {
                constructor() {
                    super(...arguments);
                    this._reader = new sync_1.default(this._settings);
                }
                read(task) {
                    const root = this._getRootDirectory(task);
                    const options = this._getReaderOptions(task);
                    const entries = this.api(root, task, options);
                    return entries.map(options.transform);
                }
                api(root, task, options) {
                    if (task.dynamic) {
                        return this._reader.dynamic(root, options);
                    }
                    return this._reader.static(task.patterns, options);
                }
            }
            exports["default"] = ProviderSync;

            /***/
        },

        /***/ 1675: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const utils = __nccwpck_require__(4649);
            class EntryTransformer {
                constructor(_settings) {
                    this._settings = _settings;
                }
                getTransformer() {
                    return (entry) => this._transform(entry);
                }
                _transform(entry) {
                    let filepath = entry.path;
                    if (this._settings.absolute) {
                        filepath = utils.path.makeAbsolute(
                            this._settings.cwd,
                            filepath
                        );
                        filepath = utils.path.unixify(filepath);
                    }
                    if (
                        this._settings.markDirectories &&
                        entry.dirent.isDirectory()
                    ) {
                        filepath += "/";
                    }
                    if (!this._settings.objectMode) {
                        return filepath;
                    }
                    return Object.assign(Object.assign({}, entry), {
                        path: filepath
                    });
                }
            }
            exports["default"] = EntryTransformer;

            /***/
        },

        /***/ 1616: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const fsWalk = __nccwpck_require__(9983);
            const reader_1 = __nccwpck_require__(6997);
            const stream_1 = __nccwpck_require__(9082);
            class ReaderAsync extends reader_1.default {
                constructor() {
                    super(...arguments);
                    this._walkAsync = fsWalk.walk;
                    this._readerStream = new stream_1.default(this._settings);
                }
                dynamic(root, options) {
                    return new Promise((resolve, reject) => {
                        this._walkAsync(root, options, (error, entries) => {
                            if (error === null) {
                                resolve(entries);
                            } else {
                                reject(error);
                            }
                        });
                    });
                }
                async static(patterns, options) {
                    const entries = [];
                    const stream = this._readerStream.static(patterns, options);
                    // After #235, replace it with an asynchronous iterator.
                    return new Promise((resolve, reject) => {
                        stream.once("error", reject);
                        stream.on("data", (entry) => entries.push(entry));
                        stream.once("end", () => resolve(entries));
                    });
                }
            }
            exports["default"] = ReaderAsync;

            /***/
        },

        /***/ 6997: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const path = __nccwpck_require__(6928);
            const fsStat = __nccwpck_require__(1099);
            const utils = __nccwpck_require__(4649);
            class Reader {
                constructor(_settings) {
                    this._settings = _settings;
                    this._fsStatSettings = new fsStat.Settings({
                        followSymbolicLink: this._settings.followSymbolicLinks,
                        fs: this._settings.fs,
                        throwErrorOnBrokenSymbolicLink:
                            this._settings.followSymbolicLinks
                    });
                }
                _getFullEntryPath(filepath) {
                    return path.resolve(this._settings.cwd, filepath);
                }
                _makeEntry(stats, pattern) {
                    const entry = {
                        name: pattern,
                        path: pattern,
                        dirent: utils.fs.createDirentFromStats(pattern, stats)
                    };
                    if (this._settings.stats) {
                        entry.stats = stats;
                    }
                    return entry;
                }
                _isFatalError(error) {
                    return (
                        !utils.errno.isEnoentCodeError(error) &&
                        !this._settings.suppressErrors
                    );
                }
            }
            exports["default"] = Reader;

            /***/
        },

        /***/ 9082: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const stream_1 = __nccwpck_require__(2203);
            const fsStat = __nccwpck_require__(1099);
            const fsWalk = __nccwpck_require__(9983);
            const reader_1 = __nccwpck_require__(6997);
            class ReaderStream extends reader_1.default {
                constructor() {
                    super(...arguments);
                    this._walkStream = fsWalk.walkStream;
                    this._stat = fsStat.stat;
                }
                dynamic(root, options) {
                    return this._walkStream(root, options);
                }
                static(patterns, options) {
                    const filepaths = patterns.map(
                        this._getFullEntryPath,
                        this
                    );
                    const stream = new stream_1.PassThrough({
                        objectMode: true
                    });
                    stream._write = (index, _enc, done) => {
                        return this._getEntry(
                            filepaths[index],
                            patterns[index],
                            options
                        )
                            .then((entry) => {
                                if (
                                    entry !== null &&
                                    options.entryFilter(entry)
                                ) {
                                    stream.push(entry);
                                }
                                if (index === filepaths.length - 1) {
                                    stream.end();
                                }
                                done();
                            })
                            .catch(done);
                    };
                    for (let i = 0; i < filepaths.length; i++) {
                        stream.write(i);
                    }
                    return stream;
                }
                _getEntry(filepath, pattern, options) {
                    return this._getStat(filepath)
                        .then((stats) => this._makeEntry(stats, pattern))
                        .catch((error) => {
                            if (options.errorFilter(error)) {
                                return null;
                            }
                            throw error;
                        });
                }
                _getStat(filepath) {
                    return new Promise((resolve, reject) => {
                        this._stat(
                            filepath,
                            this._fsStatSettings,
                            (error, stats) => {
                                return error === null
                                    ? resolve(stats)
                                    : reject(error);
                            }
                        );
                    });
                }
            }
            exports["default"] = ReaderStream;

            /***/
        },

        /***/ 1553: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            const fsStat = __nccwpck_require__(1099);
            const fsWalk = __nccwpck_require__(9983);
            const reader_1 = __nccwpck_require__(6997);
            class ReaderSync extends reader_1.default {
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
                        const entry = this._getEntry(
                            filepath,
                            pattern,
                            options
                        );
                        if (entry === null || !options.entryFilter(entry)) {
                            continue;
                        }
                        entries.push(entry);
                    }
                    return entries;
                }
                _getEntry(filepath, pattern, options) {
                    try {
                        const stats = this._getStat(filepath);
                        return this._makeEntry(stats, pattern);
                    } catch (error) {
                        if (options.errorFilter(error)) {
                            return null;
                        }
                        throw error;
                    }
                }
                _getStat(filepath) {
                    return this._statSync(filepath, this._fsStatSettings);
                }
            }
            exports["default"] = ReaderSync;

            /***/
        },

        /***/ 7146: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
            const fs = __nccwpck_require__(9896);
            const os = __nccwpck_require__(857);
            /**
             * The `os.cpus` method can return zero. We expect the number of cores to be greater than zero.
             * https://github.com/nodejs/node/blob/7faeddf23a98c53896f8b574a6e66589e8fb1eb8/lib/os.js#L106-L107
             */
            const CPU_COUNT = Math.max(os.cpus().length, 1);
            exports.DEFAULT_FILE_SYSTEM_ADAPTER = {
                lstat: fs.lstat,
                lstatSync: fs.lstatSync,
                stat: fs.stat,
                statSync: fs.statSync,
                readdir: fs.readdir,
                readdirSync: fs.readdirSync
            };
            class Settings {
                constructor(_options = {}) {
                    this._options = _options;
                    this.absolute = this._getValue(
                        this._options.absolute,
                        false
                    );
                    this.baseNameMatch = this._getValue(
                        this._options.baseNameMatch,
                        false
                    );
                    this.braceExpansion = this._getValue(
                        this._options.braceExpansion,
                        true
                    );
                    this.caseSensitiveMatch = this._getValue(
                        this._options.caseSensitiveMatch,
                        true
                    );
                    this.concurrency = this._getValue(
                        this._options.concurrency,
                        CPU_COUNT
                    );
                    this.cwd = this._getValue(this._options.cwd, process.cwd());
                    this.deep = this._getValue(this._options.deep, Infinity);
                    this.dot = this._getValue(this._options.dot, false);
                    this.extglob = this._getValue(this._options.extglob, true);
                    this.followSymbolicLinks = this._getValue(
                        this._options.followSymbolicLinks,
                        true
                    );
                    this.fs = this._getFileSystemMethods(this._options.fs);
                    this.globstar = this._getValue(
                        this._options.globstar,
                        true
                    );
                    this.ignore = this._getValue(this._options.ignore, []);
                    this.markDirectories = this._getValue(
                        this._options.markDirectories,
                        false
                    );
                    this.objectMode = this._getValue(
                        this._options.objectMode,
                        false
                    );
                    this.onlyDirectories = this._getValue(
                        this._options.onlyDirectories,
                        false
                    );
                    this.onlyFiles = this._getValue(
                        this._options.onlyFiles,
                        true
                    );
                    this.stats = this._getValue(this._options.stats, false);
                    this.suppressErrors = this._getValue(
                        this._options.suppressErrors,
                        false
                    );
                    this.throwErrorOnBrokenSymbolicLink = this._getValue(
                        this._options.throwErrorOnBrokenSymbolicLink,
                        false
                    );
                    this.unique = this._getValue(this._options.unique, true);
                    if (this.onlyDirectories) {
                        this.onlyFiles = false;
                    }
                    if (this.stats) {
                        this.objectMode = true;
                    }
                    // Remove the cast to the array in the next major (#404).
                    this.ignore = [].concat(this.ignore);
                }
                _getValue(option, value) {
                    return option === undefined ? value : option;
                }
                _getFileSystemMethods(methods = {}) {
                    return Object.assign(
                        Object.assign({}, exports.DEFAULT_FILE_SYSTEM_ADAPTER),
                        methods
                    );
                }
            }
            exports["default"] = Settings;

            /***/
        },

        /***/ 7640: /***/ (__unused_webpack_module, exports) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.splitWhen = exports.flatten = void 0;
            function flatten(items) {
                return items.reduce(
                    (collection, item) => [].concat(collection, item),
                    []
                );
            }
            exports.flatten = flatten;
            function splitWhen(items, predicate) {
                const result = [[]];
                let groupIndex = 0;
                for (const item of items) {
                    if (predicate(item)) {
                        groupIndex++;
                        result[groupIndex] = [];
                    } else {
                        result[groupIndex].push(item);
                    }
                }
                return result;
            }
            exports.splitWhen = splitWhen;

            /***/
        },

        /***/ 3909: /***/ (__unused_webpack_module, exports) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.isEnoentCodeError = void 0;
            function isEnoentCodeError(error) {
                return error.code === "ENOENT";
            }
            exports.isEnoentCodeError = isEnoentCodeError;

            /***/
        },

        /***/ 510: /***/ (__unused_webpack_module, exports) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.createDirentFromStats = void 0;
            class DirentFromStats {
                constructor(name, stats) {
                    this.name = name;
                    this.isBlockDevice = stats.isBlockDevice.bind(stats);
                    this.isCharacterDevice =
                        stats.isCharacterDevice.bind(stats);
                    this.isDirectory = stats.isDirectory.bind(stats);
                    this.isFIFO = stats.isFIFO.bind(stats);
                    this.isFile = stats.isFile.bind(stats);
                    this.isSocket = stats.isSocket.bind(stats);
                    this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
                }
            }
            function createDirentFromStats(name, stats) {
                return new DirentFromStats(name, stats);
            }
            exports.createDirentFromStats = createDirentFromStats;

            /***/
        },

        /***/ 4649: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.string =
                exports.stream =
                exports.pattern =
                exports.path =
                exports.fs =
                exports.errno =
                exports.array =
                    void 0;
            const array = __nccwpck_require__(7640);
            exports.array = array;
            const errno = __nccwpck_require__(3909);
            exports.errno = errno;
            const fs = __nccwpck_require__(510);
            exports.fs = fs;
            const path = __nccwpck_require__(2634);
            exports.path = path;
            const pattern = __nccwpck_require__(4455);
            exports.pattern = pattern;
            const stream = __nccwpck_require__(6253);
            exports.stream = stream;
            const string = __nccwpck_require__(1200);
            exports.string = string;

            /***/
        },

        /***/ 2634: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.convertPosixPathToPattern =
                exports.convertWindowsPathToPattern =
                exports.convertPathToPattern =
                exports.escapePosixPath =
                exports.escapeWindowsPath =
                exports.escape =
                exports.removeLeadingDotSegment =
                exports.makeAbsolute =
                exports.unixify =
                    void 0;
            const os = __nccwpck_require__(857);
            const path = __nccwpck_require__(6928);
            const IS_WINDOWS_PLATFORM = os.platform() === "win32";
            const LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2; // ./ or .\\
            /**
             * All non-escaped special characters.
             * Posix: ()*?[]{|}, !+@ before (, ! at the beginning, \\ before non-special characters.
             * Windows: (){}[], !+@ before (, ! at the beginning.
             */
            const POSIX_UNESCAPED_GLOB_SYMBOLS_RE =
                /(\\?)([()*?[\]{|}]|^!|[!+@](?=\()|\\(?![!()*+?@[\]{|}]))/g;
            const WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE =
                /(\\?)([()[\]{}]|^!|[!+@](?=\())/g;
            /**
             * The device path (\\.\ or \\?\).
             * https://learn.microsoft.com/en-us/dotnet/standard/io/file-path-formats#dos-device-paths
             */
            const DOS_DEVICE_PATH_RE = /^\\\\([.?])/;
            /**
             * All backslashes except those escaping special characters.
             * Windows: !()+@{}
             * https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file#naming-conventions
             */
            const WINDOWS_BACKSLASHES_RE = /\\(?![!()+@[\]{}])/g;
            /**
             * Designed to work only with simple paths: `dir\\file`.
             */
            function unixify(filepath) {
                return filepath.replace(/\\/g, "/");
            }
            exports.unixify = unixify;
            function makeAbsolute(cwd, filepath) {
                return path.resolve(cwd, filepath);
            }
            exports.makeAbsolute = makeAbsolute;
            function removeLeadingDotSegment(entry) {
                // We do not use `startsWith` because this is 10x slower than current implementation for some cases.
                // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
                if (entry.charAt(0) === ".") {
                    const secondCharactery = entry.charAt(1);
                    if (secondCharactery === "/" || secondCharactery === "\\") {
                        return entry.slice(
                            LEADING_DOT_SEGMENT_CHARACTERS_COUNT
                        );
                    }
                }
                return entry;
            }
            exports.removeLeadingDotSegment = removeLeadingDotSegment;
            exports.escape = IS_WINDOWS_PLATFORM
                ? escapeWindowsPath
                : escapePosixPath;
            function escapeWindowsPath(pattern) {
                return pattern.replace(
                    WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE,
                    "\\$2"
                );
            }
            exports.escapeWindowsPath = escapeWindowsPath;
            function escapePosixPath(pattern) {
                return pattern.replace(POSIX_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
            }
            exports.escapePosixPath = escapePosixPath;
            exports.convertPathToPattern = IS_WINDOWS_PLATFORM
                ? convertWindowsPathToPattern
                : convertPosixPathToPattern;
            function convertWindowsPathToPattern(filepath) {
                return escapeWindowsPath(filepath)
                    .replace(DOS_DEVICE_PATH_RE, "//$1")
                    .replace(WINDOWS_BACKSLASHES_RE, "/");
            }
            exports.convertWindowsPathToPattern = convertWindowsPathToPattern;
            function convertPosixPathToPattern(filepath) {
                return escapePosixPath(filepath);
            }
            exports.convertPosixPathToPattern = convertPosixPathToPattern;

            /***/
        },

        /***/ 4455: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.isAbsolute =
                exports.partitionAbsoluteAndRelative =
                exports.removeDuplicateSlashes =
                exports.matchAny =
                exports.convertPatternsToRe =
                exports.makeRe =
                exports.getPatternParts =
                exports.expandBraceExpansion =
                exports.expandPatternsWithBraceExpansion =
                exports.isAffectDepthOfReadingPattern =
                exports.endsWithSlashGlobStar =
                exports.hasGlobStar =
                exports.getBaseDirectory =
                exports.isPatternRelatedToParentDirectory =
                exports.getPatternsOutsideCurrentDirectory =
                exports.getPatternsInsideCurrentDirectory =
                exports.getPositivePatterns =
                exports.getNegativePatterns =
                exports.isPositivePattern =
                exports.isNegativePattern =
                exports.convertToNegativePattern =
                exports.convertToPositivePattern =
                exports.isDynamicPattern =
                exports.isStaticPattern =
                    void 0;
            const path = __nccwpck_require__(6928);
            const globParent = __nccwpck_require__(9705);
            const micromatch = __nccwpck_require__(3277);
            const GLOBSTAR = "**";
            const ESCAPE_SYMBOL = "\\";
            const COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
            const REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[[^[]*]/;
            const REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\([^(]*\|[^|]*\)/;
            const GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\([^(]*\)/;
            const BRACE_EXPANSION_SEPARATORS_RE = /,|\.\./;
            /**
             * Matches a sequence of two or more consecutive slashes, excluding the first two slashes at the beginning of the string.
             * The latter is due to the presence of the device path at the beginning of the UNC path.
             */
            const DOUBLE_SLASH_RE = /(?!^)\/{2,}/g;
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
                if (pattern === "") {
                    return false;
                }
                /**
                 * When the `caseSensitiveMatch` option is disabled, all patterns must be marked as dynamic, because we cannot check
                 * filepath directly (without read directory).
                 */
                if (
                    options.caseSensitiveMatch === false ||
                    pattern.includes(ESCAPE_SYMBOL)
                ) {
                    return true;
                }
                if (
                    COMMON_GLOB_SYMBOLS_RE.test(pattern) ||
                    REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) ||
                    REGEX_GROUP_SYMBOLS_RE.test(pattern)
                ) {
                    return true;
                }
                if (
                    options.extglob !== false &&
                    GLOB_EXTENSION_SYMBOLS_RE.test(pattern)
                ) {
                    return true;
                }
                if (
                    options.braceExpansion !== false &&
                    hasBraceExpansion(pattern)
                ) {
                    return true;
                }
                return false;
            }
            exports.isDynamicPattern = isDynamicPattern;
            function hasBraceExpansion(pattern) {
                const openingBraceIndex = pattern.indexOf("{");
                if (openingBraceIndex === -1) {
                    return false;
                }
                const closingBraceIndex = pattern.indexOf(
                    "}",
                    openingBraceIndex + 1
                );
                if (closingBraceIndex === -1) {
                    return false;
                }
                const braceContent = pattern.slice(
                    openingBraceIndex,
                    closingBraceIndex
                );
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
                return patterns.filter(
                    (pattern) => !isPatternRelatedToParentDirectory(pattern)
                );
            }
            exports.getPatternsInsideCurrentDirectory =
                getPatternsInsideCurrentDirectory;
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
            exports.getPatternsOutsideCurrentDirectory =
                getPatternsOutsideCurrentDirectory;
            function isPatternRelatedToParentDirectory(pattern) {
                return pattern.startsWith("..") || pattern.startsWith("./..");
            }
            exports.isPatternRelatedToParentDirectory =
                isPatternRelatedToParentDirectory;
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
                const basename = path.basename(pattern);
                return (
                    endsWithSlashGlobStar(pattern) || isStaticPattern(basename)
                );
            }
            exports.isAffectDepthOfReadingPattern =
                isAffectDepthOfReadingPattern;
            function expandPatternsWithBraceExpansion(patterns) {
                return patterns.reduce((collection, pattern) => {
                    return collection.concat(expandBraceExpansion(pattern));
                }, []);
            }
            exports.expandPatternsWithBraceExpansion =
                expandPatternsWithBraceExpansion;
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
                let { parts } = micromatch.scan(
                    pattern,
                    Object.assign(Object.assign({}, options), { parts: true })
                );
                /**
                 * The scan method returns an empty array in some cases.
                 * See micromatch/picomatch#58 for more details.
                 */
                if (parts.length === 0) {
                    parts = [pattern];
                }
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
                for (const pattern of patterns) {
                    if (isAbsolute(pattern)) {
                        absolute.push(pattern);
                    } else {
                        relative.push(pattern);
                    }
                }
                return [absolute, relative];
            }
            exports.partitionAbsoluteAndRelative = partitionAbsoluteAndRelative;
            function isAbsolute(pattern) {
                return path.isAbsolute(pattern);
            }
            exports.isAbsolute = isAbsolute;

            /***/
        },

        /***/ 6253: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.merge = void 0;
            const merge2 = __nccwpck_require__(8985);
            function merge(streams) {
                const mergedStream = merge2(streams);
                streams.forEach((stream) => {
                    stream.once("error", (error) =>
                        mergedStream.emit("error", error)
                    );
                });
                mergedStream.once("close", () =>
                    propagateCloseEventToSources(streams)
                );
                mergedStream.once("end", () =>
                    propagateCloseEventToSources(streams)
                );
                return mergedStream;
            }
            exports.merge = merge;
            function propagateCloseEventToSources(streams) {
                streams.forEach((stream) => stream.emit("close"));
            }

            /***/
        },

        /***/ 1200: /***/ (__unused_webpack_module, exports) => {
            "use strict";

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

            /***/
        },

        /***/ 6936: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";
            /*!
             * fill-range <https://github.com/jonschlinkert/fill-range>
             *
             * Copyright (c) 2014-present, Jon Schlinkert.
             * Licensed under the MIT License.
             */

            const util = __nccwpck_require__(9023);
            const toRegexRange = __nccwpck_require__(5817);

            const isObject = (val) =>
                val !== null && typeof val === "object" && !Array.isArray(val);

            const transform = (toNumber) => {
                return (value) =>
                    toNumber === true ? Number(value) : String(value);
            };

            const isValidValue = (value) => {
                return (
                    typeof value === "number" ||
                    (typeof value === "string" && value !== "")
                );
            };

            const isNumber = (num) => Number.isInteger(+num);

            const zeros = (input) => {
                let value = `${input}`;
                let index = -1;
                if (value[0] === "-") value = value.slice(1);
                if (value === "0") return false;
                while (value[++index] === "0");
                return index > 0;
            };

            const stringify = (start, end, options) => {
                if (typeof start === "string" || typeof end === "string") {
                    return true;
                }
                return options.stringify === true;
            };

            const pad = (input, maxLength, toNumber) => {
                if (maxLength > 0) {
                    let dash = input[0] === "-" ? "-" : "";
                    if (dash) input = input.slice(1);
                    input =
                        dash +
                        input.padStart(dash ? maxLength - 1 : maxLength, "0");
                }
                if (toNumber === false) {
                    return String(input);
                }
                return input;
            };

            const toMaxLen = (input, maxLength) => {
                let negative = input[0] === "-" ? "-" : "";
                if (negative) {
                    input = input.slice(1);
                    maxLength--;
                }
                while (input.length < maxLength) input = "0" + input;
                return negative ? "-" + input : input;
            };

            const toSequence = (parts, options, maxLen) => {
                parts.negatives.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
                parts.positives.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

                let prefix = options.capture ? "" : "?:";
                let positives = "";
                let negatives = "";
                let result;

                if (parts.positives.length) {
                    positives = parts.positives
                        .map((v) => toMaxLen(String(v), maxLen))
                        .join("|");
                }

                if (parts.negatives.length) {
                    negatives = `-(${prefix}${parts.negatives.map((v) => toMaxLen(String(v), maxLen)).join("|")})`;
                }

                if (positives && negatives) {
                    result = `${positives}|${negatives}`;
                } else {
                    result = positives || negatives;
                }

                if (options.wrap) {
                    return `(${prefix}${result})`;
                }

                return result;
            };

            const toRange = (a, b, isNumbers, options) => {
                if (isNumbers) {
                    return toRegexRange(a, b, { wrap: false, ...options });
                }

                let start = String.fromCharCode(a);
                if (a === b) return start;

                let stop = String.fromCharCode(b);
                return `[${start}-${stop}]`;
            };

            const toRegex = (start, end, options) => {
                if (Array.isArray(start)) {
                    let wrap = options.wrap === true;
                    let prefix = options.capture ? "" : "?:";
                    return wrap
                        ? `(${prefix}${start.join("|")})`
                        : start.join("|");
                }
                return toRegexRange(start, end, options);
            };

            const rangeError = (...args) => {
                return new RangeError(
                    "Invalid range arguments: " + util.inspect(...args)
                );
            };

            const invalidRange = (start, end, options) => {
                if (options.strictRanges === true)
                    throw rangeError([start, end]);
                return [];
            };

            const invalidStep = (step, options) => {
                if (options.strictRanges === true) {
                    throw new TypeError(
                        `Expected step "${step}" to be a number`
                    );
                }
                return [];
            };

            const fillNumbers = (start, end, step = 1, options = {}) => {
                let a = Number(start);
                let b = Number(end);

                if (!Number.isInteger(a) || !Number.isInteger(b)) {
                    if (options.strictRanges === true)
                        throw rangeError([start, end]);
                    return [];
                }

                // fix negative zero
                if (a === 0) a = 0;
                if (b === 0) b = 0;

                let descending = a > b;
                let startString = String(start);
                let endString = String(end);
                let stepString = String(step);
                step = Math.max(Math.abs(step), 1);

                let padded =
                    zeros(startString) || zeros(endString) || zeros(stepString);
                let maxLen = padded
                    ? Math.max(
                          startString.length,
                          endString.length,
                          stepString.length
                      )
                    : 0;
                let toNumber =
                    padded === false &&
                    stringify(start, end, options) === false;
                let format = options.transform || transform(toNumber);

                if (options.toRegex && step === 1) {
                    return toRange(
                        toMaxLen(start, maxLen),
                        toMaxLen(end, maxLen),
                        true,
                        options
                    );
                }

                let parts = { negatives: [], positives: [] };
                let push = (num) =>
                    parts[num < 0 ? "negatives" : "positives"].push(
                        Math.abs(num)
                    );
                let range = [];
                let index = 0;

                while (descending ? a >= b : a <= b) {
                    if (options.toRegex === true && step > 1) {
                        push(a);
                    } else {
                        range.push(pad(format(a, index), maxLen, toNumber));
                    }
                    a = descending ? a - step : a + step;
                    index++;
                }

                if (options.toRegex === true) {
                    return step > 1
                        ? toSequence(parts, options, maxLen)
                        : toRegex(range, null, { wrap: false, ...options });
                }

                return range;
            };

            const fillLetters = (start, end, step = 1, options = {}) => {
                if (
                    (!isNumber(start) && start.length > 1) ||
                    (!isNumber(end) && end.length > 1)
                ) {
                    return invalidRange(start, end, options);
                }

                let format =
                    options.transform || ((val) => String.fromCharCode(val));
                let a = `${start}`.charCodeAt(0);
                let b = `${end}`.charCodeAt(0);

                let descending = a > b;
                let min = Math.min(a, b);
                let max = Math.max(a, b);

                if (options.toRegex && step === 1) {
                    return toRange(min, max, false, options);
                }

                let range = [];
                let index = 0;

                while (descending ? a >= b : a <= b) {
                    range.push(format(a, index));
                    a = descending ? a - step : a + step;
                    index++;
                }

                if (options.toRegex === true) {
                    return toRegex(range, null, { wrap: false, options });
                }

                return range;
            };

            const fill = (start, end, step, options = {}) => {
                if (end == null && isValidValue(start)) {
                    return [start];
                }

                if (!isValidValue(start) || !isValidValue(end)) {
                    return invalidRange(start, end, options);
                }

                if (typeof step === "function") {
                    return fill(start, end, 1, { transform: step });
                }

                if (isObject(step)) {
                    return fill(start, end, 0, step);
                }

                let opts = { ...options };
                if (opts.capture === true) opts.wrap = true;
                step = step || opts.step || 1;

                if (!isNumber(step)) {
                    if (step != null && !isObject(step))
                        return invalidStep(step, opts);
                    return fill(start, end, 1, step);
                }

                if (isNumber(start) && isNumber(end)) {
                    return fillNumbers(start, end, step, opts);
                }

                return fillLetters(
                    start,
                    end,
                    Math.max(Math.abs(step), 1),
                    opts
                );
            };

            module.exports = fill;

            /***/
        },

        /***/ 9705: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            var isGlob = __nccwpck_require__(6516);
            var pathPosixDirname = __nccwpck_require__(6928).posix.dirname;
            var isWin32 = __nccwpck_require__(857).platform() === "win32";

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
                var options = Object.assign({ flipBackslashes: true }, opts);

                // flip windows path separators
                if (
                    options.flipBackslashes &&
                    isWin32 &&
                    str.indexOf(slash) < 0
                ) {
                    str = str.replace(backslash, slash);
                }

                // special case for strings ending in enclosure containing path separator
                if (enclosure.test(str)) {
                    str += slash;
                }

                // preserves full path in case of trailing path separator
                str += "a";

                // remove path parts that are globby
                do {
                    str = pathPosixDirname(str);
                } while (isGlob(str) || globby.test(str));

                // remove escape chars and return result
                return str.replace(escaped, "$1");
            };

            /***/
        },

        /***/ 5935: /***/ (module) => {
            /*!
             * is-extglob <https://github.com/jonschlinkert/is-extglob>
             *
             * Copyright (c) 2014-2016, Jon Schlinkert.
             * Licensed under the MIT License.
             */

            module.exports = function isExtglob(str) {
                if (typeof str !== "string" || str === "") {
                    return false;
                }

                var match;
                while ((match = /(\\).|([@?!+*]\(.*\))/g.exec(str))) {
                    if (match[2]) return true;
                    str = str.slice(match.index + match[0].length);
                }

                return false;
            };

            /***/
        },

        /***/ 6516: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            /*!
             * is-glob <https://github.com/jonschlinkert/is-glob>
             *
             * Copyright (c) 2014-2017, Jon Schlinkert.
             * Released under the MIT License.
             */

            var isExtglob = __nccwpck_require__(5935);
            var chars = { "{": "}", "(": ")", "[": "]" };
            var strictCheck = function (str) {
                if (str[0] === "!") {
                    return true;
                }
                var index = 0;
                var pipeIndex = -2;
                var closeSquareIndex = -2;
                var closeCurlyIndex = -2;
                var closeParenIndex = -2;
                var backSlashIndex = -2;
                while (index < str.length) {
                    if (str[index] === "*") {
                        return true;
                    }

                    if (str[index + 1] === "?" && /[\].+)]/.test(str[index])) {
                        return true;
                    }

                    if (
                        closeSquareIndex !== -1 &&
                        str[index] === "[" &&
                        str[index + 1] !== "]"
                    ) {
                        if (closeSquareIndex < index) {
                            closeSquareIndex = str.indexOf("]", index);
                        }
                        if (closeSquareIndex > index) {
                            if (
                                backSlashIndex === -1 ||
                                backSlashIndex > closeSquareIndex
                            ) {
                                return true;
                            }
                            backSlashIndex = str.indexOf("\\", index);
                            if (
                                backSlashIndex === -1 ||
                                backSlashIndex > closeSquareIndex
                            ) {
                                return true;
                            }
                        }
                    }

                    if (
                        closeCurlyIndex !== -1 &&
                        str[index] === "{" &&
                        str[index + 1] !== "}"
                    ) {
                        closeCurlyIndex = str.indexOf("}", index);
                        if (closeCurlyIndex > index) {
                            backSlashIndex = str.indexOf("\\", index);
                            if (
                                backSlashIndex === -1 ||
                                backSlashIndex > closeCurlyIndex
                            ) {
                                return true;
                            }
                        }
                    }

                    if (
                        closeParenIndex !== -1 &&
                        str[index] === "(" &&
                        str[index + 1] === "?" &&
                        /[:!=]/.test(str[index + 2]) &&
                        str[index + 3] !== ")"
                    ) {
                        closeParenIndex = str.indexOf(")", index);
                        if (closeParenIndex > index) {
                            backSlashIndex = str.indexOf("\\", index);
                            if (
                                backSlashIndex === -1 ||
                                backSlashIndex > closeParenIndex
                            ) {
                                return true;
                            }
                        }
                    }

                    if (
                        pipeIndex !== -1 &&
                        str[index] === "(" &&
                        str[index + 1] !== "|"
                    ) {
                        if (pipeIndex < index) {
                            pipeIndex = str.indexOf("|", index);
                        }
                        if (pipeIndex !== -1 && str[pipeIndex + 1] !== ")") {
                            closeParenIndex = str.indexOf(")", pipeIndex);
                            if (closeParenIndex > pipeIndex) {
                                backSlashIndex = str.indexOf("\\", pipeIndex);
                                if (
                                    backSlashIndex === -1 ||
                                    backSlashIndex > closeParenIndex
                                ) {
                                    return true;
                                }
                            }
                        }
                    }

                    if (str[index] === "\\") {
                        var open = str[index + 1];
                        index += 2;
                        var close = chars[open];

                        if (close) {
                            var n = str.indexOf(close, index);
                            if (n !== -1) {
                                index = n + 1;
                            }
                        }

                        if (str[index] === "!") {
                            return true;
                        }
                    } else {
                        index++;
                    }
                }
                return false;
            };

            var relaxedCheck = function (str) {
                if (str[0] === "!") {
                    return true;
                }
                var index = 0;
                while (index < str.length) {
                    if (/[*?{}()[\]]/.test(str[index])) {
                        return true;
                    }

                    if (str[index] === "\\") {
                        var open = str[index + 1];
                        index += 2;
                        var close = chars[open];

                        if (close) {
                            var n = str.indexOf(close, index);
                            if (n !== -1) {
                                index = n + 1;
                            }
                        }

                        if (str[index] === "!") {
                            return true;
                        }
                    } else {
                        index++;
                    }
                }
                return false;
            };

            module.exports = function isGlob(str, options) {
                if (typeof str !== "string" || str === "") {
                    return false;
                }

                if (isExtglob(str)) {
                    return true;
                }

                var check = strictCheck;

                // optionally relax check
                if (options && options.strict === false) {
                    check = relaxedCheck;
                }

                return check(str);
            };

            /***/
        },

        /***/ 8246: /***/ (module) => {
            "use strict";
            /*!
             * is-number <https://github.com/jonschlinkert/is-number>
             *
             * Copyright (c) 2014-present, Jon Schlinkert.
             * Released under the MIT License.
             */

            module.exports = function (num) {
                if (typeof num === "number") {
                    return num - num === 0;
                }
                if (typeof num === "string" && num.trim() !== "") {
                    return Number.isFinite
                        ? Number.isFinite(+num)
                        : isFinite(+num);
                }
                return false;
            };

            /***/
        },

        /***/ 1067: /***/ (module) => {
            "use strict";

            const { FORCE_COLOR, NODE_DISABLE_COLORS, TERM } = process.env;

            const $ = {
                enabled:
                    !NODE_DISABLE_COLORS &&
                    TERM !== "dumb" &&
                    FORCE_COLOR !== "0",

                // modifiers
                reset: init(0, 0),
                bold: init(1, 22),
                dim: init(2, 22),
                italic: init(3, 23),
                underline: init(4, 24),
                inverse: init(7, 27),
                hidden: init(8, 28),
                strikethrough: init(9, 29),

                // colors
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

                // background colors
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
                let i = 0,
                    tmp,
                    beg = "",
                    end = "";
                for (; i < arr.length; i++) {
                    tmp = arr[i];
                    beg += tmp.open;
                    end += tmp.close;
                    if (str.includes(tmp.close)) {
                        str = str.replace(tmp.rgx, tmp.close + tmp.open);
                    }
                }
                return beg + str + end;
            }

            function chain(has, keys) {
                let ctx = { has, keys };

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
                return function (txt) {
                    if (this !== void 0 && this.has !== void 0) {
                        this.has.includes(open) ||
                            (this.has.push(open), this.keys.push(blk));
                        return txt === void 0
                            ? this
                            : $.enabled
                              ? run(this.keys, txt + "")
                              : txt + "";
                    }
                    return txt === void 0
                        ? chain([open], [blk])
                        : $.enabled
                          ? run([blk], txt + "")
                          : txt + "";
                };
            }

            module.exports = $;

            /***/
        },

        /***/ 8985: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            /*
             * merge2
             * https://github.com/teambition/merge2
             *
             * Copyright (c) 2014-2020 Teambition
             * Licensed under the MIT license.
             */
            const Stream = __nccwpck_require__(2203);
            const PassThrough = Stream.PassThrough;
            const slice = Array.prototype.slice;

            module.exports = merge2;

            function merge2() {
                const streamsQueue = [];
                const args = slice.call(arguments);
                let merging = false;
                let options = args[args.length - 1];

                if (
                    options &&
                    !Array.isArray(options) &&
                    options.pipe == null
                ) {
                    args.pop();
                } else {
                    options = {};
                }

                const doEnd = options.end !== false;
                const doPipeError = options.pipeError === true;
                if (options.objectMode == null) {
                    options.objectMode = true;
                }
                if (options.highWaterMark == null) {
                    options.highWaterMark = 64 * 1024;
                }
                const mergedStream = PassThrough(options);

                function addStream() {
                    for (let i = 0, len = arguments.length; i < len; i++) {
                        streamsQueue.push(pauseStreams(arguments[i], options));
                    }
                    mergeStream();
                    return this;
                }

                function mergeStream() {
                    if (merging) {
                        return;
                    }
                    merging = true;

                    let streams = streamsQueue.shift();
                    if (!streams) {
                        process.nextTick(endStream);
                        return;
                    }
                    if (!Array.isArray(streams)) {
                        streams = [streams];
                    }

                    let pipesCount = streams.length + 1;

                    function next() {
                        if (--pipesCount > 0) {
                            return;
                        }
                        merging = false;
                        mergeStream();
                    }

                    function pipe(stream) {
                        function onend() {
                            stream.removeListener("merge2UnpipeEnd", onend);
                            stream.removeListener("end", onend);
                            if (doPipeError) {
                                stream.removeListener("error", onerror);
                            }
                            next();
                        }
                        function onerror(err) {
                            mergedStream.emit("error", err);
                        }
                        // skip ended stream
                        if (stream._readableState.endEmitted) {
                            return next();
                        }

                        stream.on("merge2UnpipeEnd", onend);
                        stream.on("end", onend);

                        if (doPipeError) {
                            stream.on("error", onerror);
                        }

                        stream.pipe(mergedStream, { end: false });
                        // compatible for old stream
                        stream.resume();
                    }

                    for (let i = 0; i < streams.length; i++) {
                        pipe(streams[i]);
                    }

                    next();
                }

                function endStream() {
                    merging = false;
                    // emit 'queueDrain' when all streams merged.
                    mergedStream.emit("queueDrain");
                    if (doEnd) {
                        mergedStream.end();
                    }
                }

                mergedStream.setMaxListeners(0);
                mergedStream.add = addStream;
                mergedStream.on("unpipe", function (stream) {
                    stream.emit("merge2UnpipeEnd");
                });

                if (args.length) {
                    addStream.apply(null, args);
                }
                return mergedStream;
            }

            // check and pause streams for pipe.
            function pauseStreams(streams, options) {
                if (!Array.isArray(streams)) {
                    // Backwards-compat with old-style streams
                    if (!streams._readableState && streams.pipe) {
                        streams = streams.pipe(PassThrough(options));
                    }
                    if (
                        !streams._readableState ||
                        !streams.pause ||
                        !streams.pipe
                    ) {
                        throw new Error("Only readable stream can be merged.");
                    }
                    streams.pause();
                } else {
                    for (let i = 0, len = streams.length; i < len; i++) {
                        streams[i] = pauseStreams(streams[i], options);
                    }
                }
                return streams;
            }

            /***/
        },

        /***/ 3277: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const util = __nccwpck_require__(9023);
            const braces = __nccwpck_require__(3169);
            const picomatch = __nccwpck_require__(2149);
            const utils = __nccwpck_require__(7976);

            const isEmptyString = (v) => v === "" || v === "./";
            const hasBraces = (v) => {
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

            const micromatch = (list, patterns, options) => {
                patterns = [].concat(patterns);
                list = [].concat(list);

                let omit = new Set();
                let keep = new Set();
                let items = new Set();
                let negatives = 0;

                let onResult = (state) => {
                    items.add(state.output);
                    if (options && options.onResult) {
                        options.onResult(state);
                    }
                };

                for (let i = 0; i < patterns.length; i++) {
                    let isMatch = picomatch(
                        String(patterns[i]),
                        { ...options, onResult },
                        true
                    );
                    let negated =
                        isMatch.state.negated || isMatch.state.negatedExtglob;
                    if (negated) negatives++;

                    for (let item of list) {
                        let matched = isMatch(item, true);

                        let match = negated
                            ? !matched.isMatch
                            : matched.isMatch;
                        if (!match) continue;

                        if (negated) {
                            omit.add(matched.output);
                        } else {
                            omit.delete(matched.output);
                            keep.add(matched.output);
                        }
                    }
                }

                let result =
                    negatives === patterns.length ? [...items] : [...keep];
                let matches = result.filter((item) => !omit.has(item));

                if (options && matches.length === 0) {
                    if (options.failglob === true) {
                        throw new Error(
                            `No matches found for "${patterns.join(", ")}"`
                        );
                    }

                    if (options.nonull === true || options.nullglob === true) {
                        return options.unescape
                            ? patterns.map((p) => p.replace(/\\/g, ""))
                            : patterns;
                    }
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

            micromatch.matcher = (pattern, options) =>
                picomatch(pattern, options);

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

            micromatch.isMatch = (str, patterns, options) =>
                picomatch(patterns, options)(str);

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
                let result = new Set();
                let items = [];

                let onResult = (state) => {
                    if (options.onResult) options.onResult(state);
                    items.push(state.output);
                };

                let matches = new Set(
                    micromatch(list, patterns, { ...options, onResult })
                );

                for (let item of items) {
                    if (!matches.has(item)) {
                        result.add(item);
                    }
                }
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
                if (typeof str !== "string") {
                    throw new TypeError(
                        `Expected a string: "${util.inspect(str)}"`
                    );
                }

                if (Array.isArray(pattern)) {
                    return pattern.some((p) =>
                        micromatch.contains(str, p, options)
                    );
                }

                if (typeof pattern === "string") {
                    if (isEmptyString(str) || isEmptyString(pattern)) {
                        return false;
                    }

                    if (
                        str.includes(pattern) ||
                        (str.startsWith("./") && str.slice(2).includes(pattern))
                    ) {
                        return true;
                    }
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
                if (!utils.isObject(obj)) {
                    throw new TypeError(
                        "Expected the first argument to be an object"
                    );
                }
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
                    if (items.some((item) => isMatch(item))) {
                        return true;
                    }
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
                    if (!items.every((item) => isMatch(item))) {
                        return false;
                    }
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
                if (typeof str !== "string") {
                    throw new TypeError(
                        `Expected a string: "${util.inspect(str)}"`
                    );
                }

                return []
                    .concat(patterns)
                    .every((p) => picomatch(p, options)(str));
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
                let regex = picomatch.makeRe(String(glob), {
                    ...options,
                    capture: true
                });
                let match = regex.exec(
                    posix ? utils.toPosixSlashes(input) : input
                );

                if (match) {
                    return match.slice(1).map((v) => (v === void 0 ? "" : v));
                }
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
                for (let pattern of [].concat(patterns || [])) {
                    for (let str of braces(String(pattern), options)) {
                        res.push(picomatch.parse(str, options));
                    }
                }
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
                if (typeof pattern !== "string")
                    throw new TypeError("Expected a string");
                if (
                    (options && options.nobrace === true) ||
                    !hasBraces(pattern)
                ) {
                    return [pattern];
                }
                return braces(pattern, options);
            };

            /**
             * Expand braces
             */

            micromatch.braceExpand = (pattern, options) => {
                if (typeof pattern !== "string")
                    throw new TypeError("Expected a string");
                return micromatch.braces(pattern, { ...options, expand: true });
            };

            /**
             * Expose micromatch
             */

            // exposed for tests
            micromatch.hasBraces = hasBraces;
            module.exports = micromatch;

            /***/
        },

        /***/ 5277: /***/ (module) => {
            let p = process || {},
                argv = p.argv || [],
                env = p.env || {};
            let isColorSupported =
                !(!!env.NO_COLOR || argv.includes("--no-color")) &&
                (!!env.FORCE_COLOR ||
                    argv.includes("--color") ||
                    p.platform === "win32" ||
                    ((p.stdout || {}).isTTY && env.TERM !== "dumb") ||
                    !!env.CI);

            let formatter =
                (open, close, replace = open) =>
                (input) => {
                    let string = "" + input,
                        index = string.indexOf(close, open.length);
                    return ~index
                        ? open +
                              replaceClose(string, close, replace, index) +
                              close
                        : open + string + close;
                };

            let replaceClose = (string, close, replace, index) => {
                let result = "",
                    cursor = 0;
                do {
                    result += string.substring(cursor, index) + replace;
                    cursor = index + close.length;
                    index = string.indexOf(close, cursor);
                } while (~index);
                return result + string.substring(cursor);
            };

            let createColors = (enabled = isColorSupported) => {
                let f = enabled ? formatter : () => String;
                return {
                    isColorSupported: enabled,
                    reset: f("\x1b[0m", "\x1b[0m"),
                    bold: f("\x1b[1m", "\x1b[22m", "\x1b[22m\x1b[1m"),
                    dim: f("\x1b[2m", "\x1b[22m", "\x1b[22m\x1b[2m"),
                    italic: f("\x1b[3m", "\x1b[23m"),
                    underline: f("\x1b[4m", "\x1b[24m"),
                    inverse: f("\x1b[7m", "\x1b[27m"),
                    hidden: f("\x1b[8m", "\x1b[28m"),
                    strikethrough: f("\x1b[9m", "\x1b[29m"),

                    black: f("\x1b[30m", "\x1b[39m"),
                    red: f("\x1b[31m", "\x1b[39m"),
                    green: f("\x1b[32m", "\x1b[39m"),
                    yellow: f("\x1b[33m", "\x1b[39m"),
                    blue: f("\x1b[34m", "\x1b[39m"),
                    magenta: f("\x1b[35m", "\x1b[39m"),
                    cyan: f("\x1b[36m", "\x1b[39m"),
                    white: f("\x1b[37m", "\x1b[39m"),
                    gray: f("\x1b[90m", "\x1b[39m"),

                    bgBlack: f("\x1b[40m", "\x1b[49m"),
                    bgRed: f("\x1b[41m", "\x1b[49m"),
                    bgGreen: f("\x1b[42m", "\x1b[49m"),
                    bgYellow: f("\x1b[43m", "\x1b[49m"),
                    bgBlue: f("\x1b[44m", "\x1b[49m"),
                    bgMagenta: f("\x1b[45m", "\x1b[49m"),
                    bgCyan: f("\x1b[46m", "\x1b[49m"),
                    bgWhite: f("\x1b[47m", "\x1b[49m"),

                    blackBright: f("\x1b[90m", "\x1b[39m"),
                    redBright: f("\x1b[91m", "\x1b[39m"),
                    greenBright: f("\x1b[92m", "\x1b[39m"),
                    yellowBright: f("\x1b[93m", "\x1b[39m"),
                    blueBright: f("\x1b[94m", "\x1b[39m"),
                    magentaBright: f("\x1b[95m", "\x1b[39m"),
                    cyanBright: f("\x1b[96m", "\x1b[39m"),
                    whiteBright: f("\x1b[97m", "\x1b[39m"),

                    bgBlackBright: f("\x1b[100m", "\x1b[49m"),
                    bgRedBright: f("\x1b[101m", "\x1b[49m"),
                    bgGreenBright: f("\x1b[102m", "\x1b[49m"),
                    bgYellowBright: f("\x1b[103m", "\x1b[49m"),
                    bgBlueBright: f("\x1b[104m", "\x1b[49m"),
                    bgMagentaBright: f("\x1b[105m", "\x1b[49m"),
                    bgCyanBright: f("\x1b[106m", "\x1b[49m"),
                    bgWhiteBright: f("\x1b[107m", "\x1b[49m")
                };
            };

            module.exports = createColors();
            module.exports.createColors = createColors;

            /***/
        },

        /***/ 2149: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            module.exports = __nccwpck_require__(723);

            /***/
        },

        /***/ 6420: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const path = __nccwpck_require__(6928);
            const WIN_SLASH = "\\\\/";
            const WIN_NO_SLASH = `[^${WIN_SLASH}]`;

            /**
             * Posix glob regex
             */

            const DOT_LITERAL = "\\.";
            const PLUS_LITERAL = "\\+";
            const QMARK_LITERAL = "\\?";
            const SLASH_LITERAL = "\\/";
            const ONE_CHAR = "(?=.)";
            const QMARK = "[^/]";
            const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
            const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
            const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
            const NO_DOT = `(?!${DOT_LITERAL})`;
            const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
            const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
            const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
            const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
            const STAR = `${QMARK}*?`;

            const POSIX_CHARS = {
                DOT_LITERAL,
                PLUS_LITERAL,
                QMARK_LITERAL,
                SLASH_LITERAL,
                ONE_CHAR,
                QMARK,
                END_ANCHOR,
                DOTS_SLASH,
                NO_DOT,
                NO_DOTS,
                NO_DOT_SLASH,
                NO_DOTS_SLASH,
                QMARK_NO_DOT,
                STAR,
                START_ANCHOR
            };

            /**
             * Windows glob regex
             */

            const WINDOWS_CHARS = {
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

            /**
             * POSIX Bracket Regex
             */

            const POSIX_REGEX_SOURCE = {
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
            };

            module.exports = {
                MAX_LENGTH: 1024 * 64,
                POSIX_REGEX_SOURCE,

                // regular expressions
                REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
                REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
                REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
                REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
                REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
                REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,

                // Replace globs with equivalent patterns to reduce parsing time.
                REPLACEMENTS: {
                    "***": "*",
                    "**/**": "**",
                    "**/**/**": "**"
                },

                // Digits
                CHAR_0: 48 /* 0 */,
                CHAR_9: 57 /* 9 */,

                // Alphabet chars.
                CHAR_UPPERCASE_A: 65 /* A */,
                CHAR_LOWERCASE_A: 97 /* a */,
                CHAR_UPPERCASE_Z: 90 /* Z */,
                CHAR_LOWERCASE_Z: 122 /* z */,

                CHAR_LEFT_PARENTHESES: 40 /* ( */,
                CHAR_RIGHT_PARENTHESES: 41 /* ) */,

                CHAR_ASTERISK: 42 /* * */,

                // Non-alphabetic chars.
                CHAR_AMPERSAND: 38 /* & */,
                CHAR_AT: 64 /* @ */,
                CHAR_BACKWARD_SLASH: 92 /* \ */,
                CHAR_CARRIAGE_RETURN: 13 /* \r */,
                CHAR_CIRCUMFLEX_ACCENT: 94 /* ^ */,
                CHAR_COLON: 58 /* : */,
                CHAR_COMMA: 44 /* , */,
                CHAR_DOT: 46 /* . */,
                CHAR_DOUBLE_QUOTE: 34 /* " */,
                CHAR_EQUAL: 61 /* = */,
                CHAR_EXCLAMATION_MARK: 33 /* ! */,
                CHAR_FORM_FEED: 12 /* \f */,
                CHAR_FORWARD_SLASH: 47 /* / */,
                CHAR_GRAVE_ACCENT: 96 /* ` */,
                CHAR_HASH: 35 /* # */,
                CHAR_HYPHEN_MINUS: 45 /* - */,
                CHAR_LEFT_ANGLE_BRACKET: 60 /* < */,
                CHAR_LEFT_CURLY_BRACE: 123 /* { */,
                CHAR_LEFT_SQUARE_BRACKET: 91 /* [ */,
                CHAR_LINE_FEED: 10 /* \n */,
                CHAR_NO_BREAK_SPACE: 160 /* \u00A0 */,
                CHAR_PERCENT: 37 /* % */,
                CHAR_PLUS: 43 /* + */,
                CHAR_QUESTION_MARK: 63 /* ? */,
                CHAR_RIGHT_ANGLE_BRACKET: 62 /* > */,
                CHAR_RIGHT_CURLY_BRACE: 125 /* } */,
                CHAR_RIGHT_SQUARE_BRACKET: 93 /* ] */,
                CHAR_SEMICOLON: 59 /* ; */,
                CHAR_SINGLE_QUOTE: 39 /* ' */,
                CHAR_SPACE: 32 /*   */,
                CHAR_TAB: 9 /* \t */,
                CHAR_UNDERSCORE: 95 /* _ */,
                CHAR_VERTICAL_LINE: 124 /* | */,
                CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279 /* \uFEFF */,

                SEP: path.sep,

                /**
                 * Create EXTGLOB_CHARS
                 */

                extglobChars(chars) {
                    return {
                        "!": {
                            type: "negate",
                            open: "(?:(?!(?:",
                            close: `))${chars.STAR})`
                        },
                        "?": { type: "qmark", open: "(?:", close: ")?" },
                        "+": { type: "plus", open: "(?:", close: ")+" },
                        "*": { type: "star", open: "(?:", close: ")*" },
                        "@": { type: "at", open: "(?:", close: ")" }
                    };
                },

                /**
                 * Create GLOB_CHARS
                 */

                globChars(win32) {
                    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
                }
            };

            /***/
        },

        /***/ 7778: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const constants = __nccwpck_require__(6420);
            const utils = __nccwpck_require__(7976);

            /**
             * Constants
             */

            const {
                MAX_LENGTH,
                POSIX_REGEX_SOURCE,
                REGEX_NON_SPECIAL_CHARS,
                REGEX_SPECIAL_CHARS_BACKREF,
                REPLACEMENTS
            } = constants;

            /**
             * Helpers
             */

            const expandRange = (args, options) => {
                if (typeof options.expandRange === "function") {
                    return options.expandRange(...args, options);
                }

                args.sort();
                const value = `[${args.join("-")}]`;

                try {
                    /* eslint-disable-next-line no-new */
                    new RegExp(value);
                } catch (ex) {
                    return args.map((v) => utils.escapeRegex(v)).join("..");
                }

                return value;
            };

            /**
             * Create the message for a syntax error
             */

            const syntaxError = (type, char) => {
                return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
            };

            /**
             * Parse the given input string.
             * @param {String} input
             * @param {Object} options
             * @return {Object}
             */

            const parse = (input, options) => {
                if (typeof input !== "string") {
                    throw new TypeError("Expected a string");
                }

                input = REPLACEMENTS[input] || input;

                const opts = { ...options };
                const max =
                    typeof opts.maxLength === "number"
                        ? Math.min(MAX_LENGTH, opts.maxLength)
                        : MAX_LENGTH;

                let len = input.length;
                if (len > max) {
                    throw new SyntaxError(
                        `Input length: ${len}, exceeds maximum allowed length: ${max}`
                    );
                }

                const bos = {
                    type: "bos",
                    value: "",
                    output: opts.prepend || ""
                };
                const tokens = [bos];

                const capture = opts.capture ? "" : "?:";
                const win32 = utils.isWindows(options);

                // create constants based on platform, for windows or posix
                const PLATFORM_CHARS = constants.globChars(win32);
                const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);

                const {
                    DOT_LITERAL,
                    PLUS_LITERAL,
                    SLASH_LITERAL,
                    ONE_CHAR,
                    DOTS_SLASH,
                    NO_DOT,
                    NO_DOT_SLASH,
                    NO_DOTS_SLASH,
                    QMARK,
                    QMARK_NO_DOT,
                    STAR,
                    START_ANCHOR
                } = PLATFORM_CHARS;

                const globstar = (opts) => {
                    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
                };

                const nodot = opts.dot ? "" : NO_DOT;
                const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
                let star = opts.bash === true ? globstar(opts) : STAR;

                if (opts.capture) {
                    star = `(${star})`;
                }

                // minimatch options support
                if (typeof opts.noext === "boolean") {
                    opts.noextglob = opts.noext;
                }

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
                const peek = (state.peek = (n = 1) => input[state.index + n]);
                const advance = (state.advance = () =>
                    input[++state.index] || "");
                const remaining = () => input.slice(state.index + 1);
                const consume = (value = "", num = 0) => {
                    state.consumed += value;
                    state.index += num;
                };

                const append = (token) => {
                    state.output +=
                        token.output != null ? token.output : token.value;
                    consume(token.value);
                };

                const negate = () => {
                    let count = 1;

                    while (
                        peek() === "!" &&
                        (peek(2) !== "(" || peek(3) === "?")
                    ) {
                        advance();
                        state.start++;
                        count++;
                    }

                    if (count % 2 === 0) {
                        return false;
                    }

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
                        const isBrace =
                            state.braces > 0 &&
                            (tok.type === "comma" || tok.type === "brace");
                        const isExtglob =
                            tok.extglob === true ||
                            (extglobs.length &&
                                (tok.type === "pipe" || tok.type === "paren"));

                        if (
                            tok.type !== "slash" &&
                            tok.type !== "paren" &&
                            !isBrace &&
                            !isExtglob
                        ) {
                            state.output = state.output.slice(
                                0,
                                -prev.output.length
                            );
                            prev.type = "star";
                            prev.value = "*";
                            prev.output = star;
                            state.output += prev.output;
                        }
                    }

                    if (extglobs.length && tok.type !== "paren") {
                        extglobs[extglobs.length - 1].inner += tok.value;
                    }

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
                    const output = (opts.capture ? "(" : "") + token.open;

                    increment("parens");
                    push({ type, value, output: state.output ? "" : ONE_CHAR });
                    push({
                        type: "paren",
                        extglob: true,
                        value: advance(),
                        output
                    });
                    extglobs.push(token);
                };

                const extglobClose = (token) => {
                    let output = token.close + (opts.capture ? ")" : "");
                    let rest;

                    if (token.type === "negate") {
                        let extglobStar = star;

                        if (
                            token.inner &&
                            token.inner.length > 1 &&
                            token.inner.includes("/")
                        ) {
                            extglobStar = globstar(opts);
                        }

                        if (
                            extglobStar !== star ||
                            eos() ||
                            /^\)+$/.test(remaining())
                        ) {
                            output = token.close = `)$))${extglobStar}`;
                        }

                        if (
                            token.inner.includes("*") &&
                            (rest = remaining()) &&
                            /^\.[^\\/.]+$/.test(rest)
                        ) {
                            // Any non-magical string (`.ts`) or even nested expression (`.{ts,tsx}`) can follow after the closing parenthesis.
                            // In this case, we need to parse the string and use it in the output of the original pattern.
                            // Suitable patterns: `/!(*.d).ts`, `/!(*.d).{ts,tsx}`, `**/!(*-dbg).@(js)`.
                            //
                            // Disabling the `fastpaths` option due to a problem with parsing strings as `.ts` in the pattern like `**/!(*.d).ts`.
                            const expression = parse(rest, {
                                ...options,
                                fastpaths: false
                            }).output;

                            output =
                                token.close = `)${expression})${extglobStar})`;
                        }

                        if (token.prev.type === "bos") {
                            state.negatedExtglob = true;
                        }
                    }

                    push({ type: "paren", extglob: true, value, output });
                    decrement("parens");
                };

                /**
                 * Fast paths
                 */

                if (
                    opts.fastpaths !== false &&
                    !/(^[*!]|[/()[\]{}"])/.test(input)
                ) {
                    let backslashes = false;

                    let output = input.replace(
                        REGEX_SPECIAL_CHARS_BACKREF,
                        (m, esc, chars, first, rest, index) => {
                            if (first === "\\") {
                                backslashes = true;
                                return m;
                            }

                            if (first === "?") {
                                if (esc) {
                                    return (
                                        esc +
                                        first +
                                        (rest ? QMARK.repeat(rest.length) : "")
                                    );
                                }
                                if (index === 0) {
                                    return (
                                        qmarkNoDot +
                                        (rest ? QMARK.repeat(rest.length) : "")
                                    );
                                }
                                return QMARK.repeat(chars.length);
                            }

                            if (first === ".") {
                                return DOT_LITERAL.repeat(chars.length);
                            }

                            if (first === "*") {
                                if (esc) {
                                    return esc + first + (rest ? star : "");
                                }
                                return star;
                            }
                            return esc ? m : `\\${m}`;
                        }
                    );

                    if (backslashes === true) {
                        if (opts.unescape === true) {
                            output = output.replace(/\\/g, "");
                        } else {
                            output = output.replace(/\\+/g, (m) => {
                                return m.length % 2 === 0
                                    ? "\\\\"
                                    : m
                                      ? "\\"
                                      : "";
                            });
                        }
                    }

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

                    if (value === "\u0000") {
                        continue;
                    }

                    /**
                     * Escaped characters
                     */

                    if (value === "\\") {
                        const next = peek();

                        if (next === "/" && opts.bash !== true) {
                            continue;
                        }

                        if (next === "." || next === ";") {
                            continue;
                        }

                        if (!next) {
                            value += "\\";
                            push({ type: "text", value });
                            continue;
                        }

                        // collapse slashes to reduce potential for exploits
                        const match = /^\\+/.exec(remaining());
                        let slashes = 0;

                        if (match && match[0].length > 2) {
                            slashes = match[0].length;
                            state.index += slashes;
                            if (slashes % 2 !== 0) {
                                value += "\\";
                            }
                        }

                        if (opts.unescape === true) {
                            value = advance();
                        } else {
                            value += advance();
                        }

                        if (state.brackets === 0) {
                            push({ type: "text", value });
                            continue;
                        }
                    }

                    /**
                     * If we're inside a regex character class, continue
                     * until we reach the closing bracket.
                     */

                    if (
                        state.brackets > 0 &&
                        (value !== "]" ||
                            prev.value === "[" ||
                            prev.value === "[^")
                    ) {
                        if (opts.posix !== false && value === ":") {
                            const inner = prev.value.slice(1);
                            if (inner.includes("[")) {
                                prev.posix = true;

                                if (inner.includes(":")) {
                                    const idx = prev.value.lastIndexOf("[");
                                    const pre = prev.value.slice(0, idx);
                                    const rest = prev.value.slice(idx + 2);
                                    const posix = POSIX_REGEX_SOURCE[rest];
                                    if (posix) {
                                        prev.value = pre + posix;
                                        state.backtrack = true;
                                        advance();

                                        if (
                                            !bos.output &&
                                            tokens.indexOf(prev) === 1
                                        ) {
                                            bos.output = ONE_CHAR;
                                        }
                                        continue;
                                    }
                                }
                            }
                        }

                        if (
                            (value === "[" && peek() !== ":") ||
                            (value === "-" && peek() === "]")
                        ) {
                            value = `\\${value}`;
                        }

                        if (
                            value === "]" &&
                            (prev.value === "[" || prev.value === "[^")
                        ) {
                            value = `\\${value}`;
                        }

                        if (
                            opts.posix === true &&
                            value === "!" &&
                            prev.value === "["
                        ) {
                            value = "^";
                        }

                        prev.value += value;
                        append({ value });
                        continue;
                    }

                    /**
                     * If we're inside a quoted string, continue
                     * until we reach the closing double quote.
                     */

                    if (state.quotes === 1 && value !== '"') {
                        value = utils.escapeRegex(value);
                        prev.value += value;
                        append({ value });
                        continue;
                    }

                    /**
                     * Double quotes
                     */

                    if (value === '"') {
                        state.quotes = state.quotes === 1 ? 0 : 1;
                        if (opts.keepQuotes === true) {
                            push({ type: "text", value });
                        }
                        continue;
                    }

                    /**
                     * Parentheses
                     */

                    if (value === "(") {
                        increment("parens");
                        push({ type: "paren", value });
                        continue;
                    }

                    if (value === ")") {
                        if (
                            state.parens === 0 &&
                            opts.strictBrackets === true
                        ) {
                            throw new SyntaxError(syntaxError("opening", "("));
                        }

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
                        if (
                            opts.nobracket === true ||
                            !remaining().includes("]")
                        ) {
                            if (
                                opts.nobracket !== true &&
                                opts.strictBrackets === true
                            ) {
                                throw new SyntaxError(
                                    syntaxError("closing", "]")
                                );
                            }

                            value = `\\${value}`;
                        } else {
                            increment("brackets");
                        }

                        push({ type: "bracket", value });
                        continue;
                    }

                    if (value === "]") {
                        if (
                            opts.nobracket === true ||
                            (prev &&
                                prev.type === "bracket" &&
                                prev.value.length === 1)
                        ) {
                            push({ type: "text", value, output: `\\${value}` });
                            continue;
                        }

                        if (state.brackets === 0) {
                            if (opts.strictBrackets === true) {
                                throw new SyntaxError(
                                    syntaxError("opening", "[")
                                );
                            }

                            push({ type: "text", value, output: `\\${value}` });
                            continue;
                        }

                        decrement("brackets");

                        const prevValue = prev.value.slice(1);
                        if (
                            prev.posix !== true &&
                            prevValue[0] === "^" &&
                            !prevValue.includes("/")
                        ) {
                            value = `/${value}`;
                        }

                        prev.value += value;
                        append({ value });

                        // when literal brackets are explicitly disabled
                        // assume we should match with a regex character class
                        if (
                            opts.literalBrackets === false ||
                            utils.hasRegexChars(prevValue)
                        ) {
                            continue;
                        }

                        const escaped = utils.escapeRegex(prev.value);
                        state.output = state.output.slice(
                            0,
                            -prev.value.length
                        );

                        // when literal brackets are explicitly enabled
                        // assume we should escape the brackets to match literal characters
                        if (opts.literalBrackets === true) {
                            state.output += escaped;
                            prev.value = escaped;
                            continue;
                        }

                        // when the user specifies nothing, try to match both
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
                            push({ type: "text", value, output: value });
                            continue;
                        }

                        let output = ")";

                        if (brace.dots === true) {
                            const arr = tokens.slice();
                            const range = [];

                            for (let i = arr.length - 1; i >= 0; i--) {
                                tokens.pop();
                                if (arr[i].type === "brace") {
                                    break;
                                }
                                if (arr[i].type !== "dots") {
                                    range.unshift(arr[i].value);
                                }
                            }

                            output = expandRange(range, opts);
                            state.backtrack = true;
                        }

                        if (brace.comma !== true && brace.dots !== true) {
                            const out = state.output.slice(
                                0,
                                brace.outputIndex
                            );
                            const toks = state.tokens.slice(brace.tokensIndex);
                            brace.value = brace.output = "\\{";
                            value = output = "\\}";
                            state.output = out;
                            for (const t of toks) {
                                state.output += t.output || t.value;
                            }
                        }

                        push({ type: "brace", value, output });
                        decrement("braces");
                        braces.pop();
                        continue;
                    }

                    /**
                     * Pipes
                     */

                    if (value === "|") {
                        if (extglobs.length > 0) {
                            extglobs[extglobs.length - 1].conditions++;
                        }
                        push({ type: "text", value });
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

                        push({ type: "comma", value, output });
                        continue;
                    }

                    /**
                     * Slashes
                     */

                    if (value === "/") {
                        // if the beginning of the glob is "./", advance the start
                        // to the current index, and don't add the "./" characters
                        // to the state. This greatly simplifies lookbehinds when
                        // checking for BOS characters like "!" and "." (not "./")
                        if (
                            prev.type === "dot" &&
                            state.index === state.start + 1
                        ) {
                            state.start = state.index + 1;
                            state.consumed = "";
                            state.output = "";
                            tokens.pop();
                            prev = bos; // reset "prev" to the first token
                            continue;
                        }

                        push({ type: "slash", value, output: SLASH_LITERAL });
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

                        if (
                            state.braces + state.parens === 0 &&
                            prev.type !== "bos" &&
                            prev.type !== "slash"
                        ) {
                            push({ type: "text", value, output: DOT_LITERAL });
                            continue;
                        }

                        push({ type: "dot", value, output: DOT_LITERAL });
                        continue;
                    }

                    /**
                     * Question marks
                     */

                    if (value === "?") {
                        const isGroup = prev && prev.value === "(";
                        if (
                            !isGroup &&
                            opts.noextglob !== true &&
                            peek() === "(" &&
                            peek(2) !== "?"
                        ) {
                            extglobOpen("qmark", value);
                            continue;
                        }

                        if (prev && prev.type === "paren") {
                            const next = peek();
                            let output = value;

                            if (next === "<" && !utils.supportsLookbehinds()) {
                                throw new Error(
                                    "Node.js v10 or higher is required for regex lookbehinds"
                                );
                            }

                            if (
                                (prev.value === "(" && !/[!=<:]/.test(next)) ||
                                (next === "<" &&
                                    !/<([!=]|\w+>)/.test(remaining()))
                            ) {
                                output = `\\${value}`;
                            }

                            push({ type: "text", value, output });
                            continue;
                        }

                        if (
                            opts.dot !== true &&
                            (prev.type === "slash" || prev.type === "bos")
                        ) {
                            push({
                                type: "qmark",
                                value,
                                output: QMARK_NO_DOT
                            });
                            continue;
                        }

                        push({ type: "qmark", value, output: QMARK });
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
                        if (
                            opts.noextglob !== true &&
                            peek() === "(" &&
                            peek(2) !== "?"
                        ) {
                            extglobOpen("plus", value);
                            continue;
                        }

                        if (
                            (prev && prev.value === "(") ||
                            opts.regex === false
                        ) {
                            push({ type: "plus", value, output: PLUS_LITERAL });
                            continue;
                        }

                        if (
                            (prev &&
                                (prev.type === "bracket" ||
                                    prev.type === "paren" ||
                                    prev.type === "brace")) ||
                            state.parens > 0
                        ) {
                            push({ type: "plus", value });
                            continue;
                        }

                        push({ type: "plus", value: PLUS_LITERAL });
                        continue;
                    }

                    /**
                     * Plain text
                     */

                    if (value === "@") {
                        if (
                            opts.noextglob !== true &&
                            peek() === "(" &&
                            peek(2) !== "?"
                        ) {
                            push({
                                type: "at",
                                extglob: true,
                                value,
                                output: ""
                            });
                            continue;
                        }

                        push({ type: "text", value });
                        continue;
                    }

                    /**
                     * Plain text
                     */

                    if (value !== "*") {
                        if (value === "$" || value === "^") {
                            value = `\\${value}`;
                        }

                        const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
                        if (match) {
                            value += match[0];
                            state.index += match[0].length;
                        }

                        push({ type: "text", value });
                        continue;
                    }

                    /**
                     * Stars
                     */

                    if (
                        prev &&
                        (prev.type === "globstar" || prev.star === true)
                    ) {
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
                        const isStart =
                            prior.type === "slash" || prior.type === "bos";
                        const afterStar =
                            before &&
                            (before.type === "star" ||
                                before.type === "globstar");

                        if (
                            opts.bash === true &&
                            (!isStart || (rest[0] && rest[0] !== "/"))
                        ) {
                            push({ type: "star", value, output: "" });
                            continue;
                        }

                        const isBrace =
                            state.braces > 0 &&
                            (prior.type === "comma" || prior.type === "brace");
                        const isExtglob =
                            extglobs.length &&
                            (prior.type === "pipe" || prior.type === "paren");
                        if (
                            !isStart &&
                            prior.type !== "paren" &&
                            !isBrace &&
                            !isExtglob
                        ) {
                            push({ type: "star", value, output: "" });
                            continue;
                        }

                        // strip consecutive `/**/`
                        while (rest.slice(0, 3) === "/**") {
                            const after = input[state.index + 4];
                            if (after && after !== "/") {
                                break;
                            }
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

                        if (
                            prior.type === "slash" &&
                            prior.prev.type !== "bos" &&
                            !afterStar &&
                            eos()
                        ) {
                            state.output = state.output.slice(
                                0,
                                -(prior.output + prev.output).length
                            );
                            prior.output = `(?:${prior.output}`;

                            prev.type = "globstar";
                            prev.output =
                                globstar(opts) +
                                (opts.strictSlashes ? ")" : "|$)");
                            prev.value += value;
                            state.globstar = true;
                            state.output += prior.output + prev.output;
                            consume(value);
                            continue;
                        }

                        if (
                            prior.type === "slash" &&
                            prior.prev.type !== "bos" &&
                            rest[0] === "/"
                        ) {
                            const end = rest[1] !== void 0 ? "|$" : "";

                            state.output = state.output.slice(
                                0,
                                -(prior.output + prev.output).length
                            );
                            prior.output = `(?:${prior.output}`;

                            prev.type = "globstar";
                            prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
                            prev.value += value;

                            state.output += prior.output + prev.output;
                            state.globstar = true;

                            consume(value + advance());

                            push({ type: "slash", value: "/", output: "" });
                            continue;
                        }

                        if (prior.type === "bos" && rest[0] === "/") {
                            prev.type = "globstar";
                            prev.value += value;
                            prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
                            state.output = prev.output;
                            state.globstar = true;
                            consume(value + advance());
                            push({ type: "slash", value: "/", output: "" });
                            continue;
                        }

                        // remove single star from output
                        state.output = state.output.slice(
                            0,
                            -prev.output.length
                        );

                        // reset previous token to globstar
                        prev.type = "globstar";
                        prev.output = globstar(opts);
                        prev.value += value;

                        // reset output with globstar
                        state.output += prev.output;
                        state.globstar = true;
                        consume(value);
                        continue;
                    }

                    const token = { type: "star", value, output: star };

                    if (opts.bash === true) {
                        token.output = ".*?";
                        if (prev.type === "bos" || prev.type === "slash") {
                            token.output = nodot + token.output;
                        }
                        push(token);
                        continue;
                    }

                    if (
                        prev &&
                        (prev.type === "bracket" || prev.type === "paren") &&
                        opts.regex === true
                    ) {
                        token.output = value;
                        push(token);
                        continue;
                    }

                    if (
                        state.index === state.start ||
                        prev.type === "slash" ||
                        prev.type === "dot"
                    ) {
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
                    if (opts.strictBrackets === true)
                        throw new SyntaxError(syntaxError("closing", "]"));
                    state.output = utils.escapeLast(state.output, "[");
                    decrement("brackets");
                }

                while (state.parens > 0) {
                    if (opts.strictBrackets === true)
                        throw new SyntaxError(syntaxError("closing", ")"));
                    state.output = utils.escapeLast(state.output, "(");
                    decrement("parens");
                }

                while (state.braces > 0) {
                    if (opts.strictBrackets === true)
                        throw new SyntaxError(syntaxError("closing", "}"));
                    state.output = utils.escapeLast(state.output, "{");
                    decrement("braces");
                }

                if (
                    opts.strictSlashes !== true &&
                    (prev.type === "star" || prev.type === "bracket")
                ) {
                    push({
                        type: "maybe_slash",
                        value: "",
                        output: `${SLASH_LITERAL}?`
                    });
                }

                // rebuild the output if we had to backtrack at any point
                if (state.backtrack === true) {
                    state.output = "";

                    for (const token of state.tokens) {
                        state.output +=
                            token.output != null ? token.output : token.value;

                        if (token.suffix) {
                            state.output += token.suffix;
                        }
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
                const max =
                    typeof opts.maxLength === "number"
                        ? Math.min(MAX_LENGTH, opts.maxLength)
                        : MAX_LENGTH;
                const len = input.length;
                if (len > max) {
                    throw new SyntaxError(
                        `Input length: ${len}, exceeds maximum allowed length: ${max}`
                    );
                }

                input = REPLACEMENTS[input] || input;
                const win32 = utils.isWindows(options);

                // create constants based on platform, for windows or posix
                const {
                    DOT_LITERAL,
                    SLASH_LITERAL,
                    ONE_CHAR,
                    DOTS_SLASH,
                    NO_DOT,
                    NO_DOTS,
                    NO_DOTS_SLASH,
                    STAR,
                    START_ANCHOR
                } = constants.globChars(win32);

                const nodot = opts.dot ? NO_DOTS : NO_DOT;
                const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
                const capture = opts.capture ? "" : "?:";
                const state = { negated: false, prefix: "" };
                let star = opts.bash === true ? ".*?" : STAR;

                if (opts.capture) {
                    star = `(${star})`;
                }

                const globstar = (opts) => {
                    if (opts.noglobstar === true) return star;
                    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
                };

                const create = (str) => {
                    switch (str) {
                        case "*":
                            return `${nodot}${ONE_CHAR}${star}`;

                        case ".*":
                            return `${DOT_LITERAL}${ONE_CHAR}${star}`;

                        case "*.*":
                            return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

                        case "*/*":
                            return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

                        case "**":
                            return nodot + globstar(opts);

                        case "**/*":
                            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

                        case "**/*.*":
                            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

                        case "**/.*":
                            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

                        default: {
                            const match = /^(.*?)\.(\w+)$/.exec(str);
                            if (!match) return;

                            const source = create(match[1]);
                            if (!source) return;

                            return source + DOT_LITERAL + match[2];
                        }
                    }
                };

                const output = utils.removePrefix(input, state);
                let source = create(output);

                if (source && opts.strictSlashes !== true) {
                    source += `${SLASH_LITERAL}?`;
                }

                return source;
            };

            module.exports = parse;

            /***/
        },

        /***/ 723: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const path = __nccwpck_require__(6928);
            const scan = __nccwpck_require__(1488);
            const parse = __nccwpck_require__(7778);
            const utils = __nccwpck_require__(7976);
            const constants = __nccwpck_require__(6420);
            const isObject = (val) =>
                val && typeof val === "object" && !Array.isArray(val);

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

            const picomatch = (glob, options, returnState = false) => {
                if (Array.isArray(glob)) {
                    const fns = glob.map((input) =>
                        picomatch(input, options, returnState)
                    );
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

                if (glob === "" || (typeof glob !== "string" && !isState)) {
                    throw new TypeError(
                        "Expected pattern to be a non-empty string"
                    );
                }

                const opts = options || {};
                const posix = utils.isWindows(options);
                const regex = isState
                    ? picomatch.compileRe(glob, options)
                    : picomatch.makeRe(glob, options, false, true);

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
                    const { isMatch, match, output } = picomatch.test(
                        input,
                        regex,
                        options,
                        { glob, posix }
                    );
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

                    if (typeof opts.onResult === "function") {
                        opts.onResult(result);
                    }

                    if (isMatch === false) {
                        result.isMatch = false;
                        return returnObject ? result : false;
                    }

                    if (isIgnored(input)) {
                        if (typeof opts.onIgnore === "function") {
                            opts.onIgnore(result);
                        }
                        result.isMatch = false;
                        return returnObject ? result : false;
                    }

                    if (typeof opts.onMatch === "function") {
                        opts.onMatch(result);
                    }
                    return returnObject ? result : true;
                };

                if (returnState) {
                    matcher.state = state;
                }

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
                if (typeof input !== "string") {
                    throw new TypeError("Expected input to be a string");
                }

                if (input === "") {
                    return { isMatch: false, output: "" };
                }

                const opts = options || {};
                const format =
                    opts.format || (posix ? utils.toPosixSlashes : null);
                let match = input === glob;
                let output = match && format ? format(input) : input;

                if (match === false) {
                    output = format ? format(input) : input;
                    match = output === glob;
                }

                if (match === false || opts.capture === true) {
                    if (opts.matchBase === true || opts.basename === true) {
                        match = picomatch.matchBase(
                            input,
                            regex,
                            options,
                            posix
                        );
                    } else {
                        match = regex.exec(output);
                    }
                }

                return { isMatch: Boolean(match), match, output };
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

            picomatch.matchBase = (
                input,
                glob,
                options,
                posix = utils.isWindows(options)
            ) => {
                const regex =
                    glob instanceof RegExp
                        ? glob
                        : picomatch.makeRe(glob, options);
                return regex.test(path.basename(input));
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

            picomatch.isMatch = (str, patterns, options) =>
                picomatch(patterns, options)(str);

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
                if (Array.isArray(pattern))
                    return pattern.map((p) => picomatch.parse(p, options));
                return parse(pattern, { ...options, fastpaths: false });
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

            picomatch.compileRe = (
                state,
                options,
                returnOutput = false,
                returnState = false
            ) => {
                if (returnOutput === true) {
                    return state.output;
                }

                const opts = options || {};
                const prepend = opts.contains ? "" : "^";
                const append = opts.contains ? "" : "$";

                let source = `${prepend}(?:${state.output})${append}`;
                if (state && state.negated === true) {
                    source = `^(?!${source}).*$`;
                }

                const regex = picomatch.toRegex(source, options);
                if (returnState === true) {
                    regex.state = state;
                }

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

            picomatch.makeRe = (
                input,
                options = {},
                returnOutput = false,
                returnState = false
            ) => {
                if (!input || typeof input !== "string") {
                    throw new TypeError("Expected a non-empty string");
                }

                let parsed = { negated: false, fastpaths: true };

                if (
                    options.fastpaths !== false &&
                    (input[0] === "." || input[0] === "*")
                ) {
                    parsed.output = parse.fastpaths(input, options);
                }

                if (!parsed.output) {
                    parsed = parse(input, options);
                }

                return picomatch.compileRe(
                    parsed,
                    options,
                    returnOutput,
                    returnState
                );
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
                    return new RegExp(
                        source,
                        opts.flags || (opts.nocase ? "i" : "")
                    );
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

            /***/
        },

        /***/ 1488: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const utils = __nccwpck_require__(7976);
            const {
                CHAR_ASTERISK /* * */,
                CHAR_AT /* @ */,
                CHAR_BACKWARD_SLASH /* \ */,
                CHAR_COMMA /* , */,
                CHAR_DOT /* . */,
                CHAR_EXCLAMATION_MARK /* ! */,
                CHAR_FORWARD_SLASH /* / */,
                CHAR_LEFT_CURLY_BRACE /* { */,
                CHAR_LEFT_PARENTHESES /* ( */,
                CHAR_LEFT_SQUARE_BRACKET /* [ */,
                CHAR_PLUS /* + */,
                CHAR_QUESTION_MARK /* ? */,
                CHAR_RIGHT_CURLY_BRACE /* } */,
                CHAR_RIGHT_PARENTHESES /* ) */,
                CHAR_RIGHT_SQUARE_BRACKET /* ] */
            } = __nccwpck_require__(6420);

            const isPathSeparator = (code) => {
                return (
                    code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH
                );
            };

            const depth = (token) => {
                if (token.isPrefix !== true) {
                    token.depth = token.isGlobstar ? Infinity : 1;
                }
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

            const scan = (input, options) => {
                const opts = options || {};

                const length = input.length - 1;
                const scanToEnd =
                    opts.parts === true || opts.scanToEnd === true;
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
                let token = { value: "", depth: 0, isGlob: false };

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

                        if (code === CHAR_LEFT_CURLY_BRACE) {
                            braceEscaped = true;
                        }
                        continue;
                    }

                    if (
                        braceEscaped === true ||
                        code === CHAR_LEFT_CURLY_BRACE
                    ) {
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

                            if (
                                braceEscaped !== true &&
                                code === CHAR_DOT &&
                                (code = advance()) === CHAR_DOT
                            ) {
                                isBrace = token.isBrace = true;
                                isGlob = token.isGlob = true;
                                finished = true;

                                if (scanToEnd === true) {
                                    continue;
                                }

                                break;
                            }

                            if (braceEscaped !== true && code === CHAR_COMMA) {
                                isBrace = token.isBrace = true;
                                isGlob = token.isGlob = true;
                                finished = true;

                                if (scanToEnd === true) {
                                    continue;
                                }

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

                        if (scanToEnd === true) {
                            continue;
                        }

                        break;
                    }

                    if (code === CHAR_FORWARD_SLASH) {
                        slashes.push(index);
                        tokens.push(token);
                        token = { value: "", depth: 0, isGlob: false };

                        if (finished === true) continue;
                        if (prev === CHAR_DOT && index === start + 1) {
                            start += 2;
                            continue;
                        }

                        lastIndex = index + 1;
                        continue;
                    }

                    if (opts.noext !== true) {
                        const isExtglobChar =
                            code === CHAR_PLUS ||
                            code === CHAR_AT ||
                            code === CHAR_ASTERISK ||
                            code === CHAR_QUESTION_MARK ||
                            code === CHAR_EXCLAMATION_MARK;

                        if (
                            isExtglobChar === true &&
                            peek() === CHAR_LEFT_PARENTHESES
                        ) {
                            isGlob = token.isGlob = true;
                            isExtglob = token.isExtglob = true;
                            finished = true;
                            if (
                                code === CHAR_EXCLAMATION_MARK &&
                                index === start
                            ) {
                                negatedExtglob = true;
                            }

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
                        if (prev === CHAR_ASTERISK)
                            isGlobstar = token.isGlobstar = true;
                        isGlob = token.isGlob = true;
                        finished = true;

                        if (scanToEnd === true) {
                            continue;
                        }
                        break;
                    }

                    if (code === CHAR_QUESTION_MARK) {
                        isGlob = token.isGlob = true;
                        finished = true;

                        if (scanToEnd === true) {
                            continue;
                        }
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

                        if (scanToEnd === true) {
                            continue;
                        }

                        break;
                    }

                    if (
                        opts.nonegate !== true &&
                        code === CHAR_EXCLAMATION_MARK &&
                        index === start
                    ) {
                        negated = token.negated = true;
                        start++;
                        continue;
                    }

                    if (
                        opts.noparen !== true &&
                        code === CHAR_LEFT_PARENTHESES
                    ) {
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

                        if (scanToEnd === true) {
                            continue;
                        }

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
                } else {
                    base = str;
                }

                if (base && base !== "" && base !== "/" && base !== str) {
                    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
                        base = base.slice(0, -1);
                    }
                }

                if (opts.unescape === true) {
                    if (glob) glob = utils.removeBackslashes(glob);

                    if (base && backslashes === true) {
                        base = utils.removeBackslashes(base);
                    }
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
                    if (!isPathSeparator(code)) {
                        tokens.push(token);
                    }
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
                            } else {
                                tokens[idx].value = value;
                            }
                            depth(tokens[idx]);
                            state.maxDepth += tokens[idx].depth;
                        }
                        if (idx !== 0 || value !== "") {
                            parts.push(value);
                        }
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

            /***/
        },

        /***/ 7976: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const path = __nccwpck_require__(6928);
            const win32 = process.platform === "win32";
            const {
                REGEX_BACKSLASH,
                REGEX_REMOVE_BACKSLASH,
                REGEX_SPECIAL_CHARS,
                REGEX_SPECIAL_CHARS_GLOBAL
            } = __nccwpck_require__(6420);

            exports.isObject = (val) =>
                val !== null && typeof val === "object" && !Array.isArray(val);
            exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
            exports.isRegexChar = (str) =>
                str.length === 1 && exports.hasRegexChars(str);
            exports.escapeRegex = (str) =>
                str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
            exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");

            exports.removeBackslashes = (str) => {
                return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
                    return match === "\\" ? "" : match;
                });
            };

            exports.supportsLookbehinds = () => {
                const segs = process.version.slice(1).split(".").map(Number);
                if (
                    (segs.length === 3 && segs[0] >= 9) ||
                    (segs[0] === 8 && segs[1] >= 10)
                ) {
                    return true;
                }
                return false;
            };

            exports.isWindows = (options) => {
                if (options && typeof options.windows === "boolean") {
                    return options.windows;
                }
                return win32 === true || path.sep === "\\";
            };

            exports.escapeLast = (input, char, lastIdx) => {
                const idx = input.lastIndexOf(char, lastIdx);
                if (idx === -1) return input;
                if (input[idx - 1] === "\\")
                    return exports.escapeLast(input, char, idx - 1);
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
                const prepend = options.contains ? "" : "^";
                const append = options.contains ? "" : "$";

                let output = `${prepend}(?:${input})${append}`;
                if (state.negated === true) {
                    output = `(?:^(?!${output}).*$)`;
                }
                return output;
            };

            /***/
        },

        /***/ 4512: /***/ (module) => {
            "use strict";

            class DatePart {
                constructor({ token, date, parts, locales }) {
                    this.token = token;
                    this.date = date || new Date();
                    this.parts = parts || [this];
                    this.locales = locales || {};
                }

                up() {}

                down() {}

                next() {
                    const currentIdx = this.parts.indexOf(this);
                    return this.parts.find(
                        (part, idx) =>
                            idx > currentIdx && part instanceof DatePart
                    );
                }

                setTo(val) {}

                prev() {
                    let parts = [].concat(this.parts).reverse();
                    const currentIdx = parts.indexOf(this);
                    return parts.find(
                        (part, idx) =>
                            idx > currentIdx && part instanceof DatePart
                    );
                }

                toString() {
                    return String(this.date);
                }
            }

            module.exports = DatePart;

            /***/
        },

        /***/ 8691: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const DatePart = __nccwpck_require__(4512);

            const pos = (n) => {
                n = n % 10;
                return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
            };

            class Day extends DatePart {
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
                    return this.token === "DD"
                        ? String(date).padStart(2, "0")
                        : this.token === "Do"
                          ? date + pos(date)
                          : this.token === "d"
                            ? day + 1
                            : this.token === "ddd"
                              ? this.locales.weekdaysShort[day]
                              : this.token === "dddd"
                                ? this.locales.weekdays[day]
                                : date;
                }
            }

            module.exports = Day;

            /***/
        },

        /***/ 4550: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const DatePart = __nccwpck_require__(4512);

            class Hours extends DatePart {
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
                    return this.token.length > 1
                        ? String(hours).padStart(2, "0")
                        : hours;
                }
            }

            module.exports = Hours;

            /***/
        },

        /***/ 645: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            module.exports = {
                DatePart: __nccwpck_require__(4512),
                Meridiem: __nccwpck_require__(7007),
                Day: __nccwpck_require__(8691),
                Hours: __nccwpck_require__(4550),
                Milliseconds: __nccwpck_require__(6175),
                Minutes: __nccwpck_require__(5536),
                Month: __nccwpck_require__(6079),
                Seconds: __nccwpck_require__(2792),
                Year: __nccwpck_require__(9760)
            };

            /***/
        },

        /***/ 7007: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const DatePart = __nccwpck_require__(4512);

            class Meridiem extends DatePart {
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
                    return /\A/.test(this.token)
                        ? meridiem.toUpperCase()
                        : meridiem;
                }
            }

            module.exports = Meridiem;

            /***/
        },

        /***/ 6175: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const DatePart = __nccwpck_require__(4512);

            class Milliseconds extends DatePart {
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
                    this.date.setMilliseconds(
                        parseInt(val.substr(-this.token.length))
                    );
                }

                toString() {
                    return String(this.date.getMilliseconds())
                        .padStart(4, "0")
                        .substr(0, this.token.length);
                }
            }

            module.exports = Milliseconds;

            /***/
        },

        /***/ 5536: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const DatePart = __nccwpck_require__(4512);

            class Minutes extends DatePart {
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
                    return this.token.length > 1
                        ? String(m).padStart(2, "0")
                        : m;
                }
            }

            module.exports = Minutes;

            /***/
        },

        /***/ 6079: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const DatePart = __nccwpck_require__(4512);

            class Month extends DatePart {
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
                    return tl === 2
                        ? String(month + 1).padStart(2, "0")
                        : tl === 3
                          ? this.locales.monthsShort[month]
                          : tl === 4
                            ? this.locales.months[month]
                            : String(month + 1);
                }
            }

            module.exports = Month;

            /***/
        },

        /***/ 2792: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const DatePart = __nccwpck_require__(4512);

            class Seconds extends DatePart {
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
                    return this.token.length > 1
                        ? String(s).padStart(2, "0")
                        : s;
                }
            }

            module.exports = Seconds;

            /***/
        },

        /***/ 9760: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const DatePart = __nccwpck_require__(4512);

            class Year extends DatePart {
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
            }

            module.exports = Year;

            /***/
        },

        /***/ 2470: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            function asyncGeneratorStep(
                gen,
                resolve,
                reject,
                _next,
                _throw,
                key,
                arg
            ) {
                try {
                    var info = gen[key](arg);
                    var value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                if (info.done) {
                    resolve(value);
                } else {
                    Promise.resolve(value).then(_next, _throw);
                }
            }

            function _asyncToGenerator(fn) {
                return function () {
                    var self = this,
                        args = arguments;
                    return new Promise(function (resolve, reject) {
                        var gen = fn.apply(self, args);
                        function _next(value) {
                            asyncGeneratorStep(
                                gen,
                                resolve,
                                reject,
                                _next,
                                _throw,
                                "next",
                                value
                            );
                        }
                        function _throw(err) {
                            asyncGeneratorStep(
                                gen,
                                resolve,
                                reject,
                                _next,
                                _throw,
                                "throw",
                                err
                            );
                        }
                        _next(undefined);
                    });
                };
            }

            const color = __nccwpck_require__(1067);

            const Prompt = __nccwpck_require__(8200);

            const _require = __nccwpck_require__(7036),
                erase = _require.erase,
                cursor = _require.cursor;

            const _require2 = __nccwpck_require__(117),
                style = _require2.style,
                clear = _require2.clear,
                figures = _require2.figures,
                wrap = _require2.wrap,
                entriesToDisplay = _require2.entriesToDisplay;

            const getVal = (arr, i) =>
                arr[i] && (arr[i].value || arr[i].title || arr[i]);

            const getTitle = (arr, i) =>
                arr[i] && (arr[i].title || arr[i].value || arr[i]);

            const getIndex = (arr, valOrTitle) => {
                const index = arr.findIndex(
                    (el) => el.value === valOrTitle || el.title === valOrTitle
                );
                return index > -1 ? index : undefined;
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

            class AutocompletePrompt extends Prompt {
                constructor(opts = {}) {
                    super(opts);
                    this.msg = opts.message;
                    this.suggest = opts.suggest;
                    this.choices = opts.choices;
                    this.initial =
                        typeof opts.initial === "number"
                            ? opts.initial
                            : getIndex(opts.choices, opts.initial);
                    this.select = this.initial || opts.cursor || 0;
                    this.i18n = {
                        noMatches: opts.noMatches || "no matches found"
                    };
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
                    this._fb = Number.isSafeInteger(parseInt(fb))
                        ? parseInt(fb)
                        : fb;
                }

                get fallback() {
                    let choice;
                    if (typeof this._fb === "number")
                        choice = this.choices[this._fb];
                    else if (typeof this._fb === "string")
                        choice = {
                            title: this._fb
                        };
                    return (
                        choice ||
                        this._fb || {
                            title: this.i18n.noMatches
                        }
                    );
                }

                moveSelect(i) {
                    this.select = i;
                    if (this.suggestions.length > 0)
                        this.value = getVal(this.suggestions, i);
                    else this.value = this.fallback.value;
                    this.fire();
                }

                complete(cb) {
                    var _this = this;

                    return _asyncToGenerator(function* () {
                        const p = (_this.completing = _this.suggest(
                            _this.input,
                            _this.choices
                        ));

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
                        this.moveSelect(
                            this.initial !== void 0 ? this.initial : 0
                        );
                        this.render();
                    });
                    this.render();
                }

                exit() {
                    if (this.clearFirst && this.input.length > 0) {
                        this.reset();
                    } else {
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
                    let s2 = this.input.slice(this.cursor);
                    this.input = `${s1}${c}${s2}`;
                    this.cursor = s1.length + 1;
                    this.complete(this.render);
                    this.render();
                }

                delete() {
                    if (this.cursor === 0) return this.bell();
                    let s1 = this.input.slice(0, this.cursor - 1);
                    let s2 = this.input.slice(this.cursor);
                    this.input = `${s1}${s2}`;
                    this.complete(this.render);
                    this.cursor = this.cursor - 1;
                    this.render();
                }

                deleteForward() {
                    if (this.cursor * this.scale >= this.rendered.length)
                        return this.bell();
                    let s1 = this.input.slice(0, this.cursor);
                    let s2 = this.input.slice(this.cursor + 1);
                    this.input = `${s1}${s2}`;
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
                    if (this.select === 0) {
                        this.moveSelect(this.suggestions.length - 1);
                    } else {
                        this.moveSelect(this.select - 1);
                    }

                    this.render();
                }

                down() {
                    if (this.select === this.suggestions.length - 1) {
                        this.moveSelect(0);
                    } else {
                        this.moveSelect(this.select + 1);
                    }

                    this.render();
                }

                next() {
                    if (this.select === this.suggestions.length - 1) {
                        this.moveSelect(0);
                    } else this.moveSelect(this.select + 1);

                    this.render();
                }

                nextPage() {
                    this.moveSelect(
                        Math.min(
                            this.select + this.limit,
                            this.suggestions.length - 1
                        )
                    );
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
                    if (this.cursor * this.scale >= this.rendered.length)
                        return this.bell();
                    this.cursor = this.cursor + 1;
                    this.render();
                }

                renderOption(v, hovered, isStart, isEnd) {
                    let desc;
                    let prefix = isStart
                        ? figures.arrowUp
                        : isEnd
                          ? figures.arrowDown
                          : " ";
                    let title = hovered
                        ? color.cyan().underline(v.title)
                        : v.title;
                    prefix =
                        (hovered ? color.cyan(figures.pointer) + " " : "  ") +
                        prefix;

                    if (v.description) {
                        desc = ` - ${v.description}`;

                        if (
                            prefix.length + title.length + desc.length >=
                                this.out.columns ||
                            v.description.split(/\r?\n/).length > 1
                        ) {
                            desc =
                                "\n" +
                                wrap(v.description, {
                                    margin: 3,
                                    width: this.out.columns
                                });
                        }
                    }

                    return prefix + " " + title + color.gray(desc || "");
                }

                render() {
                    if (this.closed) return;
                    if (this.firstRender) this.out.write(cursor.hide);
                    else
                        this.out.write(
                            clear(this.outputText, this.out.columns)
                        );
                    super.render();

                    let _entriesToDisplay = entriesToDisplay(
                            this.select,
                            this.choices.length,
                            this.limit
                        ),
                        startIndex = _entriesToDisplay.startIndex,
                        endIndex = _entriesToDisplay.endIndex;

                    this.outputText = [
                        style.symbol(this.done, this.aborted, this.exited),
                        color.bold(this.msg),
                        style.delimiter(this.completing),
                        this.done && this.suggestions[this.select]
                            ? this.suggestions[this.select].title
                            : (this.rendered = this.transform.render(
                                  this.input
                              ))
                    ].join(" ");

                    if (!this.done) {
                        const suggestions = this.suggestions
                            .slice(startIndex, endIndex)
                            .map((item, i) =>
                                this.renderOption(
                                    item,
                                    this.select === i + startIndex,
                                    i === 0 && startIndex > 0,
                                    i + startIndex === endIndex - 1 &&
                                        endIndex < this.choices.length
                                )
                            )
                            .join("\n");
                        this.outputText +=
                            `\n` +
                            (suggestions || color.gray(this.fallback.title));
                    }

                    this.out.write(erase.line + cursor.to(0) + this.outputText);
                }
            }

            module.exports = AutocompletePrompt;

            /***/
        },

        /***/ 5365: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const color = __nccwpck_require__(1067);

            const _require = __nccwpck_require__(7036),
                cursor = _require.cursor;

            const MultiselectPrompt = __nccwpck_require__(6165);

            const _require2 = __nccwpck_require__(117),
                clear = _require2.clear,
                style = _require2.style,
                figures = _require2.figures;
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

            class AutocompleteMultiselectPrompt extends MultiselectPrompt {
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
                    this.cursor =
                        (this.cursor + 1) % this.filteredOptions.length;
                    this.render();
                }

                up() {
                    if (this.cursor === 0) {
                        this.cursor = this.filteredOptions.length - 1;
                    } else {
                        this.cursor--;
                    }

                    this.render();
                }

                down() {
                    if (this.cursor === this.filteredOptions.length - 1) {
                        this.cursor = 0;
                    } else {
                        this.cursor++;
                    }

                    this.render();
                }

                left() {
                    this.filteredOptions[this.cursor].selected = false;
                    this.render();
                }

                right() {
                    if (
                        this.value.filter((e) => e.selected).length >=
                        this.maxChoices
                    )
                        return this.bell();
                    this.filteredOptions[this.cursor].selected = true;
                    this.render();
                }

                delete() {
                    if (this.inputValue.length) {
                        this.inputValue = this.inputValue.substr(
                            0,
                            this.inputValue.length - 1
                        );
                        this.updateFilteredOptions();
                    }
                }

                updateFilteredOptions() {
                    const currentHighlight = this.filteredOptions[this.cursor];
                    this.filteredOptions = this.value.filter((v) => {
                        if (this.inputValue) {
                            if (typeof v.title === "string") {
                                if (
                                    v.title
                                        .toLowerCase()
                                        .includes(this.inputValue.toLowerCase())
                                ) {
                                    return true;
                                }
                            }

                            if (typeof v.value === "string") {
                                if (
                                    v.value
                                        .toLowerCase()
                                        .includes(this.inputValue.toLowerCase())
                                ) {
                                    return true;
                                }
                            }

                            return false;
                        }

                        return true;
                    });
                    const newHighlightIndex = this.filteredOptions.findIndex(
                        (v) => v === currentHighlight
                    );
                    this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
                    this.render();
                }

                handleSpaceToggle() {
                    const v = this.filteredOptions[this.cursor];

                    if (v.selected) {
                        v.selected = false;
                        this.render();
                    } else if (
                        v.disabled ||
                        this.value.filter((e) => e.selected).length >=
                            this.maxChoices
                    ) {
                        return this.bell();
                    } else {
                        v.selected = true;
                        this.render();
                    }
                }

                handleInputChange(c) {
                    this.inputValue = this.inputValue + c;
                    this.updateFilteredOptions();
                }

                _(c, key) {
                    if (c === " ") {
                        this.handleSpaceToggle();
                    } else {
                        this.handleInputChange(c);
                    }
                }

                renderInstructions() {
                    if (this.instructions === undefined || this.instructions) {
                        if (typeof this.instructions === "string") {
                            return this.instructions;
                        }

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
                    if (v.disabled)
                        title =
                            cursor === i
                                ? color.gray().underline(v.title)
                                : color.strikethrough().gray(v.title);
                    else
                        title =
                            cursor === i
                                ? color.cyan().underline(v.title)
                                : v.title;
                    return (
                        (v.selected
                            ? color.green(figures.radioOn)
                            : figures.radioOff) +
                        "  " +
                        title
                    );
                }

                renderDoneOrInstructions() {
                    if (this.done) {
                        return this.value
                            .filter((e) => e.selected)
                            .map((v) => v.title)
                            .join(", ");
                    }

                    const output = [
                        color.gray(this.hint),
                        this.renderInstructions(),
                        this.renderCurrentInput()
                    ];

                    if (
                        this.filteredOptions.length &&
                        this.filteredOptions[this.cursor].disabled
                    ) {
                        output.push(color.yellow(this.warn));
                    }

                    return output.join(" ");
                }

                render() {
                    if (this.closed) return;
                    if (this.firstRender) this.out.write(cursor.hide);
                    super.render(); // print prompt

                    let prompt = [
                        style.symbol(this.done, this.aborted),
                        color.bold(this.msg),
                        style.delimiter(false),
                        this.renderDoneOrInstructions()
                    ].join(" ");

                    if (this.showMinError) {
                        prompt += color.red(
                            `You must select a minimum of ${this.minSelected} choices.`
                        );
                        this.showMinError = false;
                    }

                    prompt += this.renderOptions(this.filteredOptions);
                    this.out.write(this.clear + prompt);
                    this.clear = clear(prompt, this.out.columns);
                }
            }

            module.exports = AutocompleteMultiselectPrompt;

            /***/
        },

        /***/ 4436: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const color = __nccwpck_require__(1067);

            const Prompt = __nccwpck_require__(8200);

            const _require = __nccwpck_require__(117),
                style = _require.style,
                clear = _require.clear;

            const _require2 = __nccwpck_require__(7036),
                erase = _require2.erase,
                cursor = _require2.cursor;
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

            class ConfirmPrompt extends Prompt {
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
                    else
                        this.out.write(
                            clear(this.outputText, this.out.columns)
                        );
                    super.render();
                    this.outputText = [
                        style.symbol(this.done, this.aborted),
                        color.bold(this.msg),
                        style.delimiter(this.done),
                        this.done
                            ? this.value
                                ? this.yesMsg
                                : this.noMsg
                            : color.gray(
                                  this.initialValue
                                      ? this.yesOption
                                      : this.noOption
                              )
                    ].join(" ");
                    this.out.write(erase.line + cursor.to(0) + this.outputText);
                }
            }

            module.exports = ConfirmPrompt;

            /***/
        },

        /***/ 8346: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            function asyncGeneratorStep(
                gen,
                resolve,
                reject,
                _next,
                _throw,
                key,
                arg
            ) {
                try {
                    var info = gen[key](arg);
                    var value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                if (info.done) {
                    resolve(value);
                } else {
                    Promise.resolve(value).then(_next, _throw);
                }
            }

            function _asyncToGenerator(fn) {
                return function () {
                    var self = this,
                        args = arguments;
                    return new Promise(function (resolve, reject) {
                        var gen = fn.apply(self, args);
                        function _next(value) {
                            asyncGeneratorStep(
                                gen,
                                resolve,
                                reject,
                                _next,
                                _throw,
                                "next",
                                value
                            );
                        }
                        function _throw(err) {
                            asyncGeneratorStep(
                                gen,
                                resolve,
                                reject,
                                _next,
                                _throw,
                                "throw",
                                err
                            );
                        }
                        _next(undefined);
                    });
                };
            }

            const color = __nccwpck_require__(1067);

            const Prompt = __nccwpck_require__(8200);

            const _require = __nccwpck_require__(117),
                style = _require.style,
                clear = _require.clear,
                figures = _require.figures;

            const _require2 = __nccwpck_require__(7036),
                erase = _require2.erase,
                cursor = _require2.cursor;

            const _require3 = __nccwpck_require__(645),
                DatePart = _require3.DatePart,
                Meridiem = _require3.Meridiem,
                Day = _require3.Day,
                Hours = _require3.Hours,
                Milliseconds = _require3.Milliseconds,
                Minutes = _require3.Minutes,
                Month = _require3.Month,
                Seconds = _require3.Seconds,
                Year = _require3.Year;

            const regex =
                /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
            const regexGroups = {
                1: ({ token }) => token.replace(/\\(.)/g, "$1"),
                2: (opts) => new Day(opts),
                // Day // TODO
                3: (opts) => new Month(opts),
                // Month
                4: (opts) => new Year(opts),
                // Year
                5: (opts) => new Meridiem(opts),
                // AM/PM // TODO (special)
                6: (opts) => new Hours(opts),
                // Hours
                7: (opts) => new Minutes(opts),
                // Minutes
                8: (opts) => new Seconds(opts),
                // Seconds
                9: (opts) => new Milliseconds(opts) // Fractional seconds
            };
            const dfltLocales = {
                months: "January,February,March,April,May,June,July,August,September,October,November,December".split(
                    ","
                ),
                monthsShort:
                    "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(
                        ","
                    ),
                weekdays:
                    "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(
                        ","
                    ),
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

            class DatePrompt extends Prompt {
                constructor(opts = {}) {
                    super(opts);
                    this.msg = opts.message;
                    this.cursor = 0;
                    this.typed = "";
                    this.locales = Object.assign(dfltLocales, opts.locales);
                    this._date = opts.initial || new Date();
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

                    while ((result = regex.exec(mask))) {
                        let match = result.shift();
                        let idx = result.findIndex((gr) => gr != null);
                        this.parts.push(
                            idx in regexGroups
                                ? regexGroups[idx]({
                                      token: result[idx] || match,
                                      date: this.date,
                                      parts: this.parts,
                                      locales: this.locales
                                  })
                                : result[idx] || match
                        );
                    }

                    let parts = this.parts.reduce((arr, i) => {
                        if (
                            typeof i === "string" &&
                            typeof arr[arr.length - 1] === "string"
                        )
                            arr[arr.length - 1] += i;
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
                    this.moveCursor(
                        this.parts.findIndex((p) => p instanceof DatePart)
                    );
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
                    this.moveCursor(
                        next
                            ? this.parts.indexOf(next)
                            : this.parts.findIndex(
                                  (part) => part instanceof DatePart
                              )
                    );
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
                    else
                        this.out.write(
                            clear(this.outputText, this.out.columns)
                        );
                    super.render(); // Print prompt

                    this.outputText = [
                        style.symbol(this.done, this.aborted),
                        color.bold(this.msg),
                        style.delimiter(false),
                        this.parts
                            .reduce(
                                (arr, p, idx) =>
                                    arr.concat(
                                        idx === this.cursor && !this.done
                                            ? color
                                                  .cyan()
                                                  .underline(p.toString())
                                            : p
                                    ),
                                []
                            )
                            .join("")
                    ].join(" "); // Print error

                    if (this.error) {
                        this.outputText += this.errorMsg
                            .split("\n")
                            .reduce(
                                (a, l, i) =>
                                    a +
                                    `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`,
                                ``
                            );
                    }

                    this.out.write(erase.line + cursor.to(0) + this.outputText);
                }
            }

            module.exports = DatePrompt;

            /***/
        },

        /***/ 9776: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            module.exports = {
                TextPrompt: __nccwpck_require__(3041),
                SelectPrompt: __nccwpck_require__(6510),
                TogglePrompt: __nccwpck_require__(7990),
                DatePrompt: __nccwpck_require__(8346),
                NumberPrompt: __nccwpck_require__(7503),
                MultiselectPrompt: __nccwpck_require__(6165),
                AutocompletePrompt: __nccwpck_require__(2470),
                AutocompleteMultiselectPrompt: __nccwpck_require__(5365),
                ConfirmPrompt: __nccwpck_require__(4436)
            };

            /***/
        },

        /***/ 6165: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const color = __nccwpck_require__(1067);

            const _require = __nccwpck_require__(7036),
                cursor = _require.cursor;

            const Prompt = __nccwpck_require__(8200);

            const _require2 = __nccwpck_require__(117),
                clear = _require2.clear,
                figures = _require2.figures,
                style = _require2.style,
                wrap = _require2.wrap,
                entriesToDisplay = _require2.entriesToDisplay;
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

            class MultiselectPrompt extends Prompt {
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
                        if (typeof ch === "string")
                            ch = {
                                title: ch,
                                value: idx
                            };
                        return {
                            title: ch && (ch.title || ch.value || ch),
                            description: ch && ch.description,
                            value:
                                ch && (ch.value === undefined ? idx : ch.value),
                            selected: ch && ch.selected,
                            disabled: ch && ch.disabled
                        };
                    });
                    this.clear = clear("", this.out.columns);

                    if (!opts.overrideRender) {
                        this.render();
                    }
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

                    if (
                        this.minSelected &&
                        selected.length < this.minSelected
                    ) {
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
                    if (this.cursor === 0) {
                        this.cursor = this.value.length - 1;
                    } else {
                        this.cursor--;
                    }

                    this.render();
                }

                down() {
                    if (this.cursor === this.value.length - 1) {
                        this.cursor = 0;
                    } else {
                        this.cursor++;
                    }

                    this.render();
                }

                left() {
                    this.value[this.cursor].selected = false;
                    this.render();
                }

                right() {
                    if (
                        this.value.filter((e) => e.selected).length >=
                        this.maxChoices
                    )
                        return this.bell();
                    this.value[this.cursor].selected = true;
                    this.render();
                }

                handleSpaceToggle() {
                    const v = this.value[this.cursor];

                    if (v.selected) {
                        v.selected = false;
                        this.render();
                    } else if (
                        v.disabled ||
                        this.value.filter((e) => e.selected).length >=
                            this.maxChoices
                    ) {
                        return this.bell();
                    } else {
                        v.selected = true;
                        this.render();
                    }
                }

                toggleAll() {
                    if (
                        this.maxChoices !== undefined ||
                        this.value[this.cursor].disabled
                    ) {
                        return this.bell();
                    }

                    const newSelected = !this.value[this.cursor].selected;
                    this.value
                        .filter((v) => !v.disabled)
                        .forEach((v) => (v.selected = newSelected));
                    this.render();
                }

                _(c, key) {
                    if (c === " ") {
                        this.handleSpaceToggle();
                    } else if (c === "a") {
                        this.toggleAll();
                    } else {
                        return this.bell();
                    }
                }

                renderInstructions() {
                    if (this.instructions === undefined || this.instructions) {
                        if (typeof this.instructions === "string") {
                            return this.instructions;
                        }

                        return (
                            "\nInstructions:\n" +
                            `    ${figures.arrowUp}/${figures.arrowDown}: Highlight option\n` +
                            `    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection\n` +
                            (this.maxChoices === undefined
                                ? `    a: Toggle all\n`
                                : "") +
                            `    enter/return: Complete answer`
                        );
                    }

                    return "";
                }

                renderOption(cursor, v, i, arrowIndicator) {
                    const prefix =
                        (v.selected
                            ? color.green(figures.radioOn)
                            : figures.radioOff) +
                        " " +
                        arrowIndicator +
                        " ";
                    let title, desc;

                    if (v.disabled) {
                        title =
                            cursor === i
                                ? color.gray().underline(v.title)
                                : color.strikethrough().gray(v.title);
                    } else {
                        title =
                            cursor === i
                                ? color.cyan().underline(v.title)
                                : v.title;

                        if (cursor === i && v.description) {
                            desc = ` - ${v.description}`;

                            if (
                                prefix.length + title.length + desc.length >=
                                    this.out.columns ||
                                v.description.split(/\r?\n/).length > 1
                            ) {
                                desc =
                                    "\n" +
                                    wrap(v.description, {
                                        margin: prefix.length,
                                        width: this.out.columns
                                    });
                            }
                        }
                    }

                    return prefix + title + color.gray(desc || "");
                } // shared with autocompleteMultiselect

                paginateOptions(options) {
                    if (options.length === 0) {
                        return color.red("No matches for this query.");
                    }

                    let _entriesToDisplay = entriesToDisplay(
                            this.cursor,
                            options.length,
                            this.optionsPerPage
                        ),
                        startIndex = _entriesToDisplay.startIndex,
                        endIndex = _entriesToDisplay.endIndex;

                    let prefix,
                        styledOptions = [];

                    for (let i = startIndex; i < endIndex; i++) {
                        if (i === startIndex && startIndex > 0) {
                            prefix = figures.arrowUp;
                        } else if (
                            i === endIndex - 1 &&
                            endIndex < options.length
                        ) {
                            prefix = figures.arrowDown;
                        } else {
                            prefix = " ";
                        }

                        styledOptions.push(
                            this.renderOption(
                                this.cursor,
                                options[i],
                                i,
                                prefix
                            )
                        );
                    }

                    return "\n" + styledOptions.join("\n");
                } // shared with autocomleteMultiselect

                renderOptions(options) {
                    if (!this.done) {
                        return this.paginateOptions(options);
                    }

                    return "";
                }

                renderDoneOrInstructions() {
                    if (this.done) {
                        return this.value
                            .filter((e) => e.selected)
                            .map((v) => v.title)
                            .join(", ");
                    }

                    const output = [
                        color.gray(this.hint),
                        this.renderInstructions()
                    ];

                    if (this.value[this.cursor].disabled) {
                        output.push(color.yellow(this.warn));
                    }

                    return output.join(" ");
                }

                render() {
                    if (this.closed) return;
                    if (this.firstRender) this.out.write(cursor.hide);
                    super.render(); // print prompt

                    let prompt = [
                        style.symbol(this.done, this.aborted),
                        color.bold(this.msg),
                        style.delimiter(false),
                        this.renderDoneOrInstructions()
                    ].join(" ");

                    if (this.showMinError) {
                        prompt += color.red(
                            `You must select a minimum of ${this.minSelected} choices.`
                        );
                        this.showMinError = false;
                    }

                    prompt += this.renderOptions(this.value);
                    this.out.write(this.clear + prompt);
                    this.clear = clear(prompt, this.out.columns);
                }
            }

            module.exports = MultiselectPrompt;

            /***/
        },

        /***/ 7503: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            function asyncGeneratorStep(
                gen,
                resolve,
                reject,
                _next,
                _throw,
                key,
                arg
            ) {
                try {
                    var info = gen[key](arg);
                    var value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                if (info.done) {
                    resolve(value);
                } else {
                    Promise.resolve(value).then(_next, _throw);
                }
            }

            function _asyncToGenerator(fn) {
                return function () {
                    var self = this,
                        args = arguments;
                    return new Promise(function (resolve, reject) {
                        var gen = fn.apply(self, args);
                        function _next(value) {
                            asyncGeneratorStep(
                                gen,
                                resolve,
                                reject,
                                _next,
                                _throw,
                                "next",
                                value
                            );
                        }
                        function _throw(err) {
                            asyncGeneratorStep(
                                gen,
                                resolve,
                                reject,
                                _next,
                                _throw,
                                "throw",
                                err
                            );
                        }
                        _next(undefined);
                    });
                };
            }

            const color = __nccwpck_require__(1067);

            const Prompt = __nccwpck_require__(8200);

            const _require = __nccwpck_require__(7036),
                cursor = _require.cursor,
                erase = _require.erase;

            const _require2 = __nccwpck_require__(117),
                style = _require2.style,
                figures = _require2.figures,
                clear = _require2.clear,
                lines = _require2.lines;

            const isNumber = /[0-9]/;

            const isDef = (any) => any !== undefined;

            const round = (number, precision) => {
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

            class NumberPrompt extends Prompt {
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
                        this.rendered = color.gray(
                            this.transform.render(`${this.initial}`)
                        );
                        this._value = ``;
                    } else {
                        this.placeholder = false;
                        this.rendered = this.transform.render(
                            `${round(v, this.round)}`
                        );
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
                    return (
                        c === `-` ||
                        (c === `.` && this.float) ||
                        isNumber.test(c)
                    );
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

                    if (this.value === "") {
                        this.value = this.min - this.inc;
                    }

                    if (this.value >= this.max) return this.bell();
                    this.value += this.inc;
                    this.color = `cyan`;
                    this.fire();
                    this.render();
                }

                down() {
                    this.typed = ``;

                    if (this.value === "") {
                        this.value = this.min + this.inc;
                    }

                    if (this.value <= this.min) return this.bell();
                    this.value -= this.inc;
                    this.color = `cyan`;
                    this.fire();
                    this.render();
                }

                delete() {
                    let val = this.value.toString();
                    if (val.length === 0) return this.bell();
                    this.value = this.parse((val = val.slice(0, -1))) || ``;

                    if (this.value !== "" && this.value < this.min) {
                        this.value = this.min;
                    }

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
                    if (now - this.lastHit > 1000) this.typed = ``; // 1s elapsed

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
                        if (this.outputError)
                            this.out.write(
                                cursor.down(
                                    lines(this.outputError, this.out.columns) -
                                        1
                                ) + clear(this.outputError, this.out.columns)
                            );
                        this.out.write(
                            clear(this.outputText, this.out.columns)
                        );
                    }

                    super.render();
                    this.outputError = ""; // Print prompt

                    this.outputText = [
                        style.symbol(this.done, this.aborted),
                        color.bold(this.msg),
                        style.delimiter(this.done),
                        !this.done || (!this.done && !this.placeholder)
                            ? color[this.color]().underline(this.rendered)
                            : this.rendered
                    ].join(` `); // Print error

                    if (this.error) {
                        this.outputError += this.errorMsg
                            .split(`\n`)
                            .reduce(
                                (a, l, i) =>
                                    a +
                                    `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`,
                                ``
                            );
                    }

                    this.out.write(
                        erase.line +
                            cursor.to(0) +
                            this.outputText +
                            cursor.save +
                            this.outputError +
                            cursor.restore
                    );
                }
            }

            module.exports = NumberPrompt;

            /***/
        },

        /***/ 8200: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const readline = __nccwpck_require__(3785);

            const _require = __nccwpck_require__(117),
                action = _require.action;

            const EventEmitter = __nccwpck_require__(4434);

            const _require2 = __nccwpck_require__(7036),
                beep = _require2.beep,
                cursor = _require2.cursor;

            const color = __nccwpck_require__(1067);
            /**
             * Base prompt skeleton
             * @param {Stream} [opts.stdin] The Readable stream to listen to
             * @param {Stream} [opts.stdout] The Writable stream to write readline data to
             */

            class Prompt extends EventEmitter {
                constructor(opts = {}) {
                    super();
                    this.firstRender = true;
                    this.in = opts.stdin || process.stdin;
                    this.out = opts.stdout || process.stdout;

                    this.onRender = (opts.onRender || (() => void 0)).bind(
                        this
                    );

                    const rl = readline.createInterface({
                        input: this.in,
                        escapeCodeTimeout: 50
                    });
                    readline.emitKeypressEvents(this.in, rl);
                    if (this.in.isTTY) this.in.setRawMode(true);
                    const isSelect =
                        ["SelectPrompt", "MultiselectPrompt"].indexOf(
                            this.constructor.name
                        ) > -1;

                    const keypress = (str, key) => {
                        let a = action(key, isSelect);

                        if (a === false) {
                            this._ && this._(str, key);
                        } else if (typeof this[a] === "function") {
                            this[a](key);
                        } else {
                            this.bell();
                        }
                    };

                    this.close = () => {
                        this.out.write(cursor.show);
                        this.in.removeListener("keypress", keypress);
                        if (this.in.isTTY) this.in.setRawMode(false);
                        rl.close();
                        this.emit(
                            this.aborted
                                ? "abort"
                                : this.exited
                                  ? "exit"
                                  : "submit",
                            this.value
                        );
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
            }

            module.exports = Prompt;

            /***/
        },

        /***/ 6510: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const color = __nccwpck_require__(1067);

            const Prompt = __nccwpck_require__(8200);

            const _require = __nccwpck_require__(117),
                style = _require.style,
                clear = _require.clear,
                figures = _require.figures,
                wrap = _require.wrap,
                entriesToDisplay = _require.entriesToDisplay;

            const _require2 = __nccwpck_require__(7036),
                cursor = _require2.cursor;
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

            class SelectPrompt extends Prompt {
                constructor(opts = {}) {
                    super(opts);
                    this.msg = opts.message;
                    this.hint =
                        opts.hint || "- Use arrow-keys. Return to submit.";
                    this.warn = opts.warn || "- This option is disabled";
                    this.cursor = opts.initial || 0;
                    this.choices = opts.choices.map((ch, idx) => {
                        if (typeof ch === "string")
                            ch = {
                                title: ch,
                                value: idx
                            };
                        return {
                            title: ch && (ch.title || ch.value || ch),
                            value:
                                ch && (ch.value === undefined ? idx : ch.value),
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
                    if (this.cursor === 0) {
                        this.moveCursor(this.choices.length - 1);
                    } else {
                        this.moveCursor(this.cursor - 1);
                    }

                    this.render();
                }

                down() {
                    if (this.cursor === this.choices.length - 1) {
                        this.moveCursor(0);
                    } else {
                        this.moveCursor(this.cursor + 1);
                    }

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
                    else
                        this.out.write(
                            clear(this.outputText, this.out.columns)
                        );
                    super.render();

                    let _entriesToDisplay = entriesToDisplay(
                            this.cursor,
                            this.choices.length,
                            this.optionsPerPage
                        ),
                        startIndex = _entriesToDisplay.startIndex,
                        endIndex = _entriesToDisplay.endIndex; // Print prompt

                    this.outputText = [
                        style.symbol(this.done, this.aborted),
                        color.bold(this.msg),
                        style.delimiter(false),
                        this.done
                            ? this.selection.title
                            : this.selection.disabled
                              ? color.yellow(this.warn)
                              : color.gray(this.hint)
                    ].join(" "); // Print choices

                    if (!this.done) {
                        this.outputText += "\n";

                        for (let i = startIndex; i < endIndex; i++) {
                            let title,
                                prefix,
                                desc = "",
                                v = this.choices[i]; // Determine whether to display "more choices" indicators

                            if (i === startIndex && startIndex > 0) {
                                prefix = figures.arrowUp;
                            } else if (
                                i === endIndex - 1 &&
                                endIndex < this.choices.length
                            ) {
                                prefix = figures.arrowDown;
                            } else {
                                prefix = " ";
                            }

                            if (v.disabled) {
                                title =
                                    this.cursor === i
                                        ? color.gray().underline(v.title)
                                        : color.strikethrough().gray(v.title);
                                prefix =
                                    (this.cursor === i
                                        ? color.bold().gray(figures.pointer) +
                                          " "
                                        : "  ") + prefix;
                            } else {
                                title =
                                    this.cursor === i
                                        ? color.cyan().underline(v.title)
                                        : v.title;
                                prefix =
                                    (this.cursor === i
                                        ? color.cyan(figures.pointer) + " "
                                        : "  ") + prefix;

                                if (v.description && this.cursor === i) {
                                    desc = ` - ${v.description}`;

                                    if (
                                        prefix.length +
                                            title.length +
                                            desc.length >=
                                            this.out.columns ||
                                        v.description.split(/\r?\n/).length > 1
                                    ) {
                                        desc =
                                            "\n" +
                                            wrap(v.description, {
                                                margin: 3,
                                                width: this.out.columns
                                            });
                                    }
                                }
                            }

                            this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
                        }
                    }

                    this.out.write(this.outputText);
                }
            }

            module.exports = SelectPrompt;

            /***/
        },

        /***/ 3041: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            function asyncGeneratorStep(
                gen,
                resolve,
                reject,
                _next,
                _throw,
                key,
                arg
            ) {
                try {
                    var info = gen[key](arg);
                    var value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                if (info.done) {
                    resolve(value);
                } else {
                    Promise.resolve(value).then(_next, _throw);
                }
            }

            function _asyncToGenerator(fn) {
                return function () {
                    var self = this,
                        args = arguments;
                    return new Promise(function (resolve, reject) {
                        var gen = fn.apply(self, args);
                        function _next(value) {
                            asyncGeneratorStep(
                                gen,
                                resolve,
                                reject,
                                _next,
                                _throw,
                                "next",
                                value
                            );
                        }
                        function _throw(err) {
                            asyncGeneratorStep(
                                gen,
                                resolve,
                                reject,
                                _next,
                                _throw,
                                "throw",
                                err
                            );
                        }
                        _next(undefined);
                    });
                };
            }

            const color = __nccwpck_require__(1067);

            const Prompt = __nccwpck_require__(8200);

            const _require = __nccwpck_require__(7036),
                erase = _require.erase,
                cursor = _require.cursor;

            const _require2 = __nccwpck_require__(117),
                style = _require2.style,
                clear = _require2.clear,
                lines = _require2.lines,
                figures = _require2.figures;
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

            class TextPrompt extends Prompt {
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
                        this.rendered = color.gray(
                            this.transform.render(this.initial)
                        );
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
                    let s2 = this.value.slice(this.cursor);
                    this.value = `${s1}${c}${s2}`;
                    this.red = false;
                    this.cursor = this.placeholder ? 0 : s1.length + 1;
                    this.render();
                }

                delete() {
                    if (this.isCursorAtStart()) return this.bell();
                    let s1 = this.value.slice(0, this.cursor - 1);
                    let s2 = this.value.slice(this.cursor);
                    this.value = `${s1}${s2}`;
                    this.red = false;

                    if (this.isCursorAtStart()) {
                        this.cursorOffset = 0;
                    } else {
                        this.cursorOffset++;
                        this.moveCursor(-1);
                    }

                    this.render();
                }

                deleteForward() {
                    if (
                        this.cursor * this.scale >= this.rendered.length ||
                        this.placeholder
                    )
                        return this.bell();
                    let s1 = this.value.slice(0, this.cursor);
                    let s2 = this.value.slice(this.cursor + 1);
                    this.value = `${s1}${s2}`;
                    this.red = false;

                    if (this.isCursorAtEnd()) {
                        this.cursorOffset = 0;
                    } else {
                        this.cursorOffset++;
                    }

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
                    if (this.cursor <= 0 || this.placeholder)
                        return this.bell();
                    this.moveCursor(-1);
                    this.render();
                }

                right() {
                    if (
                        this.cursor * this.scale >= this.rendered.length ||
                        this.placeholder
                    )
                        return this.bell();
                    this.moveCursor(1);
                    this.render();
                }

                isCursorAtStart() {
                    return (
                        this.cursor === 0 ||
                        (this.placeholder && this.cursor === 1)
                    );
                }

                isCursorAtEnd() {
                    return (
                        this.cursor === this.rendered.length ||
                        (this.placeholder &&
                            this.cursor === this.rendered.length + 1)
                    );
                }

                render() {
                    if (this.closed) return;

                    if (!this.firstRender) {
                        if (this.outputError)
                            this.out.write(
                                cursor.down(
                                    lines(this.outputError, this.out.columns) -
                                        1
                                ) + clear(this.outputError, this.out.columns)
                            );
                        this.out.write(
                            clear(this.outputText, this.out.columns)
                        );
                    }

                    super.render();
                    this.outputError = "";
                    this.outputText = [
                        style.symbol(this.done, this.aborted),
                        color.bold(this.msg),
                        style.delimiter(this.done),
                        this.red ? color.red(this.rendered) : this.rendered
                    ].join(` `);

                    if (this.error) {
                        this.outputError += this.errorMsg
                            .split(`\n`)
                            .reduce(
                                (a, l, i) =>
                                    a +
                                    `\n${i ? " " : figures.pointerSmall} ${color.red().italic(l)}`,
                                ``
                            );
                    }

                    this.out.write(
                        erase.line +
                            cursor.to(0) +
                            this.outputText +
                            cursor.save +
                            this.outputError +
                            cursor.restore +
                            cursor.move(this.cursorOffset, 0)
                    );
                }
            }

            module.exports = TextPrompt;

            /***/
        },

        /***/ 7990: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const color = __nccwpck_require__(1067);

            const Prompt = __nccwpck_require__(8200);

            const _require = __nccwpck_require__(117),
                style = _require.style,
                clear = _require.clear;

            const _require2 = __nccwpck_require__(7036),
                cursor = _require2.cursor,
                erase = _require2.erase;
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

            class TogglePrompt extends Prompt {
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
                    if (c === " ") {
                        this.value = !this.value;
                    } else if (c === "1") {
                        this.value = true;
                    } else if (c === "0") {
                        this.value = false;
                    } else return this.bell();

                    this.render();
                }

                render() {
                    if (this.closed) return;
                    if (this.firstRender) this.out.write(cursor.hide);
                    else
                        this.out.write(
                            clear(this.outputText, this.out.columns)
                        );
                    super.render();
                    this.outputText = [
                        style.symbol(this.done, this.aborted),
                        color.bold(this.msg),
                        style.delimiter(this.done),
                        this.value
                            ? this.inactive
                            : color.cyan().underline(this.inactive),
                        color.gray("/"),
                        this.value
                            ? color.cyan().underline(this.active)
                            : this.active
                    ].join(" ");
                    this.out.write(erase.line + cursor.to(0) + this.outputText);
                }
            }

            module.exports = TogglePrompt;

            /***/
        },

        /***/ 2804: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            function ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly) {
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(object, sym)
                                .enumerable;
                        });
                    }
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function _objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        ownKeys(Object(source), true).forEach(function (key) {
                            _defineProperty(target, key, source[key]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(
                            target,
                            Object.getOwnPropertyDescriptors(source)
                        );
                    } else {
                        ownKeys(Object(source)).forEach(function (key) {
                            Object.defineProperty(
                                target,
                                key,
                                Object.getOwnPropertyDescriptor(source, key)
                            );
                        });
                    }
                }
                return target;
            }

            function _defineProperty(obj, key, value) {
                if (key in obj) {
                    Object.defineProperty(obj, key, {
                        value: value,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                } else {
                    obj[key] = value;
                }
                return obj;
            }

            function _createForOfIteratorHelper(o, allowArrayLike) {
                var it =
                    (typeof Symbol !== "undefined" && o[Symbol.iterator]) ||
                    o["@@iterator"];
                if (!it) {
                    if (
                        Array.isArray(o) ||
                        (it = _unsupportedIterableToArray(o)) ||
                        (allowArrayLike && o && typeof o.length === "number")
                    ) {
                        if (it) o = it;
                        var i = 0;
                        var F = function F() {};
                        return {
                            s: F,
                            n: function n() {
                                if (i >= o.length) return { done: true };
                                return { done: false, value: o[i++] };
                            },
                            e: function e(_e) {
                                throw _e;
                            },
                            f: F
                        };
                    }
                    throw new TypeError(
                        "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                    );
                }
                var normalCompletion = true,
                    didErr = false,
                    err;
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
                            if (!normalCompletion && it.return != null)
                                it.return();
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
                if (
                    n === "Arguments" ||
                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                )
                    return _arrayLikeToArray(o, minLen);
            }

            function _arrayLikeToArray(arr, len) {
                if (len == null || len > arr.length) len = arr.length;
                for (var i = 0, arr2 = new Array(len); i < len; i++)
                    arr2[i] = arr[i];
                return arr2;
            }

            function asyncGeneratorStep(
                gen,
                resolve,
                reject,
                _next,
                _throw,
                key,
                arg
            ) {
                try {
                    var info = gen[key](arg);
                    var value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                if (info.done) {
                    resolve(value);
                } else {
                    Promise.resolve(value).then(_next, _throw);
                }
            }

            function _asyncToGenerator(fn) {
                return function () {
                    var self = this,
                        args = arguments;
                    return new Promise(function (resolve, reject) {
                        var gen = fn.apply(self, args);
                        function _next(value) {
                            asyncGeneratorStep(
                                gen,
                                resolve,
                                reject,
                                _next,
                                _throw,
                                "next",
                                value
                            );
                        }
                        function _throw(err) {
                            asyncGeneratorStep(
                                gen,
                                resolve,
                                reject,
                                _next,
                                _throw,
                                "throw",
                                err
                            );
                        }
                        _next(undefined);
                    });
                };
            }

            const prompts = __nccwpck_require__(6603);

            const passOn = [
                "suggest",
                "format",
                "onState",
                "validate",
                "onRender",
                "type"
            ];

            const noop = () => {};
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
                _prompt = _asyncToGenerator(function* (
                    questions = [],
                    { onSubmit = noop, onCancel = noop } = {}
                ) {
                    const answers = {};
                    const override = prompt._override || {};
                    questions = [].concat(questions);
                    let answer, question, quit, name, type, lastPrompt;

                    const getFormattedAnswer = /*#__PURE__*/ (function () {
                        var _ref = _asyncToGenerator(function* (
                            question,
                            answer,
                            skipValidation = false
                        ) {
                            if (
                                !skipValidation &&
                                question.validate &&
                                question.validate(answer) !== true
                            ) {
                                return;
                            }

                            return question.format
                                ? yield question.format(answer, answers)
                                : answer;
                        });

                        return function getFormattedAnswer(_x, _x2) {
                            return _ref.apply(this, arguments);
                        };
                    })();

                    var _iterator = _createForOfIteratorHelper(questions),
                        _step;

                    try {
                        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                            question = _step.value;
                            var _question = question;
                            name = _question.name;
                            type = _question.type;

                            // evaluate type first and skip if type is a falsy value
                            if (typeof type === "function") {
                                type = yield type(
                                    answer,
                                    _objectSpread({}, answers),
                                    question
                                );
                                question["type"] = type;
                            }

                            if (!type) continue; // if property is a function, invoke it unless it's a special function

                            for (let key in question) {
                                if (passOn.includes(key)) continue;
                                let value = question[key];
                                question[key] =
                                    typeof value === "function"
                                        ? yield value(
                                              answer,
                                              _objectSpread({}, answers),
                                              lastPrompt
                                          )
                                        : value;
                            }

                            lastPrompt = question;

                            if (typeof question.message !== "string") {
                                throw new Error("prompt message is required");
                            } // update vars in case they changed

                            var _question2 = question;
                            name = _question2.name;
                            type = _question2.type;

                            if (prompts[type] === void 0) {
                                throw new Error(
                                    `prompt type (${type}) is not defined`
                                );
                            }

                            if (override[question.name] !== undefined) {
                                answer = yield getFormattedAnswer(
                                    question,
                                    override[question.name]
                                );

                                if (answer !== undefined) {
                                    answers[name] = answer;
                                    continue;
                                }
                            }

                            try {
                                // Get the injected answer if there is one or prompt the user
                                answer = prompt._injected
                                    ? getInjectedAnswer(
                                          prompt._injected,
                                          question.initial
                                      )
                                    : yield prompts[type](question);
                                answers[name] = answer =
                                    yield getFormattedAnswer(
                                        question,
                                        answer,
                                        true
                                    );
                                quit = yield onSubmit(
                                    question,
                                    answer,
                                    answers
                                );
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

                if (answer instanceof Error) {
                    throw answer;
                }

                return answer === undefined ? deafultValue : answer;
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

            /***/
        },

        /***/ 6603: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const $ = exports;

            const el = __nccwpck_require__(9776);

            const noop = (v) => v;

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
                return toPrompt("TextPrompt", args, {
                    onSubmit: (str) => str.split(sep).map((s) => s.trim())
                });
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

                const toSelected = (items) =>
                    items
                        .filter((item) => item.selected)
                        .map((item) => item.value);

                return toPrompt("MultiselectPrompt", args, {
                    onAbort: toSelected,
                    onSubmit: toSelected
                });
            };

            $.autocompleteMultiselect = (args) => {
                args.choices = [].concat(args.choices || []);

                const toSelected = (items) =>
                    items
                        .filter((item) => item.selected)
                        .map((item) => item.value);

                return toPrompt("AutocompleteMultiselectPrompt", args, {
                    onAbort: toSelected,
                    onSubmit: toSelected
                });
            };

            const byTitle = (input, choices) =>
                Promise.resolve(
                    choices.filter(
                        (item) =>
                            item.title.slice(0, input.length).toLowerCase() ===
                            input.toLowerCase()
                    )
                );
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

            /***/
        },

        /***/ 5843: /***/ (module) => {
            "use strict";

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
                if (key.name === "enter") return "submit"; // ctrl + J

                if (key.name === "backspace") return "delete";
                if (key.name === "delete") return "deleteForward";
                if (key.name === "abort") return "abort";
                if (key.name === "escape") return "exit";
                if (key.name === "tab") return "next";
                if (key.name === "pagedown") return "nextPage";
                if (key.name === "pageup") return "prevPage"; // TODO create home() in prompt types (e.g. TextPrompt)

                if (key.name === "home") return "home"; // TODO create end() in prompt types (e.g. TextPrompt)

                if (key.name === "end") return "end";
                if (key.name === "up") return "up";
                if (key.name === "down") return "down";
                if (key.name === "right") return "right";
                if (key.name === "left") return "left";
                return false;
            };

            /***/
        },

        /***/ 804: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            function _createForOfIteratorHelper(o, allowArrayLike) {
                var it =
                    (typeof Symbol !== "undefined" && o[Symbol.iterator]) ||
                    o["@@iterator"];
                if (!it) {
                    if (
                        Array.isArray(o) ||
                        (it = _unsupportedIterableToArray(o)) ||
                        (allowArrayLike && o && typeof o.length === "number")
                    ) {
                        if (it) o = it;
                        var i = 0;
                        var F = function F() {};
                        return {
                            s: F,
                            n: function n() {
                                if (i >= o.length) return { done: true };
                                return { done: false, value: o[i++] };
                            },
                            e: function e(_e) {
                                throw _e;
                            },
                            f: F
                        };
                    }
                    throw new TypeError(
                        "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                    );
                }
                var normalCompletion = true,
                    didErr = false,
                    err;
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
                            if (!normalCompletion && it.return != null)
                                it.return();
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
                if (
                    n === "Arguments" ||
                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                )
                    return _arrayLikeToArray(o, minLen);
            }

            function _arrayLikeToArray(arr, len) {
                if (len == null || len > arr.length) len = arr.length;
                for (var i = 0, arr2 = new Array(len); i < len; i++)
                    arr2[i] = arr[i];
                return arr2;
            }

            const strip = __nccwpck_require__(2439);

            const _require = __nccwpck_require__(7036),
                erase = _require.erase,
                cursor = _require.cursor;

            const width = (str) => [...strip(str)].length;
            /**
             * @param {string} prompt
             * @param {number} perLine
             */

            module.exports = function (prompt, perLine) {
                if (!perLine) return erase.line + cursor.to(0);
                let rows = 0;
                const lines = prompt.split(/\r?\n/);

                var _iterator = _createForOfIteratorHelper(lines),
                    _step;

                try {
                    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                        let line = _step.value;
                        rows +=
                            1 +
                            Math.floor(Math.max(width(line) - 1, 0) / perLine);
                    }
                } catch (err) {
                    _iterator.e(err);
                } finally {
                    _iterator.f();
                }

                return erase.lines(rows);
            };

            /***/
        },

        /***/ 2488: /***/ (module) => {
            "use strict";

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
                let startIndex = Math.min(
                    total - maxVisible,
                    cursor - Math.floor(maxVisible / 2)
                );
                if (startIndex < 0) startIndex = 0;
                let endIndex = Math.min(startIndex + maxVisible, total);
                return {
                    startIndex,
                    endIndex
                };
            };

            /***/
        },

        /***/ 9704: /***/ (module) => {
            "use strict";

            const main = {
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
            const win = {
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
            const figures = process.platform === "win32" ? win : main;
            module.exports = figures;

            /***/
        },

        /***/ 117: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            module.exports = {
                action: __nccwpck_require__(5843),
                clear: __nccwpck_require__(804),
                style: __nccwpck_require__(9112),
                strip: __nccwpck_require__(2439),
                figures: __nccwpck_require__(9704),
                lines: __nccwpck_require__(2038),
                wrap: __nccwpck_require__(8053),
                entriesToDisplay: __nccwpck_require__(2488)
            };

            /***/
        },

        /***/ 2038: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const strip = __nccwpck_require__(2439);
            /**
             * @param {string} msg
             * @param {number} perLine
             */

            module.exports = function (msg, perLine) {
                let lines = String(strip(msg) || "").split(/\r?\n/);
                if (!perLine) return lines.length;
                return lines
                    .map((l) => Math.ceil(l.length / perLine))
                    .reduce((a, b) => a + b);
            };

            /***/
        },

        /***/ 2439: /***/ (module) => {
            "use strict";

            module.exports = (str) => {
                const pattern = [
                    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
                    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"
                ].join("|");
                const RGX = new RegExp(pattern, "g");
                return typeof str === "string" ? str.replace(RGX, "") : str;
            };

            /***/
        },

        /***/ 9112: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const c = __nccwpck_require__(1067);

            const figures = __nccwpck_require__(9704); // rendering user input.

            const styles = Object.freeze({
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

            const render = (type) => styles[type] || styles.default; // icon to signalize a prompt.

            const symbols = Object.freeze({
                aborted: c.red(figures.cross),
                done: c.green(figures.tick),
                exited: c.yellow(figures.cross),
                default: c.cyan("?")
            });

            const symbol = (done, aborted, exited) =>
                aborted
                    ? symbols.aborted
                    : exited
                      ? symbols.exited
                      : done
                        ? symbols.done
                        : symbols.default; // between the question and the user's input.

            const delimiter = (completing) =>
                c.gray(completing ? figures.ellipsis : figures.pointerSmall);

            const item = (expandable, expanded) =>
                c.gray(
                    expandable
                        ? expanded
                            ? figures.pointerSmall
                            : "+"
                        : figures.line
                );

            module.exports = {
                styles,
                render,
                symbols,
                symbol,
                delimiter,
                item
            };

            /***/
        },

        /***/ 8053: /***/ (module) => {
            "use strict";

            /**
             * @param {string} msg The message to wrap
             * @param {object} opts
             * @param {number|string} [opts.margin] Left margin
             * @param {number} opts.width Maximum characters per line including the margin
             */

            module.exports = (msg, opts = {}) => {
                const tab = Number.isSafeInteger(parseInt(opts.margin))
                    ? new Array(parseInt(opts.margin)).fill(" ").join("")
                    : opts.margin || "";
                const width = opts.width;
                return (msg || "")
                    .split(/\r?\n/g)
                    .map((line) =>
                        line
                            .split(/\s+/g)
                            .reduce(
                                (arr, w) => {
                                    if (
                                        w.length + tab.length >= width ||
                                        arr[arr.length - 1].length +
                                            w.length +
                                            1 <
                                            width
                                    )
                                        arr[arr.length - 1] += ` ${w}`;
                                    else arr.push(`${tab}${w}`);
                                    return arr;
                                },
                                [tab]
                            )
                            .join("\n")
                    )
                    .join("\n");
            };

            /***/
        },

        /***/ 4031: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            function isNodeLT(tar) {
                tar = (Array.isArray(tar) ? tar : tar.split(".")).map(Number);
                let i = 0,
                    src = process.versions.node.split(".").map(Number);
                for (; i < tar.length; i++) {
                    if (src[i] > tar[i]) return false;
                    if (tar[i] > src[i]) return true;
                }
                return false;
            }

            module.exports = isNodeLT("8.6.0")
                ? __nccwpck_require__(2804)
                : __nccwpck_require__(2399);

            /***/
        },

        /***/ 385: /***/ (module) => {
            "use strict";

            class DatePart {
                constructor({ token, date, parts, locales }) {
                    this.token = token;
                    this.date = date || new Date();
                    this.parts = parts || [this];
                    this.locales = locales || {};
                }

                up() {}

                down() {}

                next() {
                    const currentIdx = this.parts.indexOf(this);
                    return this.parts.find(
                        (part, idx) =>
                            idx > currentIdx && part instanceof DatePart
                    );
                }

                setTo(val) {}

                prev() {
                    let parts = [].concat(this.parts).reverse();
                    const currentIdx = parts.indexOf(this);
                    return parts.find(
                        (part, idx) =>
                            idx > currentIdx && part instanceof DatePart
                    );
                }

                toString() {
                    return String(this.date);
                }
            }

            module.exports = DatePart;

            /***/
        },

        /***/ 2496: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const DatePart = __nccwpck_require__(385);

            const pos = (n) => {
                n = n % 10;
                return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
            };

            class Day extends DatePart {
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
                    return this.token === "DD"
                        ? String(date).padStart(2, "0")
                        : this.token === "Do"
                          ? date + pos(date)
                          : this.token === "d"
                            ? day + 1
                            : this.token === "ddd"
                              ? this.locales.weekdaysShort[day]
                              : this.token === "dddd"
                                ? this.locales.weekdays[day]
                                : date;
                }
            }

            module.exports = Day;

            /***/
        },

        /***/ 1281: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const DatePart = __nccwpck_require__(385);

            class Hours extends DatePart {
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
                    return this.token.length > 1
                        ? String(hours).padStart(2, "0")
                        : hours;
                }
            }

            module.exports = Hours;

            /***/
        },

        /***/ 918: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            module.exports = {
                DatePart: __nccwpck_require__(385),
                Meridiem: __nccwpck_require__(5042),
                Day: __nccwpck_require__(2496),
                Hours: __nccwpck_require__(1281),
                Milliseconds: __nccwpck_require__(6866),
                Minutes: __nccwpck_require__(4651),
                Month: __nccwpck_require__(3960),
                Seconds: __nccwpck_require__(1211),
                Year: __nccwpck_require__(8901)
            };

            /***/
        },

        /***/ 5042: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const DatePart = __nccwpck_require__(385);

            class Meridiem extends DatePart {
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
                    return /\A/.test(this.token)
                        ? meridiem.toUpperCase()
                        : meridiem;
                }
            }

            module.exports = Meridiem;

            /***/
        },

        /***/ 6866: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const DatePart = __nccwpck_require__(385);

            class Milliseconds extends DatePart {
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
                    this.date.setMilliseconds(
                        parseInt(val.substr(-this.token.length))
                    );
                }

                toString() {
                    return String(this.date.getMilliseconds())
                        .padStart(4, "0")
                        .substr(0, this.token.length);
                }
            }

            module.exports = Milliseconds;

            /***/
        },

        /***/ 4651: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const DatePart = __nccwpck_require__(385);

            class Minutes extends DatePart {
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
                    return this.token.length > 1
                        ? String(m).padStart(2, "0")
                        : m;
                }
            }

            module.exports = Minutes;

            /***/
        },

        /***/ 3960: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const DatePart = __nccwpck_require__(385);

            class Month extends DatePart {
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
                    return tl === 2
                        ? String(month + 1).padStart(2, "0")
                        : tl === 3
                          ? this.locales.monthsShort[month]
                          : tl === 4
                            ? this.locales.months[month]
                            : String(month + 1);
                }
            }

            module.exports = Month;

            /***/
        },

        /***/ 1211: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const DatePart = __nccwpck_require__(385);

            class Seconds extends DatePart {
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
                    return this.token.length > 1
                        ? String(s).padStart(2, "0")
                        : s;
                }
            }

            module.exports = Seconds;

            /***/
        },

        /***/ 8901: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const DatePart = __nccwpck_require__(385);

            class Year extends DatePart {
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
            }

            module.exports = Year;

            /***/
        },

        /***/ 3425: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const color = __nccwpck_require__(1067);
            const Prompt = __nccwpck_require__(4531);
            const { erase, cursor } = __nccwpck_require__(7036);
            const { style, clear, figures, wrap, entriesToDisplay } =
                __nccwpck_require__(9832);

            const getVal = (arr, i) =>
                arr[i] && (arr[i].value || arr[i].title || arr[i]);
            const getTitle = (arr, i) =>
                arr[i] && (arr[i].title || arr[i].value || arr[i]);
            const getIndex = (arr, valOrTitle) => {
                const index = arr.findIndex(
                    (el) => el.value === valOrTitle || el.title === valOrTitle
                );
                return index > -1 ? index : undefined;
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
            class AutocompletePrompt extends Prompt {
                constructor(opts = {}) {
                    super(opts);
                    this.msg = opts.message;
                    this.suggest = opts.suggest;
                    this.choices = opts.choices;
                    this.initial =
                        typeof opts.initial === "number"
                            ? opts.initial
                            : getIndex(opts.choices, opts.initial);
                    this.select = this.initial || opts.cursor || 0;
                    this.i18n = {
                        noMatches: opts.noMatches || "no matches found"
                    };
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
                    this._fb = Number.isSafeInteger(parseInt(fb))
                        ? parseInt(fb)
                        : fb;
                }

                get fallback() {
                    let choice;
                    if (typeof this._fb === "number")
                        choice = this.choices[this._fb];
                    else if (typeof this._fb === "string")
                        choice = { title: this._fb };
                    return choice || this._fb || { title: this.i18n.noMatches };
                }

                moveSelect(i) {
                    this.select = i;
                    if (this.suggestions.length > 0)
                        this.value = getVal(this.suggestions, i);
                    else this.value = this.fallback.value;
                    this.fire();
                }

                async complete(cb) {
                    const p = (this.completing = this.suggest(
                        this.input,
                        this.choices
                    ));
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
                        this.moveSelect(
                            this.initial !== void 0 ? this.initial : 0
                        );
                        this.render();
                    });
                    this.render();
                }

                exit() {
                    if (this.clearFirst && this.input.length > 0) {
                        this.reset();
                    } else {
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
                    let s2 = this.input.slice(this.cursor);
                    this.input = `${s1}${c}${s2}`;
                    this.cursor = s1.length + 1;
                    this.complete(this.render);
                    this.render();
                }

                delete() {
                    if (this.cursor === 0) return this.bell();
                    let s1 = this.input.slice(0, this.cursor - 1);
                    let s2 = this.input.slice(this.cursor);
                    this.input = `${s1}${s2}`;
                    this.complete(this.render);
                    this.cursor = this.cursor - 1;
                    this.render();
                }

                deleteForward() {
                    if (this.cursor * this.scale >= this.rendered.length)
                        return this.bell();
                    let s1 = this.input.slice(0, this.cursor);
                    let s2 = this.input.slice(this.cursor + 1);
                    this.input = `${s1}${s2}`;
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
                    if (this.select === 0) {
                        this.moveSelect(this.suggestions.length - 1);
                    } else {
                        this.moveSelect(this.select - 1);
                    }
                    this.render();
                }

                down() {
                    if (this.select === this.suggestions.length - 1) {
                        this.moveSelect(0);
                    } else {
                        this.moveSelect(this.select + 1);
                    }
                    this.render();
                }

                next() {
                    if (this.select === this.suggestions.length - 1) {
                        this.moveSelect(0);
                    } else this.moveSelect(this.select + 1);
                    this.render();
                }

                nextPage() {
                    this.moveSelect(
                        Math.min(
                            this.select + this.limit,
                            this.suggestions.length - 1
                        )
                    );
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
                    if (this.cursor * this.scale >= this.rendered.length)
                        return this.bell();
                    this.cursor = this.cursor + 1;
                    this.render();
                }

                renderOption(v, hovered, isStart, isEnd) {
                    let desc;
                    let prefix = isStart
                        ? figures.arrowUp
                        : isEnd
                          ? figures.arrowDown
                          : " ";
                    let title = hovered
                        ? color.cyan().underline(v.title)
                        : v.title;
                    prefix =
                        (hovered ? color.cyan(figures.pointer) + " " : "  ") +
                        prefix;
                    if (v.description) {
                        desc = ` - ${v.description}`;
                        if (
                            prefix.length + title.length + desc.length >=
                                this.out.columns ||
                            v.description.split(/\r?\n/).length > 1
                        ) {
                            desc =
                                "\n" +
                                wrap(v.description, {
                                    margin: 3,
                                    width: this.out.columns
                                });
                        }
                    }
                    return prefix + " " + title + color.gray(desc || "");
                }

                render() {
                    if (this.closed) return;
                    if (this.firstRender) this.out.write(cursor.hide);
                    else
                        this.out.write(
                            clear(this.outputText, this.out.columns)
                        );
                    super.render();

                    let { startIndex, endIndex } = entriesToDisplay(
                        this.select,
                        this.choices.length,
                        this.limit
                    );

                    this.outputText = [
                        style.symbol(this.done, this.aborted, this.exited),
                        color.bold(this.msg),
                        style.delimiter(this.completing),
                        this.done && this.suggestions[this.select]
                            ? this.suggestions[this.select].title
                            : (this.rendered = this.transform.render(
                                  this.input
                              ))
                    ].join(" ");

                    if (!this.done) {
                        const suggestions = this.suggestions
                            .slice(startIndex, endIndex)
                            .map((item, i) =>
                                this.renderOption(
                                    item,
                                    this.select === i + startIndex,
                                    i === 0 && startIndex > 0,
                                    i + startIndex === endIndex - 1 &&
                                        endIndex < this.choices.length
                                )
                            )
                            .join("\n");
                        this.outputText +=
                            `\n` +
                            (suggestions || color.gray(this.fallback.title));
                    }

                    this.out.write(erase.line + cursor.to(0) + this.outputText);
                }
            }

            module.exports = AutocompletePrompt;

            /***/
        },

        /***/ 3620: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const color = __nccwpck_require__(1067);
            const { cursor } = __nccwpck_require__(7036);
            const MultiselectPrompt = __nccwpck_require__(4684);
            const { clear, style, figures } = __nccwpck_require__(9832);
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
            class AutocompleteMultiselectPrompt extends MultiselectPrompt {
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
                    this.cursor =
                        (this.cursor + 1) % this.filteredOptions.length;
                    this.render();
                }

                up() {
                    if (this.cursor === 0) {
                        this.cursor = this.filteredOptions.length - 1;
                    } else {
                        this.cursor--;
                    }
                    this.render();
                }

                down() {
                    if (this.cursor === this.filteredOptions.length - 1) {
                        this.cursor = 0;
                    } else {
                        this.cursor++;
                    }
                    this.render();
                }

                left() {
                    this.filteredOptions[this.cursor].selected = false;
                    this.render();
                }

                right() {
                    if (
                        this.value.filter((e) => e.selected).length >=
                        this.maxChoices
                    )
                        return this.bell();
                    this.filteredOptions[this.cursor].selected = true;
                    this.render();
                }

                delete() {
                    if (this.inputValue.length) {
                        this.inputValue = this.inputValue.substr(
                            0,
                            this.inputValue.length - 1
                        );
                        this.updateFilteredOptions();
                    }
                }

                updateFilteredOptions() {
                    const currentHighlight = this.filteredOptions[this.cursor];
                    this.filteredOptions = this.value.filter((v) => {
                        if (this.inputValue) {
                            if (typeof v.title === "string") {
                                if (
                                    v.title
                                        .toLowerCase()
                                        .includes(this.inputValue.toLowerCase())
                                ) {
                                    return true;
                                }
                            }
                            if (typeof v.value === "string") {
                                if (
                                    v.value
                                        .toLowerCase()
                                        .includes(this.inputValue.toLowerCase())
                                ) {
                                    return true;
                                }
                            }
                            return false;
                        }
                        return true;
                    });
                    const newHighlightIndex = this.filteredOptions.findIndex(
                        (v) => v === currentHighlight
                    );
                    this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
                    this.render();
                }

                handleSpaceToggle() {
                    const v = this.filteredOptions[this.cursor];

                    if (v.selected) {
                        v.selected = false;
                        this.render();
                    } else if (
                        v.disabled ||
                        this.value.filter((e) => e.selected).length >=
                            this.maxChoices
                    ) {
                        return this.bell();
                    } else {
                        v.selected = true;
                        this.render();
                    }
                }

                handleInputChange(c) {
                    this.inputValue = this.inputValue + c;
                    this.updateFilteredOptions();
                }

                _(c, key) {
                    if (c === " ") {
                        this.handleSpaceToggle();
                    } else {
                        this.handleInputChange(c);
                    }
                }

                renderInstructions() {
                    if (this.instructions === undefined || this.instructions) {
                        if (typeof this.instructions === "string") {
                            return this.instructions;
                        }
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
                    if (v.disabled)
                        title =
                            cursor === i
                                ? color.gray().underline(v.title)
                                : color.strikethrough().gray(v.title);
                    else
                        title =
                            cursor === i
                                ? color.cyan().underline(v.title)
                                : v.title;
                    return (
                        (v.selected
                            ? color.green(figures.radioOn)
                            : figures.radioOff) +
                        "  " +
                        title
                    );
                }

                renderDoneOrInstructions() {
                    if (this.done) {
                        return this.value
                            .filter((e) => e.selected)
                            .map((v) => v.title)
                            .join(", ");
                    }

                    const output = [
                        color.gray(this.hint),
                        this.renderInstructions(),
                        this.renderCurrentInput()
                    ];

                    if (
                        this.filteredOptions.length &&
                        this.filteredOptions[this.cursor].disabled
                    ) {
                        output.push(color.yellow(this.warn));
                    }
                    return output.join(" ");
                }

                render() {
                    if (this.closed) return;
                    if (this.firstRender) this.out.write(cursor.hide);
                    super.render();

                    // print prompt

                    let prompt = [
                        style.symbol(this.done, this.aborted),
                        color.bold(this.msg),
                        style.delimiter(false),
                        this.renderDoneOrInstructions()
                    ].join(" ");

                    if (this.showMinError) {
                        prompt += color.red(
                            `You must select a minimum of ${this.minSelected} choices.`
                        );
                        this.showMinError = false;
                    }
                    prompt += this.renderOptions(this.filteredOptions);

                    this.out.write(this.clear + prompt);
                    this.clear = clear(prompt, this.out.columns);
                }
            }

            module.exports = AutocompleteMultiselectPrompt;

            /***/
        },

        /***/ 3073: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            const color = __nccwpck_require__(1067);
            const Prompt = __nccwpck_require__(4531);
            const { style, clear } = __nccwpck_require__(9832);
            const { erase, cursor } = __nccwpck_require__(7036);

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
            class ConfirmPrompt extends Prompt {
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
                    else
                        this.out.write(
                            clear(this.outputText, this.out.columns)
                        );
                    super.render();

                    this.outputText = [
                        style.symbol(this.done, this.aborted),
                        color.bold(this.msg),
                        style.delimiter(this.done),
                        this.done
                            ? this.value
                                ? this.yesMsg
                                : this.noMsg
                            : color.gray(
                                  this.initialValue
                                      ? this.yesOption
                                      : this.noOption
                              )
                    ].join(" ");

                    this.out.write(erase.line + cursor.to(0) + this.outputText);
                }
            }

            module.exports = ConfirmPrompt;

            /***/
        },

        /***/ 7989: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const color = __nccwpck_require__(1067);
            const Prompt = __nccwpck_require__(4531);
            const { style, clear, figures } = __nccwpck_require__(9832);
            const { erase, cursor } = __nccwpck_require__(7036);
            const {
                DatePart,
                Meridiem,
                Day,
                Hours,
                Milliseconds,
                Minutes,
                Month,
                Seconds,
                Year
            } = __nccwpck_require__(918);

            const regex =
                /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
            const regexGroups = {
                1: ({ token }) => token.replace(/\\(.)/g, "$1"),
                2: (opts) => new Day(opts), // Day // TODO
                3: (opts) => new Month(opts), // Month
                4: (opts) => new Year(opts), // Year
                5: (opts) => new Meridiem(opts), // AM/PM // TODO (special)
                6: (opts) => new Hours(opts), // Hours
                7: (opts) => new Minutes(opts), // Minutes
                8: (opts) => new Seconds(opts), // Seconds
                9: (opts) => new Milliseconds(opts) // Fractional seconds
            };

            const dfltLocales = {
                months: "January,February,March,April,May,June,July,August,September,October,November,December".split(
                    ","
                ),
                monthsShort:
                    "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(
                        ","
                    ),
                weekdays:
                    "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(
                        ","
                    ),
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
            class DatePrompt extends Prompt {
                constructor(opts = {}) {
                    super(opts);
                    this.msg = opts.message;
                    this.cursor = 0;
                    this.typed = "";
                    this.locales = Object.assign(dfltLocales, opts.locales);
                    this._date = opts.initial || new Date();
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
                    while ((result = regex.exec(mask))) {
                        let match = result.shift();
                        let idx = result.findIndex((gr) => gr != null);
                        this.parts.push(
                            idx in regexGroups
                                ? regexGroups[idx]({
                                      token: result[idx] || match,
                                      date: this.date,
                                      parts: this.parts,
                                      locales: this.locales
                                  })
                                : result[idx] || match
                        );
                    }

                    let parts = this.parts.reduce((arr, i) => {
                        if (
                            typeof i === "string" &&
                            typeof arr[arr.length - 1] === "string"
                        )
                            arr[arr.length - 1] += i;
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
                    this.moveCursor(
                        this.parts.findIndex((p) => p instanceof DatePart)
                    );
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
                    this.moveCursor(
                        next
                            ? this.parts.indexOf(next)
                            : this.parts.findIndex(
                                  (part) => part instanceof DatePart
                              )
                    );
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
                    else
                        this.out.write(
                            clear(this.outputText, this.out.columns)
                        );
                    super.render();

                    // Print prompt
                    this.outputText = [
                        style.symbol(this.done, this.aborted),
                        color.bold(this.msg),
                        style.delimiter(false),
                        this.parts
                            .reduce(
                                (arr, p, idx) =>
                                    arr.concat(
                                        idx === this.cursor && !this.done
                                            ? color
                                                  .cyan()
                                                  .underline(p.toString())
                                            : p
                                    ),
                                []
                            )
                            .join("")
                    ].join(" ");

                    // Print error
                    if (this.error) {
                        this.outputText += this.errorMsg
                            .split("\n")
                            .reduce(
                                (a, l, i) =>
                                    a +
                                    `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`,
                                ``
                            );
                    }

                    this.out.write(erase.line + cursor.to(0) + this.outputText);
                }
            }

            module.exports = DatePrompt;

            /***/
        },

        /***/ 8245: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            module.exports = {
                TextPrompt: __nccwpck_require__(5798),
                SelectPrompt: __nccwpck_require__(6129),
                TogglePrompt: __nccwpck_require__(225),
                DatePrompt: __nccwpck_require__(7989),
                NumberPrompt: __nccwpck_require__(9536),
                MultiselectPrompt: __nccwpck_require__(4684),
                AutocompletePrompt: __nccwpck_require__(3425),
                AutocompleteMultiselectPrompt: __nccwpck_require__(3620),
                ConfirmPrompt: __nccwpck_require__(3073)
            };

            /***/
        },

        /***/ 4684: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const color = __nccwpck_require__(1067);
            const { cursor } = __nccwpck_require__(7036);
            const Prompt = __nccwpck_require__(4531);
            const { clear, figures, style, wrap, entriesToDisplay } =
                __nccwpck_require__(9832);

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
            class MultiselectPrompt extends Prompt {
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
                        if (typeof ch === "string")
                            ch = { title: ch, value: idx };
                        return {
                            title: ch && (ch.title || ch.value || ch),
                            description: ch && ch.description,
                            value:
                                ch && (ch.value === undefined ? idx : ch.value),
                            selected: ch && ch.selected,
                            disabled: ch && ch.disabled
                        };
                    });
                    this.clear = clear("", this.out.columns);
                    if (!opts.overrideRender) {
                        this.render();
                    }
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
                    if (
                        this.minSelected &&
                        selected.length < this.minSelected
                    ) {
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
                    if (this.cursor === 0) {
                        this.cursor = this.value.length - 1;
                    } else {
                        this.cursor--;
                    }
                    this.render();
                }

                down() {
                    if (this.cursor === this.value.length - 1) {
                        this.cursor = 0;
                    } else {
                        this.cursor++;
                    }
                    this.render();
                }

                left() {
                    this.value[this.cursor].selected = false;
                    this.render();
                }

                right() {
                    if (
                        this.value.filter((e) => e.selected).length >=
                        this.maxChoices
                    )
                        return this.bell();
                    this.value[this.cursor].selected = true;
                    this.render();
                }

                handleSpaceToggle() {
                    const v = this.value[this.cursor];

                    if (v.selected) {
                        v.selected = false;
                        this.render();
                    } else if (
                        v.disabled ||
                        this.value.filter((e) => e.selected).length >=
                            this.maxChoices
                    ) {
                        return this.bell();
                    } else {
                        v.selected = true;
                        this.render();
                    }
                }

                toggleAll() {
                    if (
                        this.maxChoices !== undefined ||
                        this.value[this.cursor].disabled
                    ) {
                        return this.bell();
                    }

                    const newSelected = !this.value[this.cursor].selected;
                    this.value
                        .filter((v) => !v.disabled)
                        .forEach((v) => (v.selected = newSelected));
                    this.render();
                }

                _(c, key) {
                    if (c === " ") {
                        this.handleSpaceToggle();
                    } else if (c === "a") {
                        this.toggleAll();
                    } else {
                        return this.bell();
                    }
                }

                renderInstructions() {
                    if (this.instructions === undefined || this.instructions) {
                        if (typeof this.instructions === "string") {
                            return this.instructions;
                        }
                        return (
                            "\nInstructions:\n" +
                            `    ${figures.arrowUp}/${figures.arrowDown}: Highlight option\n` +
                            `    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection\n` +
                            (this.maxChoices === undefined
                                ? `    a: Toggle all\n`
                                : "") +
                            `    enter/return: Complete answer`
                        );
                    }
                    return "";
                }

                renderOption(cursor, v, i, arrowIndicator) {
                    const prefix =
                        (v.selected
                            ? color.green(figures.radioOn)
                            : figures.radioOff) +
                        " " +
                        arrowIndicator +
                        " ";
                    let title, desc;

                    if (v.disabled) {
                        title =
                            cursor === i
                                ? color.gray().underline(v.title)
                                : color.strikethrough().gray(v.title);
                    } else {
                        title =
                            cursor === i
                                ? color.cyan().underline(v.title)
                                : v.title;
                        if (cursor === i && v.description) {
                            desc = ` - ${v.description}`;
                            if (
                                prefix.length + title.length + desc.length >=
                                    this.out.columns ||
                                v.description.split(/\r?\n/).length > 1
                            ) {
                                desc =
                                    "\n" +
                                    wrap(v.description, {
                                        margin: prefix.length,
                                        width: this.out.columns
                                    });
                            }
                        }
                    }

                    return prefix + title + color.gray(desc || "");
                }

                // shared with autocompleteMultiselect
                paginateOptions(options) {
                    if (options.length === 0) {
                        return color.red("No matches for this query.");
                    }

                    let { startIndex, endIndex } = entriesToDisplay(
                        this.cursor,
                        options.length,
                        this.optionsPerPage
                    );
                    let prefix,
                        styledOptions = [];

                    for (let i = startIndex; i < endIndex; i++) {
                        if (i === startIndex && startIndex > 0) {
                            prefix = figures.arrowUp;
                        } else if (
                            i === endIndex - 1 &&
                            endIndex < options.length
                        ) {
                            prefix = figures.arrowDown;
                        } else {
                            prefix = " ";
                        }
                        styledOptions.push(
                            this.renderOption(
                                this.cursor,
                                options[i],
                                i,
                                prefix
                            )
                        );
                    }

                    return "\n" + styledOptions.join("\n");
                }

                // shared with autocomleteMultiselect
                renderOptions(options) {
                    if (!this.done) {
                        return this.paginateOptions(options);
                    }
                    return "";
                }

                renderDoneOrInstructions() {
                    if (this.done) {
                        return this.value
                            .filter((e) => e.selected)
                            .map((v) => v.title)
                            .join(", ");
                    }

                    const output = [
                        color.gray(this.hint),
                        this.renderInstructions()
                    ];

                    if (this.value[this.cursor].disabled) {
                        output.push(color.yellow(this.warn));
                    }
                    return output.join(" ");
                }

                render() {
                    if (this.closed) return;
                    if (this.firstRender) this.out.write(cursor.hide);
                    super.render();

                    // print prompt
                    let prompt = [
                        style.symbol(this.done, this.aborted),
                        color.bold(this.msg),
                        style.delimiter(false),
                        this.renderDoneOrInstructions()
                    ].join(" ");
                    if (this.showMinError) {
                        prompt += color.red(
                            `You must select a minimum of ${this.minSelected} choices.`
                        );
                        this.showMinError = false;
                    }
                    prompt += this.renderOptions(this.value);

                    this.out.write(this.clear + prompt);
                    this.clear = clear(prompt, this.out.columns);
                }
            }

            module.exports = MultiselectPrompt;

            /***/
        },

        /***/ 9536: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            const color = __nccwpck_require__(1067);
            const Prompt = __nccwpck_require__(4531);
            const { cursor, erase } = __nccwpck_require__(7036);
            const { style, figures, clear, lines } = __nccwpck_require__(9832);

            const isNumber = /[0-9]/;
            const isDef = (any) => any !== undefined;
            const round = (number, precision) => {
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
            class NumberPrompt extends Prompt {
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
                        this.rendered = color.gray(
                            this.transform.render(`${this.initial}`)
                        );
                        this._value = ``;
                    } else {
                        this.placeholder = false;
                        this.rendered = this.transform.render(
                            `${round(v, this.round)}`
                        );
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
                    return (
                        c === `-` ||
                        (c === `.` && this.float) ||
                        isNumber.test(c)
                    );
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
                    if (this.value === "") {
                        this.value = this.min - this.inc;
                    }
                    if (this.value >= this.max) return this.bell();
                    this.value += this.inc;
                    this.color = `cyan`;
                    this.fire();
                    this.render();
                }

                down() {
                    this.typed = ``;
                    if (this.value === "") {
                        this.value = this.min + this.inc;
                    }
                    if (this.value <= this.min) return this.bell();
                    this.value -= this.inc;
                    this.color = `cyan`;
                    this.fire();
                    this.render();
                }

                delete() {
                    let val = this.value.toString();
                    if (val.length === 0) return this.bell();
                    this.value = this.parse((val = val.slice(0, -1))) || ``;
                    if (this.value !== "" && this.value < this.min) {
                        this.value = this.min;
                    }
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
                    if (now - this.lastHit > 1000) this.typed = ``; // 1s elapsed
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
                        if (this.outputError)
                            this.out.write(
                                cursor.down(
                                    lines(this.outputError, this.out.columns) -
                                        1
                                ) + clear(this.outputError, this.out.columns)
                            );
                        this.out.write(
                            clear(this.outputText, this.out.columns)
                        );
                    }
                    super.render();
                    this.outputError = "";

                    // Print prompt
                    this.outputText = [
                        style.symbol(this.done, this.aborted),
                        color.bold(this.msg),
                        style.delimiter(this.done),
                        !this.done || (!this.done && !this.placeholder)
                            ? color[this.color]().underline(this.rendered)
                            : this.rendered
                    ].join(` `);

                    // Print error
                    if (this.error) {
                        this.outputError += this.errorMsg
                            .split(`\n`)
                            .reduce(
                                (a, l, i) =>
                                    a +
                                    `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`,
                                ``
                            );
                    }

                    this.out.write(
                        erase.line +
                            cursor.to(0) +
                            this.outputText +
                            cursor.save +
                            this.outputError +
                            cursor.restore
                    );
                }
            }

            module.exports = NumberPrompt;

            /***/
        },

        /***/ 4531: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const readline = __nccwpck_require__(3785);
            const { action } = __nccwpck_require__(9832);
            const EventEmitter = __nccwpck_require__(4434);
            const { beep, cursor } = __nccwpck_require__(7036);
            const color = __nccwpck_require__(1067);

            /**
             * Base prompt skeleton
             * @param {Stream} [opts.stdin] The Readable stream to listen to
             * @param {Stream} [opts.stdout] The Writable stream to write readline data to
             */
            class Prompt extends EventEmitter {
                constructor(opts = {}) {
                    super();

                    this.firstRender = true;
                    this.in = opts.stdin || process.stdin;
                    this.out = opts.stdout || process.stdout;
                    this.onRender = (opts.onRender || (() => void 0)).bind(
                        this
                    );
                    const rl = readline.createInterface({
                        input: this.in,
                        escapeCodeTimeout: 50
                    });
                    readline.emitKeypressEvents(this.in, rl);

                    if (this.in.isTTY) this.in.setRawMode(true);
                    const isSelect =
                        ["SelectPrompt", "MultiselectPrompt"].indexOf(
                            this.constructor.name
                        ) > -1;
                    const keypress = (str, key) => {
                        let a = action(key, isSelect);
                        if (a === false) {
                            this._ && this._(str, key);
                        } else if (typeof this[a] === "function") {
                            this[a](key);
                        } else {
                            this.bell();
                        }
                    };

                    this.close = () => {
                        this.out.write(cursor.show);
                        this.in.removeListener("keypress", keypress);
                        if (this.in.isTTY) this.in.setRawMode(false);
                        rl.close();
                        this.emit(
                            this.aborted
                                ? "abort"
                                : this.exited
                                  ? "exit"
                                  : "submit",
                            this.value
                        );
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
            }

            module.exports = Prompt;

            /***/
        },

        /***/ 6129: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const color = __nccwpck_require__(1067);
            const Prompt = __nccwpck_require__(4531);
            const { style, clear, figures, wrap, entriesToDisplay } =
                __nccwpck_require__(9832);
            const { cursor } = __nccwpck_require__(7036);

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
            class SelectPrompt extends Prompt {
                constructor(opts = {}) {
                    super(opts);
                    this.msg = opts.message;
                    this.hint =
                        opts.hint || "- Use arrow-keys. Return to submit.";
                    this.warn = opts.warn || "- This option is disabled";
                    this.cursor = opts.initial || 0;
                    this.choices = opts.choices.map((ch, idx) => {
                        if (typeof ch === "string")
                            ch = { title: ch, value: idx };
                        return {
                            title: ch && (ch.title || ch.value || ch),
                            value:
                                ch && (ch.value === undefined ? idx : ch.value),
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
                    if (this.cursor === 0) {
                        this.moveCursor(this.choices.length - 1);
                    } else {
                        this.moveCursor(this.cursor - 1);
                    }
                    this.render();
                }

                down() {
                    if (this.cursor === this.choices.length - 1) {
                        this.moveCursor(0);
                    } else {
                        this.moveCursor(this.cursor + 1);
                    }
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
                    else
                        this.out.write(
                            clear(this.outputText, this.out.columns)
                        );
                    super.render();

                    let { startIndex, endIndex } = entriesToDisplay(
                        this.cursor,
                        this.choices.length,
                        this.optionsPerPage
                    );

                    // Print prompt
                    this.outputText = [
                        style.symbol(this.done, this.aborted),
                        color.bold(this.msg),
                        style.delimiter(false),
                        this.done
                            ? this.selection.title
                            : this.selection.disabled
                              ? color.yellow(this.warn)
                              : color.gray(this.hint)
                    ].join(" ");

                    // Print choices
                    if (!this.done) {
                        this.outputText += "\n";
                        for (let i = startIndex; i < endIndex; i++) {
                            let title,
                                prefix,
                                desc = "",
                                v = this.choices[i];

                            // Determine whether to display "more choices" indicators
                            if (i === startIndex && startIndex > 0) {
                                prefix = figures.arrowUp;
                            } else if (
                                i === endIndex - 1 &&
                                endIndex < this.choices.length
                            ) {
                                prefix = figures.arrowDown;
                            } else {
                                prefix = " ";
                            }

                            if (v.disabled) {
                                title =
                                    this.cursor === i
                                        ? color.gray().underline(v.title)
                                        : color.strikethrough().gray(v.title);
                                prefix =
                                    (this.cursor === i
                                        ? color.bold().gray(figures.pointer) +
                                          " "
                                        : "  ") + prefix;
                            } else {
                                title =
                                    this.cursor === i
                                        ? color.cyan().underline(v.title)
                                        : v.title;
                                prefix =
                                    (this.cursor === i
                                        ? color.cyan(figures.pointer) + " "
                                        : "  ") + prefix;
                                if (v.description && this.cursor === i) {
                                    desc = ` - ${v.description}`;
                                    if (
                                        prefix.length +
                                            title.length +
                                            desc.length >=
                                            this.out.columns ||
                                        v.description.split(/\r?\n/).length > 1
                                    ) {
                                        desc =
                                            "\n" +
                                            wrap(v.description, {
                                                margin: 3,
                                                width: this.out.columns
                                            });
                                    }
                                }
                            }

                            this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
                        }
                    }

                    this.out.write(this.outputText);
                }
            }

            module.exports = SelectPrompt;

            /***/
        },

        /***/ 5798: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            const color = __nccwpck_require__(1067);
            const Prompt = __nccwpck_require__(4531);
            const { erase, cursor } = __nccwpck_require__(7036);
            const { style, clear, lines, figures } = __nccwpck_require__(9832);

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
            class TextPrompt extends Prompt {
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
                        this.rendered = color.gray(
                            this.transform.render(this.initial)
                        );
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
                    let s2 = this.value.slice(this.cursor);
                    this.value = `${s1}${c}${s2}`;
                    this.red = false;
                    this.cursor = this.placeholder ? 0 : s1.length + 1;
                    this.render();
                }

                delete() {
                    if (this.isCursorAtStart()) return this.bell();
                    let s1 = this.value.slice(0, this.cursor - 1);
                    let s2 = this.value.slice(this.cursor);
                    this.value = `${s1}${s2}`;
                    this.red = false;
                    if (this.isCursorAtStart()) {
                        this.cursorOffset = 0;
                    } else {
                        this.cursorOffset++;
                        this.moveCursor(-1);
                    }
                    this.render();
                }

                deleteForward() {
                    if (
                        this.cursor * this.scale >= this.rendered.length ||
                        this.placeholder
                    )
                        return this.bell();
                    let s1 = this.value.slice(0, this.cursor);
                    let s2 = this.value.slice(this.cursor + 1);
                    this.value = `${s1}${s2}`;
                    this.red = false;
                    if (this.isCursorAtEnd()) {
                        this.cursorOffset = 0;
                    } else {
                        this.cursorOffset++;
                    }
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
                    if (this.cursor <= 0 || this.placeholder)
                        return this.bell();
                    this.moveCursor(-1);
                    this.render();
                }

                right() {
                    if (
                        this.cursor * this.scale >= this.rendered.length ||
                        this.placeholder
                    )
                        return this.bell();
                    this.moveCursor(1);
                    this.render();
                }

                isCursorAtStart() {
                    return (
                        this.cursor === 0 ||
                        (this.placeholder && this.cursor === 1)
                    );
                }

                isCursorAtEnd() {
                    return (
                        this.cursor === this.rendered.length ||
                        (this.placeholder &&
                            this.cursor === this.rendered.length + 1)
                    );
                }

                render() {
                    if (this.closed) return;
                    if (!this.firstRender) {
                        if (this.outputError)
                            this.out.write(
                                cursor.down(
                                    lines(this.outputError, this.out.columns) -
                                        1
                                ) + clear(this.outputError, this.out.columns)
                            );
                        this.out.write(
                            clear(this.outputText, this.out.columns)
                        );
                    }
                    super.render();
                    this.outputError = "";

                    this.outputText = [
                        style.symbol(this.done, this.aborted),
                        color.bold(this.msg),
                        style.delimiter(this.done),
                        this.red ? color.red(this.rendered) : this.rendered
                    ].join(` `);

                    if (this.error) {
                        this.outputError += this.errorMsg
                            .split(`\n`)
                            .reduce(
                                (a, l, i) =>
                                    a +
                                    `\n${i ? " " : figures.pointerSmall} ${color.red().italic(l)}`,
                                ``
                            );
                    }

                    this.out.write(
                        erase.line +
                            cursor.to(0) +
                            this.outputText +
                            cursor.save +
                            this.outputError +
                            cursor.restore +
                            cursor.move(this.cursorOffset, 0)
                    );
                }
            }

            module.exports = TextPrompt;

            /***/
        },

        /***/ 225: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            const color = __nccwpck_require__(1067);
            const Prompt = __nccwpck_require__(4531);
            const { style, clear } = __nccwpck_require__(9832);
            const { cursor, erase } = __nccwpck_require__(7036);

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
            class TogglePrompt extends Prompt {
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
                    if (c === " ") {
                        this.value = !this.value;
                    } else if (c === "1") {
                        this.value = true;
                    } else if (c === "0") {
                        this.value = false;
                    } else return this.bell();
                    this.render();
                }

                render() {
                    if (this.closed) return;
                    if (this.firstRender) this.out.write(cursor.hide);
                    else
                        this.out.write(
                            clear(this.outputText, this.out.columns)
                        );
                    super.render();

                    this.outputText = [
                        style.symbol(this.done, this.aborted),
                        color.bold(this.msg),
                        style.delimiter(this.done),
                        this.value
                            ? this.inactive
                            : color.cyan().underline(this.inactive),
                        color.gray("/"),
                        this.value
                            ? color.cyan().underline(this.active)
                            : this.active
                    ].join(" ");

                    this.out.write(erase.line + cursor.to(0) + this.outputText);
                }
            }

            module.exports = TogglePrompt;

            /***/
        },

        /***/ 2399: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const prompts = __nccwpck_require__(4536);

            const passOn = [
                "suggest",
                "format",
                "onState",
                "validate",
                "onRender",
                "type"
            ];
            const noop = () => {};

            /**
             * Prompt for a series of questions
             * @param {Array|Object} questions Single question object or Array of question objects
             * @param {Function} [onSubmit] Callback function called on prompt submit
             * @param {Function} [onCancel] Callback function called on cancel/abort
             * @returns {Object} Object with values from user input
             */
            async function prompt(
                questions = [],
                { onSubmit = noop, onCancel = noop } = {}
            ) {
                const answers = {};
                const override = prompt._override || {};
                questions = [].concat(questions);
                let answer, question, quit, name, type, lastPrompt;

                const getFormattedAnswer = async (
                    question,
                    answer,
                    skipValidation = false
                ) => {
                    if (
                        !skipValidation &&
                        question.validate &&
                        question.validate(answer) !== true
                    ) {
                        return;
                    }
                    return question.format
                        ? await question.format(answer, answers)
                        : answer;
                };

                for (question of questions) {
                    ({ name, type } = question);

                    // evaluate type first and skip if type is a falsy value
                    if (typeof type === "function") {
                        type = await type(answer, { ...answers }, question);
                        question["type"] = type;
                    }
                    if (!type) continue;

                    // if property is a function, invoke it unless it's a special function
                    for (let key in question) {
                        if (passOn.includes(key)) continue;
                        let value = question[key];
                        question[key] =
                            typeof value === "function"
                                ? await value(
                                      answer,
                                      { ...answers },
                                      lastPrompt
                                  )
                                : value;
                    }

                    lastPrompt = question;

                    if (typeof question.message !== "string") {
                        throw new Error("prompt message is required");
                    }

                    // update vars in case they changed
                    ({ name, type } = question);

                    if (prompts[type] === void 0) {
                        throw new Error(`prompt type (${type}) is not defined`);
                    }

                    if (override[question.name] !== undefined) {
                        answer = await getFormattedAnswer(
                            question,
                            override[question.name]
                        );
                        if (answer !== undefined) {
                            answers[name] = answer;
                            continue;
                        }
                    }

                    try {
                        // Get the injected answer if there is one or prompt the user
                        answer = prompt._injected
                            ? getInjectedAnswer(
                                  prompt._injected,
                                  question.initial
                              )
                            : await prompts[type](question);
                        answers[name] = answer = await getFormattedAnswer(
                            question,
                            answer,
                            true
                        );
                        quit = await onSubmit(question, answer, answers);
                    } catch (err) {
                        quit = !(await onCancel(question, answers));
                    }

                    if (quit) return answers;
                }

                return answers;
            }

            function getInjectedAnswer(injected, deafultValue) {
                const answer = injected.shift();
                if (answer instanceof Error) {
                    throw answer;
                }

                return answer === undefined ? deafultValue : answer;
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

            /***/
        },

        /***/ 4536: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const $ = exports;
            const el = __nccwpck_require__(8245);
            const noop = (v) => v;

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
                return toPrompt("TextPrompt", args, {
                    onSubmit: (str) => str.split(sep).map((s) => s.trim())
                });
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
                const toSelected = (items) =>
                    items
                        .filter((item) => item.selected)
                        .map((item) => item.value);
                return toPrompt("MultiselectPrompt", args, {
                    onAbort: toSelected,
                    onSubmit: toSelected
                });
            };

            $.autocompleteMultiselect = (args) => {
                args.choices = [].concat(args.choices || []);
                const toSelected = (items) =>
                    items
                        .filter((item) => item.selected)
                        .map((item) => item.value);
                return toPrompt("AutocompleteMultiselectPrompt", args, {
                    onAbort: toSelected,
                    onSubmit: toSelected
                });
            };

            const byTitle = (input, choices) =>
                Promise.resolve(
                    choices.filter(
                        (item) =>
                            item.title.slice(0, input.length).toLowerCase() ===
                            input.toLowerCase()
                    )
                );

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

            /***/
        },

        /***/ 2412: /***/ (module) => {
            "use strict";

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
                if (key.name === "enter") return "submit"; // ctrl + J
                if (key.name === "backspace") return "delete";
                if (key.name === "delete") return "deleteForward";
                if (key.name === "abort") return "abort";
                if (key.name === "escape") return "exit";
                if (key.name === "tab") return "next";
                if (key.name === "pagedown") return "nextPage";
                if (key.name === "pageup") return "prevPage";
                // TODO create home() in prompt types (e.g. TextPrompt)
                if (key.name === "home") return "home";
                // TODO create end() in prompt types (e.g. TextPrompt)
                if (key.name === "end") return "end";

                if (key.name === "up") return "up";
                if (key.name === "down") return "down";
                if (key.name === "right") return "right";
                if (key.name === "left") return "left";

                return false;
            };

            /***/
        },

        /***/ 8597: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const strip = __nccwpck_require__(3282);
            const { erase, cursor } = __nccwpck_require__(7036);

            const width = (str) => [...strip(str)].length;

            /**
             * @param {string} prompt
             * @param {number} perLine
             */
            module.exports = function (prompt, perLine) {
                if (!perLine) return erase.line + cursor.to(0);

                let rows = 0;
                const lines = prompt.split(/\r?\n/);
                for (let line of lines) {
                    rows +=
                        1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
                }

                return erase.lines(rows);
            };

            /***/
        },

        /***/ 3483: /***/ (module) => {
            "use strict";

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

                let startIndex = Math.min(
                    total - maxVisible,
                    cursor - Math.floor(maxVisible / 2)
                );
                if (startIndex < 0) startIndex = 0;

                let endIndex = Math.min(startIndex + maxVisible, total);

                return { startIndex, endIndex };
            };

            /***/
        },

        /***/ 5289: /***/ (module) => {
            "use strict";

            const main = {
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
            const win = {
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
            const figures = process.platform === "win32" ? win : main;

            module.exports = figures;

            /***/
        },

        /***/ 9832: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            module.exports = {
                action: __nccwpck_require__(2412),
                clear: __nccwpck_require__(8597),
                style: __nccwpck_require__(5577),
                strip: __nccwpck_require__(3282),
                figures: __nccwpck_require__(5289),
                lines: __nccwpck_require__(4715),
                wrap: __nccwpck_require__(2358),
                entriesToDisplay: __nccwpck_require__(3483)
            };

            /***/
        },

        /***/ 4715: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const strip = __nccwpck_require__(3282);

            /**
             * @param {string} msg
             * @param {number} perLine
             */
            module.exports = function (msg, perLine) {
                let lines = String(strip(msg) || "").split(/\r?\n/);

                if (!perLine) return lines.length;
                return lines
                    .map((l) => Math.ceil(l.length / perLine))
                    .reduce((a, b) => a + b);
            };

            /***/
        },

        /***/ 3282: /***/ (module) => {
            "use strict";

            module.exports = (str) => {
                const pattern = [
                    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
                    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"
                ].join("|");

                const RGX = new RegExp(pattern, "g");
                return typeof str === "string" ? str.replace(RGX, "") : str;
            };

            /***/
        },

        /***/ 5577: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const c = __nccwpck_require__(1067);
            const figures = __nccwpck_require__(5289);

            // rendering user input.
            const styles = Object.freeze({
                password: {
                    scale: 1,
                    render: (input) => "*".repeat(input.length)
                },
                emoji: {
                    scale: 2,
                    render: (input) => "😃".repeat(input.length)
                },
                invisible: { scale: 0, render: (input) => "" },
                default: { scale: 1, render: (input) => `${input}` }
            });
            const render = (type) => styles[type] || styles.default;

            // icon to signalize a prompt.
            const symbols = Object.freeze({
                aborted: c.red(figures.cross),
                done: c.green(figures.tick),
                exited: c.yellow(figures.cross),
                default: c.cyan("?")
            });

            const symbol = (done, aborted, exited) =>
                aborted
                    ? symbols.aborted
                    : exited
                      ? symbols.exited
                      : done
                        ? symbols.done
                        : symbols.default;

            // between the question and the user's input.
            const delimiter = (completing) =>
                c.gray(completing ? figures.ellipsis : figures.pointerSmall);

            const item = (expandable, expanded) =>
                c.gray(
                    expandable
                        ? expanded
                            ? figures.pointerSmall
                            : "+"
                        : figures.line
                );

            module.exports = {
                styles,
                render,
                symbols,
                symbol,
                delimiter,
                item
            };

            /***/
        },

        /***/ 2358: /***/ (module) => {
            "use strict";

            /**
             * @param {string} msg The message to wrap
             * @param {object} opts
             * @param {number|string} [opts.margin] Left margin
             * @param {number} opts.width Maximum characters per line including the margin
             */
            module.exports = (msg, opts = {}) => {
                const tab = Number.isSafeInteger(parseInt(opts.margin))
                    ? new Array(parseInt(opts.margin)).fill(" ").join("")
                    : opts.margin || "";

                const width = opts.width;

                return (msg || "")
                    .split(/\r?\n/g)
                    .map((line) =>
                        line
                            .split(/\s+/g)
                            .reduce(
                                (arr, w) => {
                                    if (
                                        w.length + tab.length >= width ||
                                        arr[arr.length - 1].length +
                                            w.length +
                                            1 <
                                            width
                                    )
                                        arr[arr.length - 1] += ` ${w}`;
                                    else arr.push(`${tab}${w}`);
                                    return arr;
                                },
                                [tab]
                            )
                            .join("\n")
                    )
                    .join("\n");
            };

            /***/
        },

        /***/ 5775: /***/ (module) => {
            /*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
            let promise;

            module.exports =
                typeof queueMicrotask === "function"
                    ? queueMicrotask.bind(
                          typeof window !== "undefined" ? window : global
                      )
                    : // reuse resolved promise, and allocate it lazily
                      (cb) =>
                          (promise || (promise = Promise.resolve()))
                              .then(cb)
                              .catch((err) =>
                                  setTimeout(() => {
                                      throw err;
                                  }, 0)
                              );

            /***/
        },

        /***/ 2522: /***/ (module) => {
            "use strict";

            function reusify(Constructor) {
                var head = new Constructor();
                var tail = head;

                function get() {
                    var current = head;

                    if (current.next) {
                        head = current.next;
                    } else {
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
                    get: get,
                    release: release
                };
            }

            module.exports = reusify;

            /***/
        },

        /***/ 9496: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            /*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
            module.exports = runParallel;

            const queueMicrotask = __nccwpck_require__(5775);

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
                    if (--pending === 0 || err) {
                        done(err);
                    }
                }

                if (!pending) {
                    // empty
                    done(null);
                } else if (keys) {
                    // object
                    keys.forEach(function (key) {
                        tasks[key](function (err, result) {
                            each(key, err, result);
                        });
                    });
                } else {
                    // array
                    tasks.forEach(function (task, i) {
                        task(function (err, result) {
                            each(i, err, result);
                        });
                    });
                }

                isSync = false;
            }

            /***/
        },

        /***/ 7036: /***/ (module) => {
            "use strict";

            const ESC = "\x1B";
            const CSI = `${ESC}[`;
            const beep = "\u0007";

            const cursor = {
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

            const scroll = {
                up: (count = 1) => `${CSI}S`.repeat(count),
                down: (count = 1) => `${CSI}T`.repeat(count)
            };

            const erase = {
                screen: `${CSI}2J`,
                up: (count = 1) => `${CSI}1J`.repeat(count),
                down: (count = 1) => `${CSI}J`.repeat(count),
                line: `${CSI}2K`,
                lineEnd: `${CSI}K`,
                lineStart: `${CSI}1K`,
                lines(count) {
                    let clear = "";
                    for (let i = 0; i < count; i++)
                        clear += this.line + (i < count - 1 ? cursor.up() : "");
                    if (count) clear += cursor.left;
                    return clear;
                }
            };

            module.exports = { cursor, scroll, erase, beep };

            /***/
        },

        /***/ 5817: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";
            /*!
             * to-regex-range <https://github.com/micromatch/to-regex-range>
             *
             * Copyright (c) 2015-present, Jon Schlinkert.
             * Released under the MIT License.
             */

            const isNumber = __nccwpck_require__(8246);

            const toRegexRange = (min, max, options) => {
                if (isNumber(min) === false) {
                    throw new TypeError(
                        "toRegexRange: expected the first argument to be a number"
                    );
                }

                if (max === void 0 || min === max) {
                    return String(min);
                }

                if (isNumber(max) === false) {
                    throw new TypeError(
                        "toRegexRange: expected the second argument to be a number."
                    );
                }

                let opts = { relaxZeros: true, ...options };
                if (typeof opts.strictZeros === "boolean") {
                    opts.relaxZeros = opts.strictZeros === false;
                }

                let relax = String(opts.relaxZeros);
                let shorthand = String(opts.shorthand);
                let capture = String(opts.capture);
                let wrap = String(opts.wrap);
                let cacheKey =
                    min + ":" + max + "=" + relax + shorthand + capture + wrap;

                if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
                    return toRegexRange.cache[cacheKey].result;
                }

                let a = Math.min(min, max);
                let b = Math.max(min, max);

                if (Math.abs(a - b) === 1) {
                    let result = min + "|" + max;
                    if (opts.capture) {
                        return `(${result})`;
                    }
                    if (opts.wrap === false) {
                        return result;
                    }
                    return `(?:${result})`;
                }

                let isPadded = hasPadding(min) || hasPadding(max);
                let state = { min, max, a, b };
                let positives = [];
                let negatives = [];

                if (isPadded) {
                    state.isPadded = isPadded;
                    state.maxLen = String(state.max).length;
                }

                if (a < 0) {
                    let newMin = b < 0 ? Math.abs(b) : 1;
                    negatives = splitToPatterns(
                        newMin,
                        Math.abs(a),
                        state,
                        opts
                    );
                    a = state.a = 0;
                }

                if (b >= 0) {
                    positives = splitToPatterns(a, b, state, opts);
                }

                state.negatives = negatives;
                state.positives = positives;
                state.result = collatePatterns(negatives, positives, opts);

                if (opts.capture === true) {
                    state.result = `(${state.result})`;
                } else if (
                    opts.wrap !== false &&
                    positives.length + negatives.length > 1
                ) {
                    state.result = `(?:${state.result})`;
                }

                toRegexRange.cache[cacheKey] = state;
                return state.result;
            };

            function collatePatterns(neg, pos, options) {
                let onlyNegative =
                    filterPatterns(neg, pos, "-", false, options) || [];
                let onlyPositive =
                    filterPatterns(pos, neg, "", false, options) || [];
                let intersected =
                    filterPatterns(neg, pos, "-?", true, options) || [];
                let subpatterns = onlyNegative
                    .concat(intersected)
                    .concat(onlyPositive);
                return subpatterns.join("|");
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
                if (start === stop) {
                    return { pattern: start, count: [], digits: 0 };
                }

                let zipped = zip(start, stop);
                let digits = zipped.length;
                let pattern = "";
                let count = 0;

                for (let i = 0; i < digits; i++) {
                    let [startDigit, stopDigit] = zipped[i];

                    if (startDigit === stopDigit) {
                        pattern += startDigit;
                    } else if (startDigit !== "0" || stopDigit !== "9") {
                        pattern += toCharacterClass(
                            startDigit,
                            stopDigit,
                            options
                        );
                    } else {
                        count++;
                    }
                }

                if (count) {
                    pattern += options.shorthand === true ? "\\d" : "[0-9]";
                }

                return { pattern, count: [count], digits };
            }

            function splitToPatterns(min, max, tok, options) {
                let ranges = splitToRanges(min, max);
                let tokens = [];
                let start = min;
                let prev;

                for (let i = 0; i < ranges.length; i++) {
                    let max = ranges[i];
                    let obj = rangeToPattern(
                        String(start),
                        String(max),
                        options
                    );
                    let zeros = "";

                    if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
                        if (prev.count.length > 1) {
                            prev.count.pop();
                        }

                        prev.count.push(obj.count[0]);
                        prev.string = prev.pattern + toQuantifier(prev.count);
                        start = max + 1;
                        continue;
                    }

                    if (tok.isPadded) {
                        zeros = padZeros(max, tok, options);
                    }

                    obj.string = zeros + obj.pattern + toQuantifier(obj.count);
                    tokens.push(obj);
                    start = max + 1;
                    prev = obj;
                }

                return tokens;
            }

            function filterPatterns(
                arr,
                comparison,
                prefix,
                intersection,
                options
            ) {
                let result = [];

                for (let ele of arr) {
                    let { string } = ele;

                    // only push if _both_ are negative...
                    if (
                        !intersection &&
                        !contains(comparison, "string", string)
                    ) {
                        result.push(prefix + string);
                    }

                    // or _both_ are positive
                    if (
                        intersection &&
                        contains(comparison, "string", string)
                    ) {
                        result.push(prefix + string);
                    }
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
                return integer - (integer % Math.pow(10, zeros));
            }

            function toQuantifier(digits) {
                let [start = 0, stop = ""] = digits;
                if (stop || start > 1) {
                    return `{${start + (stop ? "," + stop : "")}}`;
                }
                return "";
            }

            function toCharacterClass(a, b, options) {
                return `[${a}${b - a === 1 ? "" : "-"}${b}]`;
            }

            function hasPadding(str) {
                return /^-?(0+)\d/.test(str);
            }

            function padZeros(value, tok, options) {
                if (!tok.isPadded) {
                    return value;
                }

                let diff = Math.abs(tok.maxLen - String(value).length);
                let relax = options.relaxZeros !== false;

                switch (diff) {
                    case 0:
                        return "";
                    case 1:
                        return relax ? "0?" : "0";
                    case 2:
                        return relax ? "0{0,2}" : "00";
                    default: {
                        return relax ? `0{0,${diff}}` : `0{${diff}}`;
                    }
                }
            }

            /**
             * Cache
             */

            toRegexRange.cache = {};
            toRegexRange.clearCache = () => (toRegexRange.cache = {});

            /**
             * Expose `toRegexRange`
             */

            module.exports = toRegexRange;

            /***/
        },

        /***/ 9482: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            const builtins = __nccwpck_require__(3274);

            var scopedPackagePattern = new RegExp(
                "^(?:@([^/]+?)[/])?([^/]+?)$"
            );
            var exclusionList = ["node_modules", "favicon.ico"];

            function validate(name) {
                var warnings = [];
                var errors = [];

                if (name === null) {
                    errors.push("name cannot be null");
                    return done(warnings, errors);
                }

                if (name === undefined) {
                    errors.push("name cannot be undefined");
                    return done(warnings, errors);
                }

                if (typeof name !== "string") {
                    errors.push("name must be a string");
                    return done(warnings, errors);
                }

                if (!name.length) {
                    errors.push("name length must be greater than zero");
                }

                if (name.startsWith(".")) {
                    errors.push("name cannot start with a period");
                }

                if (name.startsWith("-")) {
                    errors.push("name cannot start with a hyphen");
                }

                if (name.match(/^_/)) {
                    errors.push("name cannot start with an underscore");
                }

                if (name.trim() !== name) {
                    errors.push(
                        "name cannot contain leading or trailing spaces"
                    );
                }

                // No funny business
                exclusionList.forEach(function (excludedName) {
                    if (name.toLowerCase() === excludedName) {
                        errors.push(
                            excludedName + " is not a valid package name"
                        );
                    }
                });

                // Generate warnings for stuff that used to be allowed

                // core module names like http, events, util, etc
                if (builtins.includes(name.toLowerCase())) {
                    warnings.push(name + " is a core module name");
                }

                if (name.length > 214) {
                    warnings.push(
                        "name can no longer contain more than 214 characters"
                    );
                }

                // mIxeD CaSe nAMEs
                if (name.toLowerCase() !== name) {
                    warnings.push("name can no longer contain capital letters");
                }

                if (/[~'!()*]/.test(name.split("/").slice(-1)[0])) {
                    warnings.push(
                        'name can no longer contain special characters ("~\'!()*")'
                    );
                }

                if (encodeURIComponent(name) !== name) {
                    // Maybe it's a scoped package name, like @user/package
                    var nameMatch = name.match(scopedPackagePattern);
                    if (nameMatch) {
                        var user = nameMatch[1];
                        var pkg = nameMatch[2];

                        if (pkg.startsWith(".")) {
                            errors.push("name cannot start with a period");
                        }

                        if (
                            encodeURIComponent(user) === user &&
                            encodeURIComponent(pkg) === pkg
                        ) {
                            return done(warnings, errors);
                        }
                    }

                    errors.push(
                        "name can only contain URL-friendly characters"
                    );
                }

                return done(warnings, errors);
            }

            var done = function (warnings, errors) {
                var result = {
                    validForNewPackages:
                        errors.length === 0 && warnings.length === 0,
                    validForOldPackages: errors.length === 0,
                    warnings: warnings,
                    errors: errors
                };
                if (!result.warnings.length) {
                    delete result.warnings;
                }
                if (!result.errors.length) {
                    delete result.errors;
                }
                return result;
            };

            module.exports = validate;

            /***/
        },

        /***/ 5455: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.commanderCore = void 0;
            const option_1 = __nccwpck_require__(8749);
            const commander_1 = __nccwpck_require__(6898);
            exports.commanderCore = (function () {
                const { optionConversion } = option_1.optionUtility;
                const program = new commander_1.Command("create-react-template")
                    .version(
                        "0.1.0",
                        "-v, --version",
                        "output the current version"
                    )
                    .argument("[directory]")
                    .usage("[directory] [options]")
                    .helpOption("-h, --help", "display help for command")
                    .allowUnknownOption()
                    .option("-n, --name <name>", "specify the project name")
                    .option(
                        "-t, --tech-stack <techStack>",
                        "specify the tech stack(react)"
                    )
                    .option(
                        "--rf, --react-framework <reactFramework>",
                        "framework to use (tanstack-router | next/app | next/pages)"
                    )
                    .option(
                        "--vf, --vue-framework <vueFramework>",
                        "vue framework to use (vue-router | nuxt)"
                    )
                    .option(
                        "-c,--css <css>",
                        "select css framework (tailwind | vanilla-extract | scoped-css)"
                    )
                    .option(
                        "--use-all-components",
                        "install all available components"
                    )
                    .parse(process.argv);
                const opts = program.opts();
                const optionName = optionConversion(opts.name);
                const optionReactFramework = optionConversion(
                    opts.reactFramework
                );
                const optionVueFramework = optionConversion(opts.vueFramework);
                const optionTechStack = optionConversion(opts.techStack);
                const optionCss = optionConversion(opts.css);
                const optionUseAllComponents = optionConversion(
                    opts.useAllComponents
                );
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

            /***/
        },

        /***/ 5483: /***/ function (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) {
            "use strict";

            var __importDefault =
                (this && this.__importDefault) ||
                function (mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.nameCommand = nameCommand;
            const result_1 = __nccwpck_require__(8317);
            const option_1 = __nccwpck_require__(8749);
            const is_1 = __nccwpck_require__(3524);
            const prompts_1 = __importDefault(__nccwpck_require__(4031));
            const validate_npm_name_1 = __nccwpck_require__(3687);
            const command_core_1 = __nccwpck_require__(5455);
            async function nameCommand(optionName) {
                const { optionConversion } = option_1.optionUtility;
                const { onPromptState } = command_core_1.commanderCore;
                const { createOk, checkPromiseReturn } = result_1.resultUtility;
                if (optionName.isSome && (0, is_1.isString)(optionName.value)) {
                    return createOk(optionName.value.trim());
                }
                const response = await checkPromiseReturn({
                    fn: async () =>
                        await (0, prompts_1.default)({
                            onState: onPromptState,
                            type: "text",
                            name: "path",
                            message: "What is your project named?",
                            initial: "my-project",
                            validate: (name) => {
                                const validation = (0,
                                validate_npm_name_1.validateNpmName)(name);
                                if (validation.valid) {
                                    return true;
                                }
                                return `Invalid project name: ${validation.problems?.join(", ")}`;
                            }
                        }),
                    err: (e) => {
                        if (e instanceof Error) {
                            return new Error(`Prompt failed: ${e.message}`);
                        }
                        return new Error("Prompt failed: Unknown error");
                    }
                });
                if (response.isErr) {
                    return response;
                }
                const name = optionConversion(response.value.path);
                if (name.isSome && (0, is_1.isString)(name.value)) {
                    return createOk(name.value.trim());
                }
                return createOk("my-project");
            }

            /***/
        },

        /***/ 1293: /***/ function (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) {
            "use strict";

            var __importDefault =
                (this && this.__importDefault) ||
                function (mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.techStackCommand = techStackCommand;
            const prompts_1 = __importDefault(__nccwpck_require__(4031));
            const core_static_1 = __nccwpck_require__(5727);
            const result_1 = __nccwpck_require__(8317);
            const command_core_1 = __nccwpck_require__(5455);
            const react_is_1 = __nccwpck_require__(4598);
            async function techStackCommand(optionTech) {
                const { createOk, createNg, checkPromiseReturn } =
                    result_1.resultUtility;
                const { onPromptState } = command_core_1.commanderCore;
                if (
                    optionTech.isSome &&
                    (0, react_is_1.isTechStack)(optionTech.value)
                ) {
                    return createOk(optionTech.value);
                }
                const response = await checkPromiseReturn({
                    fn: async () =>
                        await (0, prompts_1.default)({
                            onState: onPromptState,
                            type: "select",
                            name: "techStack",
                            message: "Select a tech stack for your project:",
                            choices: core_static_1.techStackSelectList,
                            initial: 0
                        }),
                    err: (e) => {
                        if (e instanceof Error) {
                            return new Error(`Prompt failed: ${e.message}`);
                        }
                        return new Error("Prompt failed: Unknown error");
                    }
                });
                if (response.isErr) {
                    return response;
                }
                const techStack = response.value.techStack;
                if ((0, react_is_1.isTechStack)(techStack)) {
                    return createOk(techStack);
                }
                return createNg(new Error("Tech stack selection is invalid"));
            }

            /***/
        },

        /***/ 1185: /***/ function (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) {
            "use strict";

            var __importDefault =
                (this && this.__importDefault) ||
                function (mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.cssCommand = cssCommand;
            const option_1 = __nccwpck_require__(8749);
            const result_1 = __nccwpck_require__(8317);
            const prompts_1 = __importDefault(__nccwpck_require__(4031));
            const command_core_1 = __nccwpck_require__(5455);
            async function cssCommand({ optionCss, isCss, csses }) {
                const { optionConversion } = option_1.optionUtility;
                const { createOk, createNg, checkPromiseReturn } =
                    result_1.resultUtility;
                const { onPromptState } = command_core_1.commanderCore;
                if (optionCss.isSome && isCss(optionCss.value)) {
                    return createOk(optionCss.value);
                }
                const response = await checkPromiseReturn({
                    fn: async () =>
                        await (0, prompts_1.default)({
                            onState: onPromptState,
                            type: "select",
                            name: "css",
                            message: "Select a CSS framework for your project:",
                            choices: csses,
                            initial: 0
                        }),
                    err: (e) => {
                        if (e instanceof Error) {
                            return new Error(`Prompt failed: ${e.message}`);
                        }
                        return new Error("Prompt failed: Unknown error");
                    }
                });
                if (response.isErr) {
                    return response;
                }
                const css = optionConversion(response.value.css);
                if (css.isSome && isCss(css.value)) {
                    return createOk(css.value);
                }
                return createNg(new Error("CSS selection is invalid"));
            }

            /***/
        },

        /***/ 5199: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.cssReactCommand = cssReactCommand;
            const react_is_1 = __nccwpck_require__(4598);
            const css_core_1 = __nccwpck_require__(1185);
            async function cssReactCommand(optionReactCss) {
                const choises = [
                    { title: "tailwindCSS", value: "tailwind" },
                    { title: "vanilla-extract ", value: "vanilla-extract" }
                ];
                return await (0, css_core_1.cssCommand)({
                    optionCss: optionReactCss,
                    isCss: react_is_1.isReactCss,
                    csses: choises
                });
            }

            /***/
        },

        /***/ 1876: /***/ function (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) {
            "use strict";

            var __importDefault =
                (this && this.__importDefault) ||
                function (mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.frameworkCommand = frameworkCommand;
            const result_1 = __nccwpck_require__(8317);
            const prompts_1 = __importDefault(__nccwpck_require__(4031));
            const command_core_1 = __nccwpck_require__(5455);
            const react_is_1 = __nccwpck_require__(4598);
            async function frameworkCommand(optionFramework) {
                const { createNg, createOk, checkPromiseReturn } =
                    result_1.resultUtility;
                const { onPromptState } = command_core_1.commanderCore;
                if (
                    optionFramework.isSome &&
                    (0, react_is_1.isReactFramework)(optionFramework.value)
                ) {
                    return createOk(optionFramework.value);
                }
                const response = await checkPromiseReturn({
                    fn: async () =>
                        await (0, prompts_1.default)({
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
                        if (e instanceof Error) {
                            return new Error(`Prompt failed: ${e.message}`);
                        }
                        return new Error("Prompt failed: Unknown error");
                    }
                });
                if (response.isErr) {
                    return response;
                }
                const framework = response.value.framework;
                if ((0, react_is_1.isReactFramework)(framework)) {
                    return createOk(framework);
                }
                return createNg(new Error("Framework selection is invalid"));
            }

            /***/
        },

        /***/ 4598: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.isReactFramework = isReactFramework;
            exports.isLibsArray = isLibsArray;
            exports.isLib = isLib;
            exports.isTechStack = isTechStack;
            exports.isReactCss = isReactCss;
            const core_static_1 = __nccwpck_require__(5727);
            const react_static_1 = __nccwpck_require__(7959);
            const is_1 = __nccwpck_require__(3524);
            function isReactFramework(value) {
                if (typeof value !== "string") {
                    return false;
                }
                return react_static_1.frameworks.includes(value);
            }
            function isLibsArray(value) {
                return (
                    (0, is_1.isArray)(value) &&
                    value.every((item) =>
                        react_static_1.libsArray.includes(item)
                    )
                );
            }
            function isLib(value) {
                return react_static_1.libsArray.includes(value);
            }
            function isTechStack(value) {
                if (typeof value !== "string") {
                    return false;
                }
                return core_static_1.techStacks.includes(value);
            }
            function isReactCss(value) {
                return react_static_1.reactCSSes.includes(value);
            }

            /***/
        },

        /***/ 9635: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.vueCssCommander = vueCssCommander;
            const vue_is_1 = __nccwpck_require__(1205);
            const css_core_1 = __nccwpck_require__(1185);
            async function vueCssCommander(optionVueCss) {
                const choises = [
                    { title: "scoped-css", value: "scoped-css" },
                    { title: "vanilla-extract", value: "vanilla-extract" }
                ];
                return await (0, css_core_1.cssCommand)({
                    optionCss: optionVueCss,
                    isCss: vue_is_1.isVueCss,
                    csses: choises
                });
            }

            /***/
        },

        /***/ 1408: /***/ function (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) {
            "use strict";

            var __importDefault =
                (this && this.__importDefault) ||
                function (mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.vueFrameworkCommand = vueFrameworkCommand;
            const picocolors_1 = __nccwpck_require__(5277);
            const result_1 = __nccwpck_require__(8317);
            const command_core_1 = __nccwpck_require__(5455);
            const vue_is_1 = __nccwpck_require__(1205);
            const prompts_1 = __importDefault(__nccwpck_require__(4031));
            async function vueFrameworkCommand(optionVueFramework) {
                const { onPromptState } = command_core_1.commanderCore;
                const { createOk, checkPromiseReturn, createNg } =
                    result_1.resultUtility;
                if (
                    optionVueFramework.isSome &&
                    (0, vue_is_1.isVueFramework)(optionVueFramework.value)
                ) {
                    return createOk(optionVueFramework.value);
                }
                const styleFramework = (0, picocolors_1.blue)("framework");
                const response = await checkPromiseReturn({
                    fn: async () =>
                        await (0, prompts_1.default)({
                            onState: onPromptState,
                            type: "select",
                            name: "framework",
                            message: `Select a framework for your project:`,
                            choices: [
                                { title: "Vue router", value: "vue-router" },
                                { title: "Nuxt.js", value: "nuxt" }
                            ],
                            initial: 0
                        }),
                    err: (e) => {
                        if (e instanceof Error) {
                            return new Error(`Prompt failed: ${e.message}`);
                        }
                        return new Error("Prompt failed: Unknown error");
                    }
                });
                if (response.isErr) {
                    return response;
                }
                const framework = response.value.framework;
                if ((0, vue_is_1.isVueFramework)(framework)) {
                    return createOk(framework);
                }
                return createNg(new Error("Framework selection is invalid"));
            }

            /***/
        },

        /***/ 5584: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.copy = copy;
            const result_1 = __nccwpck_require__(8317);
            const fast_glob_1 = __nccwpck_require__(7823);
            const promises_1 = __nccwpck_require__(1455);
            const node_path_1 = __nccwpck_require__(6760);
            const identity = (x) => x;
            async function copy(
                src,
                dest,
                { cwd, rename = identity, parents = true }
            ) {
                const { createNg, createOk, checkPromiseReturn } =
                    result_1.resultUtility;
                const sources = typeof src === "string" ? [src] : src;
                if (sources.length === 0 || dest === "") {
                    return createNg(new Error("src or dest is empty"));
                }
                const sourceFiles = await checkPromiseReturn({
                    fn: () =>
                        (0, fast_glob_1.async)(sources, {
                            cwd,
                            dot: true,
                            absolute: false,
                            stats: false,
                            onlyFiles: true
                        }),
                    err: () => new Error("Failed to glob source files")
                });
                if (sourceFiles.isErr) {
                    return sourceFiles;
                }
                const destRelativeToCwd = cwd
                    ? (0, node_path_1.resolve)(cwd, dest)
                    : dest;
                for (const p of sourceFiles.value) {
                    const dirName = (0, node_path_1.dirname)(p);
                    const baseName = rename((0, node_path_1.basename)(p));
                    const from = cwd ? (0, node_path_1.resolve)(cwd, p) : p;
                    const to = parents
                        ? (0, node_path_1.join)(
                              destRelativeToCwd,
                              dirName,
                              baseName
                          )
                        : (0, node_path_1.join)(destRelativeToCwd, baseName);
                    await (0, promises_1.mkdir)((0, node_path_1.dirname)(to), {
                        recursive: true
                    });
                    await (0, promises_1.copyFile)(from, to);
                }
                return createOk(() => {});
            }

            /***/
        },

        /***/ 3866: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.isFolderEmpty = isFolderEmpty;
            const node_fs_1 = __nccwpck_require__(3024);
            const node_path_1 = __nccwpck_require__(6760);
            const picocolors_1 = __nccwpck_require__(5277);
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
                const conflicts = (0, node_fs_1.readdirSync)(root).filter(
                    (file) => {
                        !validFiles.includes(file) && !/\.iml&/.test(file);
                    }
                );
                if (conflicts.length > 0) {
                    console.log(
                        `The directory ${(0, picocolors_1.green)(name)} contains files that could conflict:`
                    );
                    console.log();
                    for (const file of conflicts) {
                        try {
                            const stats = (0, node_fs_1.lstatSync)(
                                (0, node_path_1.join)(root, file)
                            );
                            if (stats.isDirectory()) {
                                console.log(
                                    (0, picocolors_1.blue)(`  ${file}/`)
                                );
                            } else {
                                console.log(`  ${file}`);
                            }
                        } catch (e) {
                            console.log(`  ${file}`);
                        }
                    }
                    console.log();
                    console.log(
                        "Either try using a new directory name, or remove the files listed above."
                    );
                    console.log();
                    return false;
                }
                return true;
            }

            /***/
        },

        /***/ 3687: /***/ function (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) {
            "use strict";

            var __importDefault =
                (this && this.__importDefault) ||
                function (mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.validateNpmName = validateNpmName;
            const validate_npm_package_name_1 = __importDefault(
                __nccwpck_require__(9482)
            );
            function validateNpmName(name) {
                const nameValidation = (0, validate_npm_package_name_1.default)(
                    name
                );
                if (nameValidation.validForNewPackages) {
                    return { valid: true };
                }
                return {
                    valid: false,
                    problems: [
                        ...(nameValidation.errors ?? []),
                        ...(nameValidation.warnings ?? [])
                    ]
                };
            }

            /***/
        },

        /***/ 3279: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.run = run;
            exports.notify = notify;
            exports.errorExit = errorExit;
            const node_path_1 = __nccwpck_require__(6760);
            const validate_npm_name_1 = __nccwpck_require__(3687);
            const node_fs_1 = __nccwpck_require__(3024);
            const picocolors_1 = __nccwpck_require__(5277);
            const command_core_1 = __nccwpck_require__(5455);
            const project_name_1 = __nccwpck_require__(5483);
            const error_1 = __nccwpck_require__(272);
            const tech_stack_1 = __nccwpck_require__(1293);
            const core_1 = __nccwpck_require__(6884);
            const then_1 = __nccwpck_require__(6373);
            const handleSigTerm = () => process.exit(0);
            process.on("SIGTERM", handleSigTerm);
            process.on("SIGINT", handleSigTerm);
            async function run() {
                const { optionName, optionTechStack } =
                    command_core_1.commanderCore;
                const projectName = await (0, project_name_1.nameCommand)(
                    optionName
                );
                if (projectName.isErr) {
                    (0, error_1.cliErrorLog)(projectName.err);
                    process.exit(1);
                }
                const appPath = (0, node_path_1.resolve)(projectName.value);
                const appName = (0, node_path_1.basename)(appPath);
                const techStack = await (0, tech_stack_1.techStackCommand)(
                    optionTechStack
                );
                if (techStack.isErr) {
                    (0, error_1.cliErrorLog)(techStack.err);
                    process.exit(1);
                }
                const validation = (0, validate_npm_name_1.validateNpmName)(
                    appName
                );
                if (!validation.valid) {
                    console.error(
                        `Could not create a project called ${appName} because of npm naming restrictions:\n\n- ${validation.problems?.join("\n- ")}\n`
                    );
                    process.exit(1);
                }
                if ((0, node_fs_1.existsSync)(appName)) {
                    console.error(
                        (0, picocolors_1.red)(
                            `The directory ${appName} already exists. Please choose a different project name or remove the existing directory.\n`
                        )
                    );
                    process.exit(1);
                }
                const installResult = await (0, core_1.createApp)({
                    appPath,
                    tech: techStack.value
                });
                if (installResult.isErr) {
                    (0, error_1.cliErrorLog)(installResult.err);
                    process.exit(1);
                }
                return {
                    name: projectName.value,
                    tech: techStack.value
                };
            }
            function techInstallInfo(techStack) {
                switch (techStack) {
                    case "react": {
                        (0, then_1.reactCallback)();
                    }
                }
            }
            function notify(projectMaterial) {
                console.log("cd " + projectMaterial.name);
                techInstallInfo(projectMaterial.tech);
                console.log();
                console.log(
                    (0, picocolors_1.bold)(
                        `${(0, picocolors_1.green)("Happy hacking!")}`
                    )
                );
                process.exit(0);
            }
            function errorExit() {
                console.error(
                    (0, picocolors_1.red)("The operation was cancelled.")
                );
                process.exit(1);
            }

            /***/
        },

        /***/ 2595: /***/ function (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) {
            "use strict";

            var __importDefault =
                (this && this.__importDefault) ||
                function (mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.typescriptTemplateInstall = typescriptTemplateInstall;
            const result_1 = __nccwpck_require__(8317);
            const promises_1 = __importDefault(__nccwpck_require__(1943));
            const node_path_1 = __importDefault(__nccwpck_require__(6760));
            const node_fs_1 = __nccwpck_require__(3024);
            const is_folder_empty_1 = __nccwpck_require__(3866);
            const copy_1 = __nccwpck_require__(5584);
            const picocolors_1 = __nccwpck_require__(5277);
            async function typescriptTemplateInstall({
                root,
                appName,
                material
            }) {
                const { createNg, createOk, checkPromiseVoid } =
                    result_1.resultUtility;
                const { path: templatePath } = material;
                const copySource = ["**/*"];
                (0, node_fs_1.mkdirSync)(root, { recursive: true });
                if (!(0, is_folder_empty_1.isFolderEmpty)(root, appName)) {
                    return createNg(
                        new Error(
                            `The directory ${appName} is not empty. Please choose a different project name or remove the existing directory.\n`
                        )
                    );
                }
                console.log(
                    `Creating a new React app in ${(0, picocolors_1.green)(root)}.`
                );
                console.log();
                process.chdir(root);
                const res = await (0, copy_1.copy)(copySource, root, {
                    parents: true,
                    cwd: templatePath,
                    rename: (name) => {
                        switch (name) {
                            case "gitignore":
                                return `.${name}`;
                            case "env":
                                return `.${name}`;
                            case "package-template.json":
                                return "package.json";
                            case "README.sample.md":
                                return "README.md";
                            default:
                                return name;
                        }
                    }
                });
                if (res.isErr) {
                    return res;
                }
                const pkgPath = node_path_1.default.join(root, "package.json");
                const exists = await checkPromiseVoid({
                    fn: async () => {
                        await promises_1.default.stat(pkgPath);
                    },
                    err: (e) => {
                        if (e instanceof Error) {
                            return new Error(
                                `Failed to access package.json: ${e.message}`
                            );
                        }
                        return new Error(
                            "Failed to access package.json: Unknown error"
                        );
                    }
                });
                if (exists.isErr) {
                    return exists;
                }
                const raw = await promises_1.default.readFile(pkgPath, "utf8");
                const pkg = JSON.parse(raw || "{}");
                if (!appName || typeof appName !== "string") {
                    return createNg(new Error("Invalid app name"));
                }
                pkg.name = appName;
                const writeResult = await checkPromiseVoid({
                    fn: async () => {
                        await promises_1.default.writeFile(
                            pkgPath,
                            JSON.stringify(pkg, null, 2) + "\n",
                            "utf8"
                        );
                    },
                    err: () => new Error(`Failed to update package.json name`)
                });
                if (writeResult.isErr) {
                    return writeResult;
                }
                return createOk(result_1.noop);
            }

            /***/
        },

        /***/ 5727: /***/ (__unused_webpack_module, exports) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.techStackSelectList = exports.techStacks = void 0;
            exports.techStacks = ["react", "vue"];
            exports.techStackSelectList = [
                { title: "React", value: "react" },
                { title: "Vue", value: "vue" }
            ];

            /***/
        },

        /***/ 6884: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.createApp = createApp;
            const react_installer_1 = __nccwpck_require__(2329);
            const vue_setting_1 = __nccwpck_require__(1737);
            const vue_install_1 = __nccwpck_require__(5102);
            const react_setting_1 = __nccwpck_require__(3445);
            async function createApp({ appPath, tech }) {
                switch (tech) {
                    case "react": {
                        const materialResult = await (0,
                        react_setting_1.reactCli)();
                        if (materialResult.isErr) {
                            return materialResult;
                        }
                        return await (0, react_installer_1.reactInstaller)({
                            appPath,
                            material: materialResult.value
                        });
                    }
                    case "vue": {
                        const materialResult = await (0,
                        vue_setting_1.vueCli)();
                        if (materialResult.isErr) {
                            return materialResult;
                        }
                        return await (0, vue_install_1.vueInstaller)({
                            appPath,
                            material: materialResult.value
                        });
                    }
                }
            }

            /***/
        },

        /***/ 2329: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.reactInstaller = reactInstaller;
            const node_path_1 = __nccwpck_require__(6760);
            const result_1 = __nccwpck_require__(8317);
            const typescript_template_install_1 = __nccwpck_require__(2595);
            async function reactInstaller({ appPath, material }) {
                const { createNg } = result_1.resultUtility;
                const { styleSheet } = material;
                const root = (0, node_path_1.resolve)(appPath);
                const appName = (0, node_path_1.basename)(appPath);
                if (styleSheet.isNone) {
                    return createNg(new Error("CSS option is required"));
                }
                return await (0,
                typescript_template_install_1.typescriptTemplateInstall)({
                    root,
                    appName,
                    material
                });
            }

            /***/
        },

        /***/ 3445: /***/ function (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) {
            "use strict";

            var __importDefault =
                (this && this.__importDefault) ||
                function (mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.reactCli = reactCli;
            const path_1 = __importDefault(__nccwpck_require__(6928));
            const command_core_1 = __nccwpck_require__(5455);
            const react_css_1 = __nccwpck_require__(5199);
            const react_framework_1 = __nccwpck_require__(1876);
            const result_1 = __nccwpck_require__(8317);
            const found_file_1 = __nccwpck_require__(7833);
            const option_1 = __nccwpck_require__(8749);
            async function reactCli() {
                const { optionReactFramework, optionCss } =
                    command_core_1.commanderCore;
                const { createOk } = result_1.resultUtility;
                const { createSome } = option_1.optionUtility;
                const frameworResult = await (0,
                react_framework_1.frameworkCommand)(optionReactFramework);
                if (frameworResult.isErr) {
                    return frameworResult;
                }
                const cssResult = await (0, react_css_1.cssReactCommand)(
                    optionCss
                );
                if (cssResult.isErr) {
                    return cssResult;
                }
                const resultPath = (0, found_file_1.foundFolder)([
                    path_1.default.join(
                        __dirname,
                        "template",
                        "react",
                        frameworResult.value,
                        cssResult.value
                    )
                ]);
                if (resultPath.isErr) {
                    return resultPath;
                }
                const techMaterial = {
                    path: resultPath.value,
                    styleSheet: createSome(cssResult.value)
                };
                return createOk(techMaterial);
            }

            /***/
        },

        /***/ 7959: /***/ (__unused_webpack_module, exports) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.librarySetting =
                exports.selectLibList =
                exports.libsArray =
                exports.reactCSSes =
                exports.frameworks =
                    void 0;
            /**
             * Static definitions for template creation
             */
            exports.frameworks = ["tanstack-router", "next/app", "next/pages"];
            /**
             * CSS
             */
            exports.reactCSSes = ["tailwind", "vanilla-extract"];
            /**
             * Library definitions
             */
            exports.libsArray = ["popup", "loading"];
            exports.selectLibList = [
                { title: "Popup", value: "popup" },
                { title: "Loading", value: "loading" }
            ];
            exports.librarySetting = [
                {
                    stack: "react",
                    lib: "popup",
                    unitTest: true,
                    storybook: true
                },
                {
                    stack: "react",
                    lib: "loading",
                    unitTest: true,
                    storybook: true
                }
            ];

            /***/
        },

        /***/ 5102: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.vueInstaller = vueInstaller;
            const node_path_1 = __nccwpck_require__(6760);
            const result_1 = __nccwpck_require__(8317);
            const typescript_template_install_1 = __nccwpck_require__(2595);
            async function vueInstaller({ appPath, material }) {
                const { createNg } = result_1.resultUtility;
                const { styleSheet } = material;
                if (styleSheet.isNone) {
                    return createNg(new Error("CSS option is required"));
                }
                const root = (0, node_path_1.resolve)(appPath);
                const appName = (0, node_path_1.basename)(appPath);
                const installResult = await (0,
                typescript_template_install_1.typescriptTemplateInstall)({
                    root,
                    appName,
                    material
                });
                return installResult;
            }

            /***/
        },

        /***/ 1205: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.isVueFramework = isVueFramework;
            exports.isVueCss = isVueCss;
            const vue_static_1 = __nccwpck_require__(4427);
            function isVueFramework(value) {
                return (
                    typeof value === "string" &&
                    vue_static_1.vueFramework.includes(value)
                );
            }
            function isVueCss(value) {
                return (
                    typeof value === "string" &&
                    vue_static_1.vueCSSes.includes(value)
                );
            }

            /***/
        },

        /***/ 1737: /***/ function (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) {
            "use strict";

            var __importDefault =
                (this && this.__importDefault) ||
                function (mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.vueCli = vueCli;
            const path_1 = __importDefault(__nccwpck_require__(6928));
            const command_core_1 = __nccwpck_require__(5455);
            const vue_css_1 = __nccwpck_require__(9635);
            const vue_framework_1 = __nccwpck_require__(1408);
            const option_1 = __nccwpck_require__(8749);
            const result_1 = __nccwpck_require__(8317);
            const found_file_1 = __nccwpck_require__(7833);
            async function vueCli() {
                const { optionCss, optionVueFramework } =
                    command_core_1.commanderCore;
                const { createSome } = option_1.optionUtility;
                const { createOk } = result_1.resultUtility;
                const frameworkResult = await (0,
                vue_framework_1.vueFrameworkCommand)(optionVueFramework);
                if (frameworkResult.isErr) {
                    return frameworkResult;
                }
                const cssResult = await (0, vue_css_1.vueCssCommander)(
                    optionCss
                );
                if (cssResult.isErr) {
                    return cssResult;
                }
                const templatePath = [
                    path_1.default.join(
                        __dirname,
                        "template",
                        "vue",
                        frameworkResult.value,
                        cssResult.value
                    ),
                    path_1.default.join(
                        __dirname,
                        "..",
                        "..",
                        "..",
                        "template",
                        "vue",
                        frameworkResult.value,
                        cssResult.value
                    )
                ];
                const resultPath = (0, found_file_1.foundFolder)(templatePath);
                if (resultPath.isErr) {
                    return resultPath;
                }
                const techMaterial = {
                    path: resultPath.value,
                    styleSheet: createSome(cssResult.value)
                };
                return createOk(techMaterial);
            }

            /***/
        },

        /***/ 4427: /***/ (__unused_webpack_module, exports) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.vueCSSes = exports.vueFramework = void 0;
            exports.vueFramework = ["vue-router", "nuxt"];
            exports.vueCSSes = ["vanilla-extract", "scoped-css"];

            /***/
        },

        /***/ 6373: /***/ (__unused_webpack_module, exports) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.reactCallback = reactCallback;
            function reactCallback() {
                console.log(`Package install: \n\n ex) npm install`);
                console.log(`Application launch: \n\n ex) npm run dev`);
            }

            /***/
        },

        /***/ 272: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.cliErrorLog = cliErrorLog;
            const picocolors_1 = __nccwpck_require__(5277);
            function cliErrorLog(err) {
                console.error((0, picocolors_1.red)(err.message));
                console.error((0, picocolors_1.red)(err.stack ?? ""));
            }

            /***/
        },

        /***/ 7833: /***/ function (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) {
            "use strict";

            var __importDefault =
                (this && this.__importDefault) ||
                function (mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.foundFolder = foundFolder;
            const node_fs_1 = __importDefault(__nccwpck_require__(3024));
            const result_1 = __nccwpck_require__(8317);
            function foundFolder(paths) {
                const { createNg, createOk } = result_1.resultUtility;
                for (const p of paths) {
                    if (node_fs_1.default.existsSync(p)) {
                        return createOk(p);
                    }
                }
                return createNg(
                    new Error(`Not found folder: ${paths.join(", ")}`)
                );
            }

            /***/
        },

        /***/ 3524: /***/ (__unused_webpack_module, exports) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.isNull = isNull;
            exports.isUndefined = isUndefined;
            exports.isString = isString;
            exports.isArray = isArray;
            exports.isBoolean = isBoolean;
            function isNull(value) {
                return value === null;
            }
            function isUndefined(value) {
                return value === undefined;
            }
            function isString(value) {
                return typeof value === "string";
            }
            function isArray(value) {
                return Array.isArray(value);
            }
            function isBoolean(value) {
                return typeof value === "boolean";
            }

            /***/
        },

        /***/ 8749: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.optionUtility = void 0;
            const is_1 = __nccwpck_require__(3524);
            const basic = {
                OPTION_SOME: "some",
                OPTION_NONE: "none"
            };
            exports.optionUtility = (function () {
                const { OPTION_SOME, OPTION_NONE } = basic;
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
                    if (
                        (0, is_1.isNull)(value) ||
                        (0, is_1.isUndefined)(value)
                    ) {
                        return createNone();
                    }
                    return createSome(value);
                };
                return Object.freeze({
                    createSome,
                    createNone,
                    optionConversion
                });
            })();

            /***/
        },

        /***/ 8317: /***/ (__unused_webpack_module, exports) => {
            "use strict";

            Object.defineProperty(exports, "__esModule", { value: true });
            exports.resultUtility = exports.noop = void 0;
            const basic = {
                RESULT_OK: "ok",
                RESULT_NG: "ng"
            };
            const noop = () => {};
            exports.noop = noop;
            const UNIT_SYMBOL = Symbol("UNIT_SYMBOL");
            exports.resultUtility = (function () {
                const { RESULT_NG, RESULT_OK } = basic;
                const UNIT = Object.freeze({
                    _unit: UNIT_SYMBOL
                });
                const checkPromiseReturn = async ({ fn, err }) => {
                    try {
                        const result = await fn();
                        return createOk(result);
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
                        const result = fn();
                        return createOk(result);
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

            /***/
        },

        /***/ 4434: /***/ (module) => {
            "use strict";
            module.exports = require("events");

            /***/
        },

        /***/ 9896: /***/ (module) => {
            "use strict";
            module.exports = require("fs");

            /***/
        },

        /***/ 1943: /***/ (module) => {
            "use strict";
            module.exports = require("fs/promises");

            /***/
        },

        /***/ 1421: /***/ (module) => {
            "use strict";
            module.exports = require("node:child_process");

            /***/
        },

        /***/ 8474: /***/ (module) => {
            "use strict";
            module.exports = require("node:events");

            /***/
        },

        /***/ 3024: /***/ (module) => {
            "use strict";
            module.exports = require("node:fs");

            /***/
        },

        /***/ 1455: /***/ (module) => {
            "use strict";
            module.exports = require("node:fs/promises");

            /***/
        },

        /***/ 6760: /***/ (module) => {
            "use strict";
            module.exports = require("node:path");

            /***/
        },

        /***/ 1708: /***/ (module) => {
            "use strict";
            module.exports = require("node:process");

            /***/
        },

        /***/ 857: /***/ (module) => {
            "use strict";
            module.exports = require("os");

            /***/
        },

        /***/ 6928: /***/ (module) => {
            "use strict";
            module.exports = require("path");

            /***/
        },

        /***/ 3785: /***/ (module) => {
            "use strict";
            module.exports = require("readline");

            /***/
        },

        /***/ 2203: /***/ (module) => {
            "use strict";
            module.exports = require("stream");

            /***/
        },

        /***/ 9023: /***/ (module) => {
            "use strict";
            module.exports = require("util");

            /***/
        },

        /***/ 6898: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            const { Argument } = __nccwpck_require__(5875);
            const { Command } = __nccwpck_require__(6915);
            const { CommanderError, InvalidArgumentError } =
                __nccwpck_require__(7252);
            const { Help } = __nccwpck_require__(9171);
            const { Option } = __nccwpck_require__(8637);

            exports.program = new Command();

            exports.createCommand = (name) => new Command(name);
            exports.createOption = (flags, description) =>
                new Option(flags, description);
            exports.createArgument = (name, description) =>
                new Argument(name, description);

            /**
             * Expose classes
             */

            exports.Command = Command;
            exports.Option = Option;
            exports.Argument = Argument;
            exports.Help = Help;

            exports.CommanderError = CommanderError;
            exports.InvalidArgumentError = InvalidArgumentError;
            exports.InvalidOptionArgumentError = InvalidArgumentError; // Deprecated

            /***/
        },

        /***/ 5875: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            const { InvalidArgumentError } = __nccwpck_require__(7252);

            class Argument {
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
                    this.parseArg = undefined;
                    this.defaultValue = undefined;
                    this.defaultValueDescription = undefined;
                    this.argChoices = undefined;

                    switch (name[0]) {
                        case "<": // e.g. <required>
                            this.required = true;
                            this._name = name.slice(1, -1);
                            break;
                        case "[": // e.g. [optional]
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
                    if (
                        previous === this.defaultValue ||
                        !Array.isArray(previous)
                    ) {
                        return [value];
                    }

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
                        if (!this.argChoices.includes(arg)) {
                            throw new InvalidArgumentError(
                                `Allowed choices are ${this.argChoices.join(", ")}.`
                            );
                        }
                        if (this.variadic) {
                            return this._collectValue(arg, previous);
                        }
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
            }

            /**
             * Takes an argument and returns its human readable equivalent for help usage.
             *
             * @param {Argument} arg
             * @return {string}
             * @private
             */

            function humanReadableArgName(arg) {
                const nameOutput =
                    arg.name() + (arg.variadic === true ? "..." : "");

                return arg.required
                    ? "<" + nameOutput + ">"
                    : "[" + nameOutput + "]";
            }

            exports.Argument = Argument;
            exports.humanReadableArgName = humanReadableArgName;

            /***/
        },

        /***/ 6915: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            const EventEmitter = __nccwpck_require__(8474).EventEmitter;
            const childProcess = __nccwpck_require__(1421);
            const path = __nccwpck_require__(6760);
            const fs = __nccwpck_require__(3024);
            const process = __nccwpck_require__(1708);

            const { Argument, humanReadableArgName } =
                __nccwpck_require__(5875);
            const { CommanderError } = __nccwpck_require__(7252);
            const { Help, stripColor } = __nccwpck_require__(9171);
            const { Option, DualOptions } = __nccwpck_require__(8637);
            const { suggestSimilar } = __nccwpck_require__(1919);

            class Command extends EventEmitter {
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
                    this._args = this.registeredArguments; // deprecated old name
                    /** @type {string[]} */
                    this.args = []; // cli args with options removed
                    this.rawArgs = [];
                    this.processedArgs = []; // like .args but after custom processing and collecting variadic
                    this._scriptPath = null;
                    this._name = name || "";
                    this._optionValues = {};
                    this._optionValueSources = {}; // default, env, cli etc
                    this._storeOptionsAsProperties = false;
                    this._actionHandler = null;
                    this._executableHandler = false;
                    this._executableFile = null; // custom name for executable
                    this._executableDir = null; // custom search directory for subcommands
                    this._defaultCommandName = null;
                    this._exitCallback = null;
                    this._aliases = [];
                    this._combineFlagAndOptionalValue = true;
                    this._description = "";
                    this._summary = "";
                    this._argsDescription = undefined; // legacy
                    this._enablePositionalOptions = false;
                    this._passThroughOptions = false;
                    this._lifeCycleHooks = {}; // a hash of arrays
                    /** @type {(boolean | string)} */
                    this._showHelpAfterError = false;
                    this._showSuggestionAfterError = true;
                    this._savedState = null; // used in save/restoreStateBeforeParse

                    // see configureOutput() for docs
                    this._outputConfiguration = {
                        writeOut: (str) => process.stdout.write(str),
                        writeErr: (str) => process.stderr.write(str),
                        outputError: (str, write) => write(str),
                        getOutHelpWidth: () =>
                            process.stdout.isTTY
                                ? process.stdout.columns
                                : undefined,
                        getErrHelpWidth: () =>
                            process.stderr.isTTY
                                ? process.stderr.columns
                                : undefined,
                        getOutHasColors: () =>
                            useColor() ??
                            (process.stdout.isTTY &&
                                process.stdout.hasColors?.()),
                        getErrHasColors: () =>
                            useColor() ??
                            (process.stderr.isTTY &&
                                process.stderr.hasColors?.()),
                        stripColor: (str) => stripColor(str)
                    };

                    this._hidden = false;
                    /** @type {(Option | null | undefined)} */
                    this._helpOption = undefined; // Lazy created on demand. May be null if help option is disabled.
                    this._addImplicitHelpCommand = undefined; // undecided whether true or false yet, not inherited
                    /** @type {Command} */
                    this._helpCommand = undefined; // lazy initialised, inherited
                    this._helpConfiguration = {};
                    /** @type {string | undefined} */
                    this._helpGroupHeading = undefined; // soft initialised when added to parent
                    /** @type {string | undefined} */
                    this._defaultCommandGroup = undefined;
                    /** @type {string | undefined} */
                    this._defaultOptionGroup = undefined;
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
                    this._outputConfiguration =
                        sourceCommand._outputConfiguration;
                    this._helpOption = sourceCommand._helpOption;
                    this._helpCommand = sourceCommand._helpCommand;
                    this._helpConfiguration = sourceCommand._helpConfiguration;
                    this._exitCallback = sourceCommand._exitCallback;
                    this._storeOptionsAsProperties =
                        sourceCommand._storeOptionsAsProperties;
                    this._combineFlagAndOptionalValue =
                        sourceCommand._combineFlagAndOptionalValue;
                    this._allowExcessArguments =
                        sourceCommand._allowExcessArguments;
                    this._enablePositionalOptions =
                        sourceCommand._enablePositionalOptions;
                    this._showHelpAfterError =
                        sourceCommand._showHelpAfterError;
                    this._showSuggestionAfterError =
                        sourceCommand._showSuggestionAfterError;

                    return this;
                }

                /**
                 * @returns {Command[]}
                 * @private
                 */

                _getCommandAndAncestors() {
                    const result = [];
                    // eslint-disable-next-line @typescript-eslint/no-this-alias
                    for (
                        let command = this;
                        command;
                        command = command.parent
                    ) {
                        result.push(command);
                    }
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
                    cmd._hidden = !!(opts.noHelp || opts.hidden); // noHelp is deprecated old name for hidden
                    cmd._executableFile = opts.executableFile || null; // Custom name for executable file, set missing to null to match constructor
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
                    if (configuration === undefined)
                        return this._helpConfiguration;

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
                    if (configuration === undefined)
                        return this._outputConfiguration;

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
                    if (typeof displayHelp !== "string")
                        displayHelp = !!displayHelp;
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
                    if (!cmd._name) {
                        throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
                    }

                    opts = opts || {};
                    if (opts.isDefault) this._defaultCommandName = cmd._name;
                    if (opts.noHelp || opts.hidden) cmd._hidden = true; // modifying passed command due to existing implementation

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
                    if (typeof parseArg === "function") {
                        argument.default(defaultValue).argParser(parseArg);
                    } else {
                        argument.default(parseArg);
                    }
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
                    names
                        .trim()
                        .split(/ +/)
                        .forEach((detail) => {
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
                    const previousArgument =
                        this.registeredArguments.slice(-1)[0];
                    if (previousArgument?.variadic) {
                        throw new Error(
                            `only the last argument can be variadic '${previousArgument.name()}'`
                        );
                    }
                    if (
                        argument.required &&
                        argument.defaultValue !== undefined &&
                        argument.parseArg === undefined
                    ) {
                        throw new Error(
                            `a default value for a required argument is never used: '${argument.name()}'`
                        );
                    }
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
                        if (enableOrNameAndArgs && this._defaultCommandGroup) {
                            // make the command to store the group
                            this._initCommandGroup(this._getHelpCommand());
                        }
                        return this;
                    }

                    const nameAndArgs = enableOrNameAndArgs ?? "help [command]";
                    const [, helpName, helpArgs] =
                        nameAndArgs.match(/([^ ]+) *(.*)/);
                    const helpDescription =
                        description ?? "display help for command";

                    const helpCommand = this.createCommand(helpName);
                    helpCommand.helpOption(false);
                    if (helpArgs) helpCommand.arguments(helpArgs);
                    if (helpDescription)
                        helpCommand.description(helpDescription);

                    this._addImplicitHelpCommand = true;
                    this._helpCommand = helpCommand;
                    // init group unless lazy create
                    if (enableOrNameAndArgs || description)
                        this._initCommandGroup(helpCommand);

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
                    // If not passed an object, call through to helpCommand for backwards compatibility,
                    // as addHelpCommand was originally used like helpCommand is now.
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
                    const hasImplicitHelpCommand =
                        this._addImplicitHelpCommand ??
                        (this.commands.length &&
                            !this._actionHandler &&
                            !this._findCommand("help"));

                    if (hasImplicitHelpCommand) {
                        if (this._helpCommand === undefined) {
                            this.helpCommand(undefined, undefined); // use default name and description
                        }
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
                    if (!allowedValues.includes(event)) {
                        throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
                    }
                    if (this._lifeCycleHooks[event]) {
                        this._lifeCycleHooks[event].push(listener);
                    } else {
                        this._lifeCycleHooks[event] = [listener];
                    }
                    return this;
                }

                /**
                 * Register callback to use as replacement for calling process.exit.
                 *
                 * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
                 * @return {Command} `this` command for chaining
                 */

                exitOverride(fn) {
                    if (fn) {
                        this._exitCallback = fn;
                    } else {
                        this._exitCallback = (err) => {
                            if (
                                err.code !== "commander.executeSubCommandAsync"
                            ) {
                                throw err;
                            } else {
                                // Async callback from spawn events, not useful to throw.
                            }
                        };
                    }
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
                    if (this._exitCallback) {
                        this._exitCallback(
                            new CommanderError(exitCode, code, message)
                        );
                        // Expecting this line is not reached.
                    }
                    process.exit(exitCode);
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
                        // The .action callback takes an extra parameter which is the command or options.
                        const expectedArgsCount =
                            this.registeredArguments.length;
                        const actionArgs = args.slice(0, expectedArgsCount);
                        if (this._storeOptionsAsProperties) {
                            actionArgs[expectedArgsCount] = this; // backwards compatible "options"
                        } else {
                            actionArgs[expectedArgsCount] = this.opts();
                        }
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
                    const matchingOption =
                        (option.short && this._findOption(option.short)) ||
                        (option.long && this._findOption(option.long));
                    if (matchingOption) {
                        const matchingFlag =
                            option.long && this._findOption(option.long)
                                ? option.long
                                : option.short;
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

                    const alreadyUsed = knownBy(command).find((name) =>
                        this._findCommand(name)
                    );
                    if (alreadyUsed) {
                        const existingCmd = knownBy(
                            this._findCommand(alreadyUsed)
                        ).join("|");
                        const newCmd = knownBy(command).join("|");
                        throw new Error(
                            `cannot add command '${newCmd}' as already have command '${existingCmd}'`
                        );
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

                    // store default value
                    if (option.negate) {
                        // --no-foo is special and defaults foo to true, unless a --foo option is already defined
                        const positiveLongFlag = option.long.replace(
                            /^--no-/,
                            "--"
                        );
                        if (!this._findOption(positiveLongFlag)) {
                            this.setOptionValueWithSource(
                                name,
                                option.defaultValue === undefined
                                    ? true
                                    : option.defaultValue,
                                "default"
                            );
                        }
                    } else if (option.defaultValue !== undefined) {
                        this.setOptionValueWithSource(
                            name,
                            option.defaultValue,
                            "default"
                        );
                    }

                    // handler for cli and env supplied values
                    const handleOptionValue = (
                        val,
                        invalidValueMessage,
                        valueSource
                    ) => {
                        // val is null for optional option used without an optional-argument.
                        // val is undefined for boolean and negated option.
                        if (val == null && option.presetArg !== undefined) {
                            val = option.presetArg;
                        }

                        // custom processing
                        const oldValue = this.getOptionValue(name);
                        if (val !== null && option.parseArg) {
                            val = this._callParseArg(
                                option,
                                val,
                                oldValue,
                                invalidValueMessage
                            );
                        } else if (val !== null && option.variadic) {
                            val = option._collectValue(val, oldValue);
                        }

                        // Fill-in appropriate missing values. Long winded but easy to follow.
                        if (val == null) {
                            if (option.negate) {
                                val = false;
                            } else if (option.isBoolean() || option.optional) {
                                val = true;
                            } else {
                                val = ""; // not normal, parseArg might have failed or be a mock function for testing
                            }
                        }
                        this.setOptionValueWithSource(name, val, valueSource);
                    };

                    this.on("option:" + oname, (val) => {
                        const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
                        handleOptionValue(val, invalidValueMessage, "cli");
                    });

                    if (option.envVar) {
                        this.on("optionEnv:" + oname, (val) => {
                            const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
                            handleOptionValue(val, invalidValueMessage, "env");
                        });
                    }

                    return this;
                }

                /**
                 * Internal implementation shared by .option() and .requiredOption()
                 *
                 * @return {Command} `this` command for chaining
                 * @private
                 */
                _optionEx(config, flags, description, fn, defaultValue) {
                    if (typeof flags === "object" && flags instanceof Option) {
                        throw new Error(
                            "To add an Option object use addOption() instead of option() or requiredOption()"
                        );
                    }
                    const option = this.createOption(flags, description);
                    option.makeOptionMandatory(!!config.mandatory);
                    if (typeof fn === "function") {
                        option.default(defaultValue).argParser(fn);
                    } else if (fn instanceof RegExp) {
                        // deprecated
                        const regex = fn;
                        fn = (val, def) => {
                            const m = regex.exec(val);
                            return m ? m[0] : def;
                        };
                        option.default(defaultValue).argParser(fn);
                    } else {
                        option.default(fn);
                    }

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
                    return this._optionEx(
                        {},
                        flags,
                        description,
                        parseArg,
                        defaultValue
                    );
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
                    return this._optionEx(
                        { mandatory: true },
                        flags,
                        description,
                        parseArg,
                        defaultValue
                    );
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
                    if (
                        this.parent &&
                        this._passThroughOptions &&
                        !this.parent._enablePositionalOptions
                    ) {
                        throw new Error(
                            `passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`
                        );
                    }
                }

                /**
                 * Whether to store option values as properties on command object,
                 * or store separately (specify false). In both cases the option values can be accessed using .opts().
                 *
                 * @param {boolean} [storeAsProperties=true]
                 * @return {Command} `this` command for chaining
                 */

                storeOptionsAsProperties(storeAsProperties = true) {
                    if (this.options.length) {
                        throw new Error(
                            "call .storeOptionsAsProperties() before adding options"
                        );
                    }
                    if (Object.keys(this._optionValues).length) {
                        throw new Error(
                            "call .storeOptionsAsProperties() before setting option values"
                        );
                    }
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
                    if (this._storeOptionsAsProperties) {
                        return this[key];
                    }
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
                    return this.setOptionValueWithSource(key, value, undefined);
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
                    if (this._storeOptionsAsProperties) {
                        this[key] = value;
                    } else {
                        this._optionValues[key] = value;
                    }
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
                    // global overwrites local, like optsWithGlobals
                    let source;
                    this._getCommandAndAncestors().forEach((cmd) => {
                        if (cmd.getOptionValueSource(key) !== undefined) {
                            source = cmd.getOptionValueSource(key);
                        }
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
                    if (argv !== undefined && !Array.isArray(argv)) {
                        throw new Error(
                            "first parameter to parse must be array or undefined"
                        );
                    }
                    parseOptions = parseOptions || {};

                    // auto-detect argument conventions if nothing supplied
                    if (argv === undefined && parseOptions.from === undefined) {
                        if (process.versions?.electron) {
                            parseOptions.from = "electron";
                        }
                        // check node specific options for scenarios where user CLI args follow executable without scriptname
                        const execArgv = process.execArgv ?? [];
                        if (
                            execArgv.includes("-e") ||
                            execArgv.includes("--eval") ||
                            execArgv.includes("-p") ||
                            execArgv.includes("--print")
                        ) {
                            parseOptions.from = "eval"; // internal usage, not documented
                        }
                    }

                    // default to using process.argv
                    if (argv === undefined) {
                        argv = process.argv;
                    }
                    this.rawArgs = argv.slice();

                    // extract the user args and scriptPath
                    let userArgs;
                    switch (parseOptions.from) {
                        case undefined:
                        case "node":
                            this._scriptPath = argv[1];
                            userArgs = argv.slice(2);
                            break;
                        case "electron":
                            // @ts-ignore: because defaultApp is an unknown property
                            if (process.defaultApp) {
                                this._scriptPath = argv[1];
                                userArgs = argv.slice(2);
                            } else {
                                userArgs = argv.slice(1);
                            }
                            break;
                        case "user":
                            userArgs = argv.slice(0);
                            break;
                        case "eval":
                            userArgs = argv.slice(1);
                            break;
                        default:
                            throw new Error(
                                `unexpected parse option { from: '${parseOptions.from}' }`
                            );
                    }

                    // Find default name for program from arguments.
                    if (!this._name && this._scriptPath)
                        this.nameFromFilename(this._scriptPath);
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
                    if (this._savedState === null) {
                        this.saveStateBeforeParse();
                    } else {
                        this.restoreStateBeforeParse();
                    }
                }

                /**
                 * Called the first time parse is called to save state and allow a restore before subsequent calls to parse.
                 * Not usually called directly, but available for subclasses to save their custom state.
                 *
                 * This is called in a lazy way. Only commands used in parsing chain will have state saved.
                 */
                saveStateBeforeParse() {
                    this._savedState = {
                        // name is stable if supplied by author, but may be unspecified for root command and deduced during parsing
                        _name: this._name,
                        // option values before parse have default values (including false for negated options)
                        // shallow clones
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
                    if (this._storeOptionsAsProperties)
                        throw new Error(`Can not call parse again when storeOptionsAsProperties is true.
- either make a new Command for each call to parse, or stop storing options as properties`);

                    // clear state from _prepareUserArgs
                    this._name = this._savedState._name;
                    this._scriptPath = null;
                    this.rawArgs = [];
                    // clear state from setOptionValueWithSource
                    this._optionValues = { ...this._savedState._optionValues };
                    this._optionValueSources = {
                        ...this._savedState._optionValueSources
                    };
                    // clear state from _parseCommand
                    this.args = [];
                    // clear state from _processArguments
                    this.processedArgs = [];
                }

                /**
                 * Throw if expected executable is missing. Add lots of help for author.
                 *
                 * @param {string} executableFile
                 * @param {string} executableDir
                 * @param {string} subcommandName
                 */
                _checkForMissingExecutable(
                    executableFile,
                    executableDir,
                    subcommandName
                ) {
                    if (fs.existsSync(executableFile)) return;

                    const executableDirMessage = executableDir
                        ? `searched for local subcommand relative to directory '${executableDir}'`
                        : "no directory for search for local subcommand, use .executableDir() to supply a custom directory";
                    const executableMissing = `'${executableFile}' does not exist
 - if '${subcommandName}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
                    throw new Error(executableMissing);
                }

                /**
                 * Execute a sub-command executable.
                 *
                 * @private
                 */

                _executeSubCommand(subcommand, args) {
                    args = args.slice();
                    let launchWithNode = false; // Use node for source targets so do not need to get permissions correct, and on Windows.
                    const sourceExt = [".js", ".ts", ".tsx", ".mjs", ".cjs"];

                    function findFile(baseDir, baseName) {
                        // Look for specified file
                        const localBin = path.resolve(baseDir, baseName);
                        if (fs.existsSync(localBin)) return localBin;

                        // Stop looking if candidate already has an expected extension.
                        if (sourceExt.includes(path.extname(baseName)))
                            return undefined;

                        // Try all the extensions.
                        const foundExt = sourceExt.find((ext) =>
                            fs.existsSync(`${localBin}${ext}`)
                        );
                        if (foundExt) return `${localBin}${foundExt}`;

                        return undefined;
                    }

                    // Not checking for help first. Unlikely to have mandatory and executable, and can't robustly test for help flags in external command.
                    this._checkForMissingMandatoryOptions();
                    this._checkForConflictingOptions();

                    // executableFile and executableDir might be full path, or just a name
                    let executableFile =
                        subcommand._executableFile ||
                        `${this._name}-${subcommand._name}`;
                    let executableDir = this._executableDir || "";
                    if (this._scriptPath) {
                        let resolvedScriptPath; // resolve possible symlink for installed npm binary
                        try {
                            resolvedScriptPath = fs.realpathSync(
                                this._scriptPath
                            );
                        } catch {
                            resolvedScriptPath = this._scriptPath;
                        }
                        executableDir = path.resolve(
                            path.dirname(resolvedScriptPath),
                            executableDir
                        );
                    }

                    // Look for a local file in preference to a command in PATH.
                    if (executableDir) {
                        let localFile = findFile(executableDir, executableFile);

                        // Legacy search using prefix of script name instead of command name
                        if (
                            !localFile &&
                            !subcommand._executableFile &&
                            this._scriptPath
                        ) {
                            const legacyName = path.basename(
                                this._scriptPath,
                                path.extname(this._scriptPath)
                            );
                            if (legacyName !== this._name) {
                                localFile = findFile(
                                    executableDir,
                                    `${legacyName}-${subcommand._name}`
                                );
                            }
                        }
                        executableFile = localFile || executableFile;
                    }

                    launchWithNode = sourceExt.includes(
                        path.extname(executableFile)
                    );

                    let proc;
                    if (process.platform !== "win32") {
                        if (launchWithNode) {
                            args.unshift(executableFile);
                            // add executable arguments to spawn
                            args = incrementNodeInspectorPort(
                                process.execArgv
                            ).concat(args);

                            proc = childProcess.spawn(process.argv[0], args, {
                                stdio: "inherit"
                            });
                        } else {
                            proc = childProcess.spawn(executableFile, args, {
                                stdio: "inherit"
                            });
                        }
                    } else {
                        this._checkForMissingExecutable(
                            executableFile,
                            executableDir,
                            subcommand._name
                        );
                        args.unshift(executableFile);
                        // add executable arguments to spawn
                        args = incrementNodeInspectorPort(
                            process.execArgv
                        ).concat(args);
                        proc = childProcess.spawn(process.execPath, args, {
                            stdio: "inherit"
                        });
                    }

                    if (!proc.killed) {
                        // testing mainly to avoid leak warnings during unit tests with mocked spawn
                        const signals = [
                            "SIGUSR1",
                            "SIGUSR2",
                            "SIGTERM",
                            "SIGINT",
                            "SIGHUP"
                        ];
                        signals.forEach((signal) => {
                            process.on(signal, () => {
                                if (
                                    proc.killed === false &&
                                    proc.exitCode === null
                                ) {
                                    // @ts-ignore because signals not typed to known strings
                                    proc.kill(signal);
                                }
                            });
                        });
                    }

                    // By default terminate process when spawned process terminates.
                    const exitCallback = this._exitCallback;
                    proc.on("close", (code) => {
                        code = code ?? 1; // code is null if spawned process terminated due to a signal
                        if (!exitCallback) {
                            process.exit(code);
                        } else {
                            exitCallback(
                                new CommanderError(
                                    code,
                                    "commander.executeSubCommandAsync",
                                    "(close)"
                                )
                            );
                        }
                    });
                    proc.on("error", (err) => {
                        // @ts-ignore: because err.code is an unknown property
                        if (err.code === "ENOENT") {
                            this._checkForMissingExecutable(
                                executableFile,
                                executableDir,
                                subcommand._name
                            );
                            // @ts-ignore: because err.code is an unknown property
                        } else if (err.code === "EACCES") {
                            throw new Error(
                                `'${executableFile}' not executable`
                            );
                        }
                        if (!exitCallback) {
                            process.exit(1);
                        } else {
                            const wrappedError = new CommanderError(
                                1,
                                "commander.executeSubCommandAsync",
                                "(error)"
                            );
                            wrappedError.nestedError = err;
                            exitCallback(wrappedError);
                        }
                    });

                    // Store the reference to the child process
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
                    promiseChain = this._chainOrCallSubCommandHook(
                        promiseChain,
                        subCommand,
                        "preSubcommand"
                    );
                    promiseChain = this._chainOrCall(promiseChain, () => {
                        if (subCommand._executableHandler) {
                            this._executeSubCommand(
                                subCommand,
                                operands.concat(unknown)
                            );
                        } else {
                            return subCommand._parseCommand(operands, unknown);
                        }
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
                    if (!subcommandName) {
                        this.help();
                    }
                    const subCommand = this._findCommand(subcommandName);
                    if (subCommand && !subCommand._executableHandler) {
                        subCommand.help();
                    }

                    // Fallback to parsing the help flag to invoke the help.
                    return this._dispatchSubcommand(
                        subcommandName,
                        [],
                        [
                            this._getHelpOption()?.long ??
                                this._getHelpOption()?.short ??
                                "--help"
                        ]
                    );
                }

                /**
                 * Check this.args against expected this.registeredArguments.
                 *
                 * @private
                 */

                _checkNumberOfArguments() {
                    // too few
                    this.registeredArguments.forEach((arg, i) => {
                        if (arg.required && this.args[i] == null) {
                            this.missingArgument(arg.name());
                        }
                    });
                    // too many
                    if (
                        this.registeredArguments.length > 0 &&
                        this.registeredArguments[
                            this.registeredArguments.length - 1
                        ].variadic
                    ) {
                        return;
                    }
                    if (this.args.length > this.registeredArguments.length) {
                        this._excessArguments(this.args);
                    }
                }

                /**
                 * Process this.args using this.registeredArguments and save as this.processedArgs!
                 *
                 * @private
                 */

                _processArguments() {
                    const myParseArg = (argument, value, previous) => {
                        // Extra processing for nice error message on parsing failure.
                        let parsedValue = value;
                        if (value !== null && argument.parseArg) {
                            const invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'.`;
                            parsedValue = this._callParseArg(
                                argument,
                                value,
                                previous,
                                invalidValueMessage
                            );
                        }
                        return parsedValue;
                    };

                    this._checkNumberOfArguments();

                    const processedArgs = [];
                    this.registeredArguments.forEach((declaredArg, index) => {
                        let value = declaredArg.defaultValue;
                        if (declaredArg.variadic) {
                            // Collect together remaining arguments for passing together as an array.
                            if (index < this.args.length) {
                                value = this.args.slice(index);
                                if (declaredArg.parseArg) {
                                    value = value.reduce((processed, v) => {
                                        return myParseArg(
                                            declaredArg,
                                            v,
                                            processed
                                        );
                                    }, declaredArg.defaultValue);
                                }
                            } else if (value === undefined) {
                                value = [];
                            }
                        } else if (index < this.args.length) {
                            value = this.args[index];
                            if (declaredArg.parseArg) {
                                value = myParseArg(
                                    declaredArg,
                                    value,
                                    declaredArg.defaultValue
                                );
                            }
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
                    // thenable
                    if (promise?.then && typeof promise.then === "function") {
                        // already have a promise, chain callback
                        return promise.then(() => fn());
                    }
                    // callback might return a promise
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
                    this._getCommandAndAncestors()
                        .reverse()
                        .filter(
                            (cmd) => cmd._lifeCycleHooks[event] !== undefined
                        )
                        .forEach((hookedCommand) => {
                            hookedCommand._lifeCycleHooks[event].forEach(
                                (callback) => {
                                    hooks.push({ hookedCommand, callback });
                                }
                            );
                        });
                    if (event === "postAction") {
                        hooks.reverse();
                    }

                    hooks.forEach((hookDetail) => {
                        result = this._chainOrCall(result, () => {
                            return hookDetail.callback(
                                hookDetail.hookedCommand,
                                this
                            );
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
                    if (this._lifeCycleHooks[event] !== undefined) {
                        this._lifeCycleHooks[event].forEach((hook) => {
                            result = this._chainOrCall(result, () => {
                                return hook(this, subCommand);
                            });
                        });
                    }
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
                    this._parseOptionsEnv(); // after cli, so parseArg not called on both cli and env
                    this._parseOptionsImplied();
                    operands = operands.concat(parsed.operands);
                    unknown = parsed.unknown;
                    this.args = operands.concat(unknown);

                    if (operands && this._findCommand(operands[0])) {
                        return this._dispatchSubcommand(
                            operands[0],
                            operands.slice(1),
                            unknown
                        );
                    }
                    if (
                        this._getHelpCommand() &&
                        operands[0] === this._getHelpCommand().name()
                    ) {
                        return this._dispatchHelpCommand(operands[1]);
                    }
                    if (this._defaultCommandName) {
                        this._outputHelpIfRequested(unknown); // Run the help for default command from parent rather than passing to default command
                        return this._dispatchSubcommand(
                            this._defaultCommandName,
                            operands,
                            unknown
                        );
                    }
                    if (
                        this.commands.length &&
                        this.args.length === 0 &&
                        !this._actionHandler &&
                        !this._defaultCommandName
                    ) {
                        // probably missing subcommand and no handler, user needs help (and exit)
                        this.help({ error: true });
                    }

                    this._outputHelpIfRequested(parsed.unknown);
                    this._checkForMissingMandatoryOptions();
                    this._checkForConflictingOptions();

                    // We do not always call this check to avoid masking a "better" error, like unknown command.
                    const checkForUnknownOptions = () => {
                        if (parsed.unknown.length > 0) {
                            this.unknownOption(parsed.unknown[0]);
                        }
                    };

                    const commandEvent = `command:${this.name()}`;
                    if (this._actionHandler) {
                        checkForUnknownOptions();
                        this._processArguments();

                        let promiseChain;
                        promiseChain = this._chainOrCallHooks(
                            promiseChain,
                            "preAction"
                        );
                        promiseChain = this._chainOrCall(promiseChain, () =>
                            this._actionHandler(this.processedArgs)
                        );
                        if (this.parent) {
                            promiseChain = this._chainOrCall(
                                promiseChain,
                                () => {
                                    this.parent.emit(
                                        commandEvent,
                                        operands,
                                        unknown
                                    ); // legacy
                                }
                            );
                        }
                        promiseChain = this._chainOrCallHooks(
                            promiseChain,
                            "postAction"
                        );
                        return promiseChain;
                    }
                    if (this.parent?.listenerCount(commandEvent)) {
                        checkForUnknownOptions();
                        this._processArguments();
                        this.parent.emit(commandEvent, operands, unknown); // legacy
                    } else if (operands.length) {
                        if (this._findCommand("*")) {
                            // legacy default command
                            return this._dispatchSubcommand(
                                "*",
                                operands,
                                unknown
                            );
                        }
                        if (this.listenerCount("command:*")) {
                            // skip option check, emit event for possible misspelling suggestion
                            this.emit("command:*", operands, unknown);
                        } else if (this.commands.length) {
                            this.unknownCommand();
                        } else {
                            checkForUnknownOptions();
                            this._processArguments();
                        }
                    } else if (this.commands.length) {
                        checkForUnknownOptions();
                        // This command has subcommands and nothing hooked up at this level, so display help (and exit).
                        this.help({ error: true });
                    } else {
                        checkForUnknownOptions();
                        this._processArguments();
                        // fall through for caller to handle after calling .parse()
                    }
                }

                /**
                 * Find matching command.
                 *
                 * @private
                 * @return {Command | undefined}
                 */
                _findCommand(name) {
                    if (!name) return undefined;
                    return this.commands.find(
                        (cmd) =>
                            cmd._name === name || cmd._aliases.includes(name)
                    );
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
                    // Walk up hierarchy so can call in subcommand after checking for displaying help.
                    this._getCommandAndAncestors().forEach((cmd) => {
                        cmd.options.forEach((anOption) => {
                            if (
                                anOption.mandatory &&
                                cmd.getOptionValue(anOption.attributeName()) ===
                                    undefined
                            ) {
                                cmd.missingMandatoryOptionValue(anOption);
                            }
                        });
                    });
                }

                /**
                 * Display an error message if conflicting options are used together in this.
                 *
                 * @private
                 */
                _checkForConflictingLocalOptions() {
                    const definedNonDefaultOptions = this.options.filter(
                        (option) => {
                            const optionKey = option.attributeName();
                            if (this.getOptionValue(optionKey) === undefined) {
                                return false;
                            }
                            return (
                                this.getOptionValueSource(optionKey) !==
                                "default"
                            );
                        }
                    );

                    const optionsWithConflicting =
                        definedNonDefaultOptions.filter(
                            (option) => option.conflictsWith.length > 0
                        );

                    optionsWithConflicting.forEach((option) => {
                        const conflictingAndDefined =
                            definedNonDefaultOptions.find((defined) =>
                                option.conflictsWith.includes(
                                    defined.attributeName()
                                )
                            );
                        if (conflictingAndDefined) {
                            this._conflictingOption(
                                option,
                                conflictingAndDefined
                            );
                        }
                    });
                }

                /**
                 * Display an error message if conflicting options are used together.
                 * Called after checking for help flags in leaf subcommand.
                 *
                 * @private
                 */
                _checkForConflictingOptions() {
                    // Walk up hierarchy so can call in subcommand after checking for displaying help.
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
                    const operands = []; // operands, not options or values
                    const unknown = []; // first unknown option and remaining unknown args
                    let dest = operands;

                    function maybeOption(arg) {
                        return arg.length > 1 && arg[0] === "-";
                    }

                    const negativeNumberArg = (arg) => {
                        // return false if not a negative number
                        if (!/^-(\d+|\d*\.\d+)(e[+-]?\d+)?$/.test(arg))
                            return false;
                        // negative number is ok unless digit used as an option in command hierarchy
                        return !this._getCommandAndAncestors().some((cmd) =>
                            cmd.options
                                .map((opt) => opt.short)
                                .some((short) => /^-\d$/.test(short))
                        );
                    };

                    // parse options
                    let activeVariadicOption = null;
                    let activeGroup = null; // working through group of short options, like -abc
                    let i = 0;
                    while (i < args.length || activeGroup) {
                        const arg = activeGroup ?? args[i++];
                        activeGroup = null;

                        // literal
                        if (arg === "--") {
                            if (dest === unknown) dest.push(arg);
                            dest.push(...args.slice(i));
                            break;
                        }

                        if (
                            activeVariadicOption &&
                            (!maybeOption(arg) || negativeNumberArg(arg))
                        ) {
                            this.emit(
                                `option:${activeVariadicOption.name()}`,
                                arg
                            );
                            continue;
                        }
                        activeVariadicOption = null;

                        if (maybeOption(arg)) {
                            const option = this._findOption(arg);
                            // recognised option, call listener to assign value with possible custom processing
                            if (option) {
                                if (option.required) {
                                    const value = args[i++];
                                    if (value === undefined)
                                        this.optionMissingArgument(option);
                                    this.emit(`option:${option.name()}`, value);
                                } else if (option.optional) {
                                    let value = null;
                                    // historical behaviour is optional value is following arg unless an option
                                    if (
                                        i < args.length &&
                                        (!maybeOption(args[i]) ||
                                            negativeNumberArg(args[i]))
                                    ) {
                                        value = args[i++];
                                    }
                                    this.emit(`option:${option.name()}`, value);
                                } else {
                                    // boolean flag
                                    this.emit(`option:${option.name()}`);
                                }
                                activeVariadicOption = option.variadic
                                    ? option
                                    : null;
                                continue;
                            }
                        }

                        // Look for combo options following single dash, eat first one if known.
                        if (
                            arg.length > 2 &&
                            arg[0] === "-" &&
                            arg[1] !== "-"
                        ) {
                            const option = this._findOption(`-${arg[1]}`);
                            if (option) {
                                if (
                                    option.required ||
                                    (option.optional &&
                                        this._combineFlagAndOptionalValue)
                                ) {
                                    // option with value following in same argument
                                    this.emit(
                                        `option:${option.name()}`,
                                        arg.slice(2)
                                    );
                                } else {
                                    // boolean option
                                    this.emit(`option:${option.name()}`);
                                    // remove the processed option and keep processing group
                                    activeGroup = `-${arg.slice(2)}`;
                                }
                                continue;
                            }
                        }

                        // Look for known long flag with value, like --foo=bar
                        if (/^--[^=]+=/.test(arg)) {
                            const index = arg.indexOf("=");
                            const option = this._findOption(
                                arg.slice(0, index)
                            );
                            if (
                                option &&
                                (option.required || option.optional)
                            ) {
                                this.emit(
                                    `option:${option.name()}`,
                                    arg.slice(index + 1)
                                );
                                continue;
                            }
                        }

                        // Not a recognised option by this command.
                        // Might be a command-argument, or subcommand option, or unknown option, or help command or option.

                        // An unknown option means further arguments also classified as unknown so can be reprocessed by subcommands.
                        // A negative number in a leaf command is not an unknown option.
                        if (
                            dest === operands &&
                            maybeOption(arg) &&
                            !(
                                this.commands.length === 0 &&
                                negativeNumberArg(arg)
                            )
                        ) {
                            dest = unknown;
                        }

                        // If using positionalOptions, stop processing our options at subcommand.
                        if (
                            (this._enablePositionalOptions ||
                                this._passThroughOptions) &&
                            operands.length === 0 &&
                            unknown.length === 0
                        ) {
                            if (this._findCommand(arg)) {
                                operands.push(arg);
                                unknown.push(...args.slice(i));
                                break;
                            } else if (
                                this._getHelpCommand() &&
                                arg === this._getHelpCommand().name()
                            ) {
                                operands.push(arg, ...args.slice(i));
                                break;
                            } else if (this._defaultCommandName) {
                                unknown.push(arg, ...args.slice(i));
                                break;
                            }
                        }

                        // If using passThroughOptions, stop processing options at first command-argument.
                        if (this._passThroughOptions) {
                            dest.push(arg, ...args.slice(i));
                            break;
                        }

                        // add arg
                        dest.push(arg);
                    }

                    return { operands, unknown };
                }

                /**
                 * Return an object containing local option values as key-value pairs.
                 *
                 * @return {object}
                 */
                opts() {
                    if (this._storeOptionsAsProperties) {
                        // Preserve original behaviour so backwards compatible when still using properties
                        const result = {};
                        const len = this.options.length;

                        for (let i = 0; i < len; i++) {
                            const key = this.options[i].attributeName();
                            result[key] =
                                key === this._versionOptionName
                                    ? this._version
                                    : this[key];
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
                    // globals overwrite locals
                    return this._getCommandAndAncestors().reduce(
                        (combinedOptions, cmd) =>
                            Object.assign(combinedOptions, cmd.opts()),
                        {}
                    );
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
                    // output handling
                    this._outputConfiguration.outputError(
                        `${message}\n`,
                        this._outputConfiguration.writeErr
                    );
                    if (typeof this._showHelpAfterError === "string") {
                        this._outputConfiguration.writeErr(
                            `${this._showHelpAfterError}\n`
                        );
                    } else if (this._showHelpAfterError) {
                        this._outputConfiguration.writeErr("\n");
                        this.outputHelp({ error: true });
                    }

                    // exit handling
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
                        if (option.envVar && option.envVar in process.env) {
                            const optionKey = option.attributeName();
                            // Priority check. Do not overwrite cli or options from unknown source (client-code).
                            if (
                                this.getOptionValue(optionKey) === undefined ||
                                ["default", "config", "env"].includes(
                                    this.getOptionValueSource(optionKey)
                                )
                            ) {
                                if (option.required || option.optional) {
                                    // option can take a value
                                    // keep very simple, optional always takes value
                                    this.emit(
                                        `optionEnv:${option.name()}`,
                                        process.env[option.envVar]
                                    );
                                } else {
                                    // boolean
                                    // keep very simple, only care that envVar defined and not the value
                                    this.emit(`optionEnv:${option.name()}`);
                                }
                            }
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
                        return (
                            this.getOptionValue(optionKey) !== undefined &&
                            !["default", "implied"].includes(
                                this.getOptionValueSource(optionKey)
                            )
                        );
                    };
                    this.options
                        .filter(
                            (option) =>
                                option.implied !== undefined &&
                                hasCustomOptionValue(option.attributeName()) &&
                                dualHelper.valueFromOption(
                                    this.getOptionValue(option.attributeName()),
                                    option
                                )
                        )
                        .forEach((option) => {
                            Object.keys(option.implied)
                                .filter(
                                    (impliedKey) =>
                                        !hasCustomOptionValue(impliedKey)
                                )
                                .forEach((impliedKey) => {
                                    this.setOptionValueWithSource(
                                        impliedKey,
                                        option.implied[impliedKey],
                                        "implied"
                                    );
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
                    this.error(message, {
                        code: "commander.optionMissingArgument"
                    });
                }

                /**
                 * `Option` does not have a value, and is a mandatory option.
                 *
                 * @param {Option} option
                 * @private
                 */

                missingMandatoryOptionValue(option) {
                    const message = `error: required option '${option.flags}' not specified`;
                    this.error(message, {
                        code: "commander.missingMandatoryOptionValue"
                    });
                }

                /**
                 * `Option` conflicts with another option.
                 *
                 * @param {Option} option
                 * @param {Option} conflictingOption
                 * @private
                 */
                _conflictingOption(option, conflictingOption) {
                    // The calling code does not know whether a negated option is the source of the
                    // value, so do some work to take an educated guess.
                    const findBestOptionFromValue = (option) => {
                        const optionKey = option.attributeName();
                        const optionValue = this.getOptionValue(optionKey);
                        const negativeOption = this.options.find(
                            (target) =>
                                target.negate &&
                                optionKey === target.attributeName()
                        );
                        const positiveOption = this.options.find(
                            (target) =>
                                !target.negate &&
                                optionKey === target.attributeName()
                        );
                        if (
                            negativeOption &&
                            ((negativeOption.presetArg === undefined &&
                                optionValue === false) ||
                                (negativeOption.presetArg !== undefined &&
                                    optionValue === negativeOption.presetArg))
                        ) {
                            return negativeOption;
                        }
                        return positiveOption || option;
                    };

                    const getErrorMessage = (option) => {
                        const bestOption = findBestOptionFromValue(option);
                        const optionKey = bestOption.attributeName();
                        const source = this.getOptionValueSource(optionKey);
                        if (source === "env") {
                            return `environment variable '${bestOption.envVar}'`;
                        }
                        return `option '${bestOption.flags}'`;
                    };

                    const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
                    this.error(message, {
                        code: "commander.conflictingOption"
                    });
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

                    if (
                        flag.startsWith("--") &&
                        this._showSuggestionAfterError
                    ) {
                        // Looping to pick up the global options too
                        let candidateFlags = [];
                        // eslint-disable-next-line @typescript-eslint/no-this-alias
                        let command = this;
                        do {
                            const moreFlags = command
                                .createHelp()
                                .visibleOptions(command)
                                .filter((option) => option.long)
                                .map((option) => option.long);
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
                    const forSubcommand = this.parent
                        ? ` for '${this.name()}'`
                        : "";
                    const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
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
                        this.createHelp()
                            .visibleCommands(this)
                            .forEach((command) => {
                                candidateNames.push(command.name());
                                // just visible alias
                                if (command.alias())
                                    candidateNames.push(command.alias());
                            });
                        suggestion = suggestSimilar(
                            unknownName,
                            candidateNames
                        );
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
                    if (str === undefined) return this._version;
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
                    if (str === undefined && argsDescription === undefined)
                        return this._description;
                    this._description = str;
                    if (argsDescription) {
                        this._argsDescription = argsDescription;
                    }
                    return this;
                }

                /**
                 * Set the summary. Used when listed as subcommand of parent.
                 *
                 * @param {string} [str]
                 * @return {(string|Command)}
                 */
                summary(str) {
                    if (str === undefined) return this._summary;
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
                    if (alias === undefined) return this._aliases[0]; // just return first, for backwards compatibility

                    /** @type {Command} */
                    // eslint-disable-next-line @typescript-eslint/no-this-alias
                    let command = this;
                    if (
                        this.commands.length !== 0 &&
                        this.commands[this.commands.length - 1]
                            ._executableHandler
                    ) {
                        // assume adding alias for last added executable subcommand, rather than this
                        command = this.commands[this.commands.length - 1];
                    }

                    if (alias === command._name)
                        throw new Error(
                            "Command alias can't be the same as its name"
                        );
                    const matchingCommand = this.parent?._findCommand(alias);
                    if (matchingCommand) {
                        // c.f. _registerCommand
                        const existingCmd = [matchingCommand.name()]
                            .concat(matchingCommand.aliases())
                            .join("|");
                        throw new Error(
                            `cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`
                        );
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
                    // Getter for the array of aliases is the main reason for having aliases() in addition to alias().
                    if (aliases === undefined) return this._aliases;

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
                    if (str === undefined) {
                        if (this._usage) return this._usage;

                        const args = this.registeredArguments.map((arg) => {
                            return humanReadableArgName(arg);
                        });
                        return []
                            .concat(
                                this.options.length || this._helpOption !== null
                                    ? "[options]"
                                    : [],
                                this.commands.length ? "[command]" : [],
                                this.registeredArguments.length ? args : []
                            )
                            .join(" ");
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
                    if (str === undefined) return this._name;
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
                    if (heading === undefined)
                        return this._helpGroupHeading ?? "";
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
                    if (heading === undefined)
                        return this._defaultCommandGroup ?? "";
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
                    if (heading === undefined)
                        return this._defaultOptionGroup ?? "";
                    this._defaultOptionGroup = heading;
                    return this;
                }

                /**
                 * @param {Option} option
                 * @private
                 */
                _initOptionGroup(option) {
                    if (this._defaultOptionGroup && !option.helpGroupHeading)
                        option.helpGroup(this._defaultOptionGroup);
                }

                /**
                 * @param {Command} cmd
                 * @private
                 */
                _initCommandGroup(cmd) {
                    if (this._defaultCommandGroup && !cmd.helpGroup())
                        cmd.helpGroup(this._defaultCommandGroup);
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
                    this._name = path.basename(
                        filename,
                        path.extname(filename)
                    );

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
                    if (path === undefined) return this._executableDir;
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
                        baseWrite = (str) =>
                            this._outputConfiguration.writeErr(str);
                        hasColors = this._outputConfiguration.getErrHasColors();
                        helpWidth = this._outputConfiguration.getErrHelpWidth();
                    } else {
                        baseWrite = (str) =>
                            this._outputConfiguration.writeOut(str);
                        hasColors = this._outputConfiguration.getOutHasColors();
                        helpWidth = this._outputConfiguration.getOutHelpWidth();
                    }
                    const write = (str) => {
                        if (!hasColors)
                            str = this._outputConfiguration.stripColor(str);
                        return baseWrite(str);
                    };
                    return { error, write, hasColors, helpWidth };
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
                        contextOptions = undefined;
                    }

                    const outputContext =
                        this._getOutputContext(contextOptions);
                    /** @type {HelpTextEventContext} */
                    const eventContext = {
                        error: outputContext.error,
                        write: outputContext.write,
                        command: this
                    };

                    this._getCommandAndAncestors()
                        .reverse()
                        .forEach((command) =>
                            command.emit("beforeAllHelp", eventContext)
                        );
                    this.emit("beforeHelp", eventContext);

                    let helpInformation = this.helpInformation({
                        error: outputContext.error
                    });
                    if (deprecatedCallback) {
                        helpInformation = deprecatedCallback(helpInformation);
                        if (
                            typeof helpInformation !== "string" &&
                            !Buffer.isBuffer(helpInformation)
                        ) {
                            throw new Error(
                                "outputHelp callback must return a string or a Buffer"
                            );
                        }
                    }
                    outputContext.write(helpInformation);

                    if (this._getHelpOption()?.long) {
                        this.emit(this._getHelpOption().long); // deprecated
                    }
                    this.emit("afterHelp", eventContext);
                    this._getCommandAndAncestors().forEach((command) =>
                        command.emit("afterAllHelp", eventContext)
                    );
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
                    // Support enabling/disabling built-in help option.
                    if (typeof flags === "boolean") {
                        if (flags) {
                            if (this._helpOption === null)
                                this._helpOption = undefined; // reenable
                            if (this._defaultOptionGroup) {
                                // make the option to store the group
                                this._initOptionGroup(this._getHelpOption());
                            }
                        } else {
                            this._helpOption = null; // disable
                        }
                        return this;
                    }

                    // Customise flags and description.
                    this._helpOption = this.createOption(
                        flags ?? "-h, --help",
                        description ?? "display help for command"
                    );
                    // init group unless lazy create
                    if (flags || description)
                        this._initOptionGroup(this._helpOption);

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
                    // Lazy create help option on demand.
                    if (this._helpOption === undefined) {
                        this.helpOption(undefined, undefined);
                    }
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
                    let exitCode = Number(process.exitCode ?? 0); // process.exitCode does allow a string or an integer, but we prefer just a number
                    if (
                        exitCode === 0 &&
                        contextOptions &&
                        typeof contextOptions !== "function" &&
                        contextOptions.error
                    ) {
                        exitCode = 1;
                    }
                    // message: do not have all displayed text available so only passing placeholder.
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
                    if (!allowedValues.includes(position)) {
                        throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
                    }

                    const helpEvent = `${position}Help`;
                    this.on(
                        helpEvent,
                        (/** @type {HelpTextEventContext} */ context) => {
                            let helpStr;
                            if (typeof text === "function") {
                                helpStr = text({
                                    error: context.error,
                                    command: context.command
                                });
                            } else {
                                helpStr = text;
                            }
                            // Ignore falsy value when nothing to output.
                            if (helpStr) {
                                context.write(`${helpStr}\n`);
                            }
                        }
                    );
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
                    const helpRequested =
                        helpOption && args.find((arg) => helpOption.is(arg));
                    if (helpRequested) {
                        this.outputHelp();
                        // (Do not have all displayed text available so only passing placeholder.)
                        this._exit(
                            0,
                            "commander.helpDisplayed",
                            "(outputHelp)"
                        );
                    }
                }
            }

            /**
             * Scan arguments and increment port number for inspect calls (to avoid conflicts when spawning new command).
             *
             * @param {string[]} args - array of arguments from node.execArgv
             * @returns {string[]}
             * @private
             */

            function incrementNodeInspectorPort(args) {
                // Testing for these options:
                //  --inspect[=[host:]port]
                //  --inspect-brk[=[host:]port]
                //  --inspect-port=[host:]port
                return args.map((arg) => {
                    if (!arg.startsWith("--inspect")) {
                        return arg;
                    }
                    let debugOption;
                    let debugHost = "127.0.0.1";
                    let debugPort = "9229";
                    let match;
                    if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
                        // e.g. --inspect
                        debugOption = match[1];
                    } else if (
                        (match = arg.match(
                            /^(--inspect(-brk|-port)?)=([^:]+)$/
                        )) !== null
                    ) {
                        debugOption = match[1];
                        if (/^\d+$/.test(match[3])) {
                            // e.g. --inspect=1234
                            debugPort = match[3];
                        } else {
                            // e.g. --inspect=localhost
                            debugHost = match[3];
                        }
                    } else if (
                        (match = arg.match(
                            /^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/
                        )) !== null
                    ) {
                        // e.g. --inspect=localhost:1234
                        debugOption = match[1];
                        debugHost = match[3];
                        debugPort = match[4];
                    }

                    if (debugOption && debugPort !== "0") {
                        return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
                    }
                    return arg;
                });
            }

            /**
             * @returns {boolean | undefined}
             * @package
             */
            function useColor() {
                // Test for common conventions.
                // NB: the observed behaviour is in combination with how author adds color! For example:
                //   - we do not test NODE_DISABLE_COLORS, but util:styletext does
                //   - we do test NO_COLOR, but Chalk does not
                //
                // References:
                // https://no-color.org
                // https://bixense.com/clicolors/
                // https://github.com/nodejs/node/blob/0a00217a5f67ef4a22384cfc80eb6dd9a917fdc1/lib/internal/tty.js#L109
                // https://github.com/chalk/supports-color/blob/c214314a14bcb174b12b3014b2b0a8de375029ae/index.js#L33
                // (https://force-color.org recent web page from 2023, does not match major javascript implementations)

                if (
                    process.env.NO_COLOR ||
                    process.env.FORCE_COLOR === "0" ||
                    process.env.FORCE_COLOR === "false"
                )
                    return false;
                if (
                    process.env.FORCE_COLOR ||
                    process.env.CLICOLOR_FORCE !== undefined
                )
                    return true;
                return undefined;
            }

            exports.Command = Command;
            exports.useColor = useColor; // exporting for tests

            /***/
        },

        /***/ 7252: /***/ (__unused_webpack_module, exports) => {
            /**
             * CommanderError class
             */
            class CommanderError extends Error {
                /**
                 * Constructs the CommanderError class
                 * @param {number} exitCode suggested exit code which could be used with process.exit
                 * @param {string} code an id string representing the error
                 * @param {string} message human-readable description of the error
                 */
                constructor(exitCode, code, message) {
                    super(message);
                    // properly capture stack trace in Node.js
                    Error.captureStackTrace(this, this.constructor);
                    this.name = this.constructor.name;
                    this.code = code;
                    this.exitCode = exitCode;
                    this.nestedError = undefined;
                }
            }

            /**
             * InvalidArgumentError class
             */
            class InvalidArgumentError extends CommanderError {
                /**
                 * Constructs the InvalidArgumentError class
                 * @param {string} [message] explanation of why argument is invalid
                 */
                constructor(message) {
                    super(1, "commander.invalidArgument", message);
                    // properly capture stack trace in Node.js
                    Error.captureStackTrace(this, this.constructor);
                    this.name = this.constructor.name;
                }
            }

            exports.CommanderError = CommanderError;
            exports.InvalidArgumentError = InvalidArgumentError;

            /***/
        },

        /***/ 9171: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            const { humanReadableArgName } = __nccwpck_require__(5875);

            /**
             * TypeScript import types for JSDoc, used by Visual Studio Code IntelliSense and `npm run typescript-checkJS`
             * https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types
             * @typedef { import("./argument.js").Argument } Argument
             * @typedef { import("./command.js").Command } Command
             * @typedef { import("./option.js").Option } Option
             */

            // Although this is a class, methods are static in style to allow override using subclass or just functions.
            class Help {
                constructor() {
                    this.helpWidth = undefined;
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
                    this.helpWidth =
                        this.helpWidth ?? contextOptions.helpWidth ?? 80;
                }

                /**
                 * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
                 *
                 * @param {Command} cmd
                 * @returns {Command[]}
                 */

                visibleCommands(cmd) {
                    const visibleCommands = cmd.commands.filter(
                        (cmd) => !cmd._hidden
                    );
                    const helpCommand = cmd._getHelpCommand();
                    if (helpCommand && !helpCommand._hidden) {
                        visibleCommands.push(helpCommand);
                    }
                    if (this.sortSubcommands) {
                        visibleCommands.sort((a, b) => {
                            // @ts-ignore: because overloaded return type
                            return a.name().localeCompare(b.name());
                        });
                    }
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
                        // WYSIWYG for order displayed in help. Short used for comparison if present. No special handling for negated.
                        return option.short
                            ? option.short.replace(/^-/, "")
                            : option.long.replace(/^--/, "");
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
                    const visibleOptions = cmd.options.filter(
                        (option) => !option.hidden
                    );
                    // Built-in help option.
                    const helpOption = cmd._getHelpOption();
                    if (helpOption && !helpOption.hidden) {
                        // Automatically hide conflicting flags. Bit dubious but a historical behaviour that is convenient for single-command programs.
                        const removeShort =
                            helpOption.short &&
                            cmd._findOption(helpOption.short);
                        const removeLong =
                            helpOption.long && cmd._findOption(helpOption.long);
                        if (!removeShort && !removeLong) {
                            visibleOptions.push(helpOption); // no changes needed
                        } else if (helpOption.long && !removeLong) {
                            visibleOptions.push(
                                cmd.createOption(
                                    helpOption.long,
                                    helpOption.description
                                )
                            );
                        } else if (helpOption.short && !removeShort) {
                            visibleOptions.push(
                                cmd.createOption(
                                    helpOption.short,
                                    helpOption.description
                                )
                            );
                        }
                    }
                    if (this.sortOptions) {
                        visibleOptions.sort(this.compareOptions);
                    }
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
                    for (
                        let ancestorCmd = cmd.parent;
                        ancestorCmd;
                        ancestorCmd = ancestorCmd.parent
                    ) {
                        const visibleOptions = ancestorCmd.options.filter(
                            (option) => !option.hidden
                        );
                        globalOptions.push(...visibleOptions);
                    }
                    if (this.sortOptions) {
                        globalOptions.sort(this.compareOptions);
                    }
                    return globalOptions;
                }

                /**
                 * Get an array of the arguments if any have a description.
                 *
                 * @param {Command} cmd
                 * @returns {Argument[]}
                 */

                visibleArguments(cmd) {
                    // Side effect! Apply the legacy descriptions before the arguments are displayed.
                    if (cmd._argsDescription) {
                        cmd.registeredArguments.forEach((argument) => {
                            argument.description =
                                argument.description ||
                                cmd._argsDescription[argument.name()] ||
                                "";
                        });
                    }

                    // If there are any arguments with a description then return all the arguments.
                    if (
                        cmd.registeredArguments.find(
                            (argument) => argument.description
                        )
                    ) {
                        return cmd.registeredArguments;
                    }
                    return [];
                }

                /**
                 * Get the command term to show in the list of subcommands.
                 *
                 * @param {Command} cmd
                 * @returns {string}
                 */

                subcommandTerm(cmd) {
                    // Legacy. Ignores custom usage string, and nested commands.
                    const args = cmd.registeredArguments
                        .map((arg) => humanReadableArgName(arg))
                        .join(" ");
                    return (
                        cmd._name +
                        (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") +
                        (cmd.options.length ? " [options]" : "") + // simplistic check for non-help option
                        (args ? " " + args : "")
                    );
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
                    return helper
                        .visibleCommands(cmd)
                        .reduce((max, command) => {
                            return Math.max(
                                max,
                                this.displayWidth(
                                    helper.styleSubcommandTerm(
                                        helper.subcommandTerm(command)
                                    )
                                )
                            );
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
                        return Math.max(
                            max,
                            this.displayWidth(
                                helper.styleOptionTerm(
                                    helper.optionTerm(option)
                                )
                            )
                        );
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
                    return helper
                        .visibleGlobalOptions(cmd)
                        .reduce((max, option) => {
                            return Math.max(
                                max,
                                this.displayWidth(
                                    helper.styleOptionTerm(
                                        helper.optionTerm(option)
                                    )
                                )
                            );
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
                    return helper
                        .visibleArguments(cmd)
                        .reduce((max, argument) => {
                            return Math.max(
                                max,
                                this.displayWidth(
                                    helper.styleArgumentTerm(
                                        helper.argumentTerm(argument)
                                    )
                                )
                            );
                        }, 0);
                }

                /**
                 * Get the command usage to be displayed at the top of the built-in help.
                 *
                 * @param {Command} cmd
                 * @returns {string}
                 */

                commandUsage(cmd) {
                    // Usage
                    let cmdName = cmd._name;
                    if (cmd._aliases[0]) {
                        cmdName = cmdName + "|" + cmd._aliases[0];
                    }
                    let ancestorCmdNames = "";
                    for (
                        let ancestorCmd = cmd.parent;
                        ancestorCmd;
                        ancestorCmd = ancestorCmd.parent
                    ) {
                        ancestorCmdNames =
                            ancestorCmd.name() + " " + ancestorCmdNames;
                    }
                    return ancestorCmdNames + cmdName + " " + cmd.usage();
                }

                /**
                 * Get the description for the command.
                 *
                 * @param {Command} cmd
                 * @returns {string}
                 */

                commandDescription(cmd) {
                    // @ts-ignore: because overloaded return type
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
                    // @ts-ignore: because overloaded return type
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

                    if (option.argChoices) {
                        extraInfo.push(
                            // use stringify to match the display of the default value
                            `choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
                        );
                    }
                    if (option.defaultValue !== undefined) {
                        // default for boolean and negated more for programmer than end user,
                        // but show true/false for boolean option as may be for hand-rolled env or config processing.
                        const showDefault =
                            option.required ||
                            option.optional ||
                            (option.isBoolean() &&
                                typeof option.defaultValue === "boolean");
                        if (showDefault) {
                            extraInfo.push(
                                `default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`
                            );
                        }
                    }
                    // preset for boolean and negated are more for programmer than end user
                    if (option.presetArg !== undefined && option.optional) {
                        extraInfo.push(
                            `preset: ${JSON.stringify(option.presetArg)}`
                        );
                    }
                    if (option.envVar !== undefined) {
                        extraInfo.push(`env: ${option.envVar}`);
                    }
                    if (extraInfo.length > 0) {
                        const extraDescription = `(${extraInfo.join(", ")})`;
                        if (option.description) {
                            return `${option.description} ${extraDescription}`;
                        }
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
                    if (argument.argChoices) {
                        extraInfo.push(
                            // use stringify to match the display of the default value
                            `choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
                        );
                    }
                    if (argument.defaultValue !== undefined) {
                        extraInfo.push(
                            `default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`
                        );
                    }
                    if (extraInfo.length > 0) {
                        const extraDescription = `(${extraInfo.join(", ")})`;
                        if (argument.description) {
                            return `${argument.description} ${extraDescription}`;
                        }
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

                    return [helper.styleTitle(heading), ...items, ""];
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
                    const result = new Map();
                    // Add groups in order of appearance in unsortedItems.
                    unsortedItems.forEach((item) => {
                        const group = getGroup(item);
                        if (!result.has(group)) result.set(group, []);
                    });
                    // Add items in order of appearance in visibleItems.
                    visibleItems.forEach((item) => {
                        const group = getGroup(item);
                        if (!result.has(group)) {
                            result.set(group, []);
                        }
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
                    const helpWidth = helper.helpWidth ?? 80; // in case prepareContext() was not called

                    function callFormatItem(term, description) {
                        return helper.formatItem(
                            term,
                            termWidth,
                            description,
                            helper
                        );
                    }

                    // Usage
                    let output = [
                        `${helper.styleTitle("Usage:")} ${helper.styleUsage(helper.commandUsage(cmd))}`,
                        ""
                    ];

                    // Description
                    const commandDescription = helper.commandDescription(cmd);
                    if (commandDescription.length > 0) {
                        output = output.concat([
                            helper.boxWrap(
                                helper.styleCommandDescription(
                                    commandDescription
                                ),
                                helpWidth
                            ),
                            ""
                        ]);
                    }

                    // Arguments
                    const argumentList = helper
                        .visibleArguments(cmd)
                        .map((argument) => {
                            return callFormatItem(
                                helper.styleArgumentTerm(
                                    helper.argumentTerm(argument)
                                ),
                                helper.styleArgumentDescription(
                                    helper.argumentDescription(argument)
                                )
                            );
                        });
                    output = output.concat(
                        this.formatItemList("Arguments:", argumentList, helper)
                    );

                    // Options
                    const optionGroups = this.groupItems(
                        cmd.options,
                        helper.visibleOptions(cmd),
                        (option) => option.helpGroupHeading ?? "Options:"
                    );
                    optionGroups.forEach((options, group) => {
                        const optionList = options.map((option) => {
                            return callFormatItem(
                                helper.styleOptionTerm(
                                    helper.optionTerm(option)
                                ),
                                helper.styleOptionDescription(
                                    helper.optionDescription(option)
                                )
                            );
                        });
                        output = output.concat(
                            this.formatItemList(group, optionList, helper)
                        );
                    });

                    if (helper.showGlobalOptions) {
                        const globalOptionList = helper
                            .visibleGlobalOptions(cmd)
                            .map((option) => {
                                return callFormatItem(
                                    helper.styleOptionTerm(
                                        helper.optionTerm(option)
                                    ),
                                    helper.styleOptionDescription(
                                        helper.optionDescription(option)
                                    )
                                );
                            });
                        output = output.concat(
                            this.formatItemList(
                                "Global Options:",
                                globalOptionList,
                                helper
                            )
                        );
                    }

                    // Commands
                    const commandGroups = this.groupItems(
                        cmd.commands,
                        helper.visibleCommands(cmd),
                        (sub) => sub.helpGroup() || "Commands:"
                    );
                    commandGroups.forEach((commands, group) => {
                        const commandList = commands.map((sub) => {
                            return callFormatItem(
                                helper.styleSubcommandTerm(
                                    helper.subcommandTerm(sub)
                                ),
                                helper.styleSubcommandDescription(
                                    helper.subcommandDescription(sub)
                                )
                            );
                        });
                        output = output.concat(
                            this.formatItemList(group, commandList, helper)
                        );
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
                    // Usage has lots of parts the user might like to color separately! Assume default usage string which is formed like:
                    //    command subcommand [options] [command] <foo> [bar]
                    return str
                        .split(" ")
                        .map((word) => {
                            if (word === "[options]")
                                return this.styleOptionText(word);
                            if (word === "[command]")
                                return this.styleSubcommandText(word);
                            if (word[0] === "[" || word[0] === "<")
                                return this.styleArgumentText(word);
                            return this.styleCommandText(word); // Restrict to initial words?
                        })
                        .join(" ");
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
                    // This is very like usage with lots of parts! Assume default string which is formed like:
                    //    subcommand [options] <foo> [bar]
                    return str
                        .split(" ")
                        .map((word) => {
                            if (word === "[options]")
                                return this.styleOptionText(word);
                            if (word[0] === "[" || word[0] === "<")
                                return this.styleArgumentText(word);
                            return this.styleSubcommandText(word); // Restrict to initial words?
                        })
                        .join(" ");
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
                    return Math.max(
                        helper.longestOptionTermLength(cmd, helper),
                        helper.longestGlobalOptionTermLength(cmd, helper),
                        helper.longestSubcommandTermLength(cmd, helper),
                        helper.longestArgumentTermLength(cmd, helper)
                    );
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

                    // Pad the term out to a consistent width, so descriptions are aligned.
                    const paddedTerm = term.padEnd(
                        termWidth + term.length - helper.displayWidth(term)
                    );

                    // Format the description.
                    const spacerWidth = 2; // between term and description
                    const helpWidth = this.helpWidth ?? 80; // in case prepareContext() was not called
                    const remainingWidth =
                        helpWidth - termWidth - spacerWidth - itemIndent;
                    let formattedDescription;
                    if (
                        remainingWidth < this.minWidthToWrap ||
                        helper.preformatted(description)
                    ) {
                        formattedDescription = description;
                    } else {
                        const wrappedDescription = helper.boxWrap(
                            description,
                            remainingWidth
                        );
                        formattedDescription = wrappedDescription.replace(
                            /\n/g,
                            "\n" + " ".repeat(termWidth + spacerWidth)
                        );
                    }

                    // Construct and overall indent.
                    return (
                        itemIndentStr +
                        paddedTerm +
                        " ".repeat(spacerWidth) +
                        formattedDescription.replace(
                            /\n/g,
                            `\n${itemIndentStr}`
                        )
                    );
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
                    // split up text by whitespace
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
                            // Accumulate chunks while they fit into width.
                            if (sumWidth + visibleWidth <= width) {
                                sumChunks.push(chunk);
                                sumWidth += visibleWidth;
                                return;
                            }
                            wrappedLines.push(sumChunks.join(""));

                            const nextChunk = chunk.trimStart(); // trim space at line break
                            sumChunks = [nextChunk];
                            sumWidth = this.displayWidth(nextChunk);
                        });
                        wrappedLines.push(sumChunks.join(""));
                    });

                    return wrappedLines.join("\n");
                }
            }

            /**
             * Strip style ANSI escape sequences from the string. In particular, SGR (Select Graphic Rendition) codes.
             *
             * @param {string} str
             * @returns {string}
             * @package
             */

            function stripColor(str) {
                // eslint-disable-next-line no-control-regex
                const sgrPattern = /\x1b\[\d*(;\d*)*m/g;
                return str.replace(sgrPattern, "");
            }

            exports.Help = Help;
            exports.stripColor = stripColor;

            /***/
        },

        /***/ 8637: /***/ (
            __unused_webpack_module,
            exports,
            __nccwpck_require__
        ) => {
            const { InvalidArgumentError } = __nccwpck_require__(7252);

            class Option {
                /**
                 * Initialize a new `Option` with the given `flags` and `description`.
                 *
                 * @param {string} flags
                 * @param {string} [description]
                 */

                constructor(flags, description) {
                    this.flags = flags;
                    this.description = description || "";

                    this.required = flags.includes("<"); // A value must be supplied when the option is specified.
                    this.optional = flags.includes("["); // A value is optional when the option is specified.
                    // variadic test ignores <value,...> et al which might be used to describe custom splitting of single argument
                    this.variadic = /\w\.\.\.[>\]]$/.test(flags); // The option can take multiple values.
                    this.mandatory = false; // The option must have a value after parsing, which usually means it must be specified on command line.
                    const optionFlags = splitOptionFlags(flags);
                    this.short = optionFlags.shortFlag; // May be a short flag, undefined, or even a long flag (if option has two long flags).
                    this.long = optionFlags.longFlag;
                    this.negate = false;
                    if (this.long) {
                        this.negate = this.long.startsWith("--no-");
                    }
                    this.defaultValue = undefined;
                    this.defaultValueDescription = undefined;
                    this.presetArg = undefined;
                    this.envVar = undefined;
                    this.parseArg = undefined;
                    this.hidden = false;
                    this.argChoices = undefined;
                    this.conflictsWith = [];
                    this.implied = undefined;
                    this.helpGroupHeading = undefined; // soft initialised when option added to command
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
                    if (typeof impliedOptionValues === "string") {
                        // string is not documented, but easy mistake and we can do what user probably intended.
                        newImplied = { [impliedOptionValues]: true };
                    }
                    this.implied = Object.assign(
                        this.implied || {},
                        newImplied
                    );
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
                    if (
                        previous === this.defaultValue ||
                        !Array.isArray(previous)
                    ) {
                        return [value];
                    }

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
                        if (!this.argChoices.includes(arg)) {
                            throw new InvalidArgumentError(
                                `Allowed choices are ${this.argChoices.join(", ")}.`
                            );
                        }
                        if (this.variadic) {
                            return this._collectValue(arg, previous);
                        }
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
                    if (this.long) {
                        return this.long.replace(/^--/, "");
                    }
                    return this.short.replace(/^-/, "");
                }

                /**
                 * Return option name, in a camelcase format that can be used
                 * as an object attribute key.
                 *
                 * @return {string}
                 */

                attributeName() {
                    if (this.negate) {
                        return camelcase(this.name().replace(/^no-/, ""));
                    }
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
            }

            /**
             * This class is to make it easier to work with dual options, without changing the existing
             * implementation. We support separate dual options for separate positive and negative options,
             * like `--build` and `--no-build`, which share a single option value. This works nicely for some
             * use cases, but is tricky for others where we want separate behaviours despite
             * the single shared option value.
             */
            class DualOptions {
                /**
                 * @param {Option[]} options
                 */
                constructor(options) {
                    this.positiveOptions = new Map();
                    this.negativeOptions = new Map();
                    this.dualOptions = new Set();
                    options.forEach((option) => {
                        if (option.negate) {
                            this.negativeOptions.set(
                                option.attributeName(),
                                option
                            );
                        } else {
                            this.positiveOptions.set(
                                option.attributeName(),
                                option
                            );
                        }
                    });
                    this.negativeOptions.forEach((value, key) => {
                        if (this.positiveOptions.has(key)) {
                            this.dualOptions.add(key);
                        }
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

                    // Use the value to deduce if (probably) came from the option.
                    const preset =
                        this.negativeOptions.get(optionKey).presetArg;
                    const negativeValue = preset !== undefined ? preset : false;
                    return option.negate === (negativeValue === value);
                }
            }

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
                // short flag, single dash and single character
                const shortFlagExp = /^-[^-]$/;
                // long flag, double dash and at least one character
                const longFlagExp = /^--[^-]/;

                const flagParts = flags.split(/[ |,]+/).concat("guard");
                // Normal is short and/or long.
                if (shortFlagExp.test(flagParts[0]))
                    shortFlag = flagParts.shift();
                if (longFlagExp.test(flagParts[0]))
                    longFlag = flagParts.shift();
                // Long then short. Rarely used but fine.
                if (!shortFlag && shortFlagExp.test(flagParts[0]))
                    shortFlag = flagParts.shift();
                // Allow two long flags, like '--ws, --workspace'
                // This is the supported way to have a shortish option flag.
                if (!shortFlag && longFlagExp.test(flagParts[0])) {
                    shortFlag = longFlag;
                    longFlag = flagParts.shift();
                }

                // Check for unprocessed flag. Fail noisily rather than silently ignore.
                if (flagParts[0].startsWith("-")) {
                    const unsupportedFlag = flagParts[0];
                    const baseError = `option creation failed due to '${unsupportedFlag}' in option flags '${flags}'`;
                    if (/^-[^-][^-]/.test(unsupportedFlag))
                        throw new Error(
                            `${baseError}
- a short flag is a single dash and a single character
  - either use a single dash and a single character (for a short flag)
  - or use a double dash for a long option (and can have two, like '--ws, --workspace')`
                        );
                    if (shortFlagExp.test(unsupportedFlag))
                        throw new Error(`${baseError}
- too many short flags`);
                    if (longFlagExp.test(unsupportedFlag))
                        throw new Error(`${baseError}
- too many long flags`);

                    throw new Error(`${baseError}
- unrecognised flag format`);
                }
                if (shortFlag === undefined && longFlag === undefined)
                    throw new Error(
                        `option creation failed due to no flags found in '${flags}'.`
                    );

                return { shortFlag, longFlag };
            }

            exports.Option = Option;
            exports.DualOptions = DualOptions;

            /***/
        },

        /***/ 1919: /***/ (__unused_webpack_module, exports) => {
            const maxDistance = 3;

            function editDistance(a, b) {
                // https://en.wikipedia.org/wiki/Damerau–Levenshtein_distance
                // Calculating optimal string alignment distance, no substring is edited more than once.
                // (Simple implementation.)

                // Quick early exit, return worst case.
                if (Math.abs(a.length - b.length) > maxDistance)
                    return Math.max(a.length, b.length);

                // distance between prefix substrings of a and b
                const d = [];

                // pure deletions turn a into empty string
                for (let i = 0; i <= a.length; i++) {
                    d[i] = [i];
                }
                // pure insertions turn empty string into b
                for (let j = 0; j <= b.length; j++) {
                    d[0][j] = j;
                }

                // fill matrix
                for (let j = 1; j <= b.length; j++) {
                    for (let i = 1; i <= a.length; i++) {
                        let cost = 1;
                        if (a[i - 1] === b[j - 1]) {
                            cost = 0;
                        } else {
                            cost = 1;
                        }
                        d[i][j] = Math.min(
                            d[i - 1][j] + 1, // deletion
                            d[i][j - 1] + 1, // insertion
                            d[i - 1][j - 1] + cost // substitution
                        );
                        // transposition
                        if (
                            i > 1 &&
                            j > 1 &&
                            a[i - 1] === b[j - 2] &&
                            a[i - 2] === b[j - 1]
                        ) {
                            d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
                        }
                    }
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
                // remove possible duplicates
                candidates = Array.from(new Set(candidates));

                const searchingOptions = word.startsWith("--");
                if (searchingOptions) {
                    word = word.slice(2);
                    candidates = candidates.map((candidate) =>
                        candidate.slice(2)
                    );
                }

                let similar = [];
                let bestDistance = maxDistance;
                const minSimilarity = 0.4;
                candidates.forEach((candidate) => {
                    if (candidate.length <= 1) return; // no one character guesses

                    const distance = editDistance(word, candidate);
                    const length = Math.max(word.length, candidate.length);
                    const similarity = (length - distance) / length;
                    if (similarity > minSimilarity) {
                        if (distance < bestDistance) {
                            // better edit distance, throw away previous worse matches
                            bestDistance = distance;
                            similar = [candidate];
                        } else if (distance === bestDistance) {
                            similar.push(candidate);
                        }
                    }
                });

                similar.sort((a, b) => a.localeCompare(b));
                if (searchingOptions) {
                    similar = similar.map((candidate) => `--${candidate}`);
                }

                if (similar.length > 1) {
                    return `\n(Did you mean one of ${similar.join(", ")}?)`;
                }
                if (similar.length === 1) {
                    return `\n(Did you mean ${similar[0]}?)`;
                }
                return "";
            }

            exports.suggestSimilar = suggestSimilar;

            /***/
        },

        /***/ 8713: /***/ (
            module,
            __unused_webpack_exports,
            __nccwpck_require__
        ) => {
            "use strict";

            /* eslint-disable no-var */

            var reusify = __nccwpck_require__(2522);

            function fastqueue(context, worker, _concurrency) {
                if (typeof context === "function") {
                    _concurrency = worker;
                    worker = context;
                    context = null;
                }

                if (!(_concurrency >= 1)) {
                    throw new Error(
                        "fastqueue concurrency must be equal to or greater than 1"
                    );
                }

                var cache = reusify(Task);
                var queueHead = null;
                var queueTail = null;
                var _running = 0;
                var errorHandler = null;

                var self = {
                    push: push,
                    drain: noop,
                    saturated: noop,
                    pause: pause,
                    paused: false,

                    get concurrency() {
                        return _concurrency;
                    },
                    set concurrency(value) {
                        if (!(value >= 1)) {
                            throw new Error(
                                "fastqueue concurrency must be equal to or greater than 1"
                            );
                        }
                        _concurrency = value;

                        if (self.paused) return;
                        for (; queueHead && _running < _concurrency; ) {
                            _running++;
                            release();
                        }
                    },

                    running: running,
                    resume: resume,
                    idle: idle,
                    length: length,
                    getQueue: getQueue,
                    unshift: unshift,
                    empty: noop,
                    kill: kill,
                    killAndDrain: killAndDrain,
                    error: error,
                    abort: abort
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
                    for (; queueHead && _running < _concurrency; ) {
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

                    if (_running >= _concurrency || self.paused) {
                        if (queueTail) {
                            queueTail.next = current;
                            queueTail = current;
                        } else {
                            queueHead = current;
                            queueTail = current;
                            self.saturated();
                        }
                    } else {
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

                    if (_running >= _concurrency || self.paused) {
                        if (queueHead) {
                            current.next = queueHead;
                            queueHead = current;
                        } else {
                            queueHead = current;
                            queueTail = current;
                            self.saturated();
                        }
                    } else {
                        _running++;
                        worker.call(context, current.value, current.worked);
                    }
                }

                function release(holder) {
                    if (holder) {
                        cache.release(holder);
                    }
                    var next = queueHead;
                    if (next && _running <= _concurrency) {
                        if (!self.paused) {
                            if (queueTail === queueHead) {
                                queueTail = null;
                            }
                            queueHead = next.next;
                            next.next = null;
                            worker.call(context, next.value, next.worked);
                            if (queueTail === null) {
                                self.empty();
                            }
                        } else {
                            _running--;
                        }
                    } else if (--_running === 0) {
                        self.drain();
                    }
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

                        // Reset the task state
                        current.value = null;
                        current.callback = noop;
                        current.errorHandler = null;

                        // Call error handler if present
                        if (errorHandler) {
                            errorHandler(new Error("abort"), val);
                        }

                        // Call callback with error
                        callback.call(context, new Error("abort"));

                        // Release the task back to the pool
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
                    if (self.errorHandler) {
                        errorHandler(err, val);
                    }
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
                    worker.call(this, arg).then(function (res) {
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
                    var p = new Promise(function (resolve, reject) {
                        pushCb(value, function (err, result) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(result);
                        });
                    });

                    // Let's fork the promise chain to
                    // make the error bubble up to the user but
                    // not lead to a unhandledRejection
                    p.catch(noop);

                    return p;
                }

                function unshift(value) {
                    var p = new Promise(function (resolve, reject) {
                        unshiftCb(value, function (err, result) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(result);
                        });
                    });

                    // Let's fork the promise chain to
                    // make the error bubble up to the user but
                    // not lead to a unhandledRejection
                    p.catch(noop);

                    return p;
                }

                function drained() {
                    var p = new Promise(function (resolve) {
                        process.nextTick(function () {
                            if (queue.idle()) {
                                resolve();
                            } else {
                                var previousDrain = queue.drain;
                                queue.drain = function () {
                                    if (typeof previousDrain === "function")
                                        previousDrain();
                                    resolve();
                                    queue.drain = previousDrain;
                                };
                            }
                        });
                    });

                    return p;
                }
            }

            module.exports = fastqueue;
            module.exports.promise = queueAsPromised;

            /***/
        },

        /***/ 3274: /***/ (module) => {
            "use strict";
            module.exports = /*#__PURE__*/ JSON.parse(
                '["_http_agent","_http_client","_http_common","_http_incoming","_http_outgoing","_http_server","_stream_duplex","_stream_passthrough","_stream_readable","_stream_transform","_stream_wrap","_stream_writable","_tls_common","_tls_wrap","assert","assert/strict","async_hooks","buffer","child_process","cluster","console","constants","crypto","dgram","diagnostics_channel","dns","dns/promises","domain","events","fs","fs/promises","http","http2","https","inspector","inspector/promises","module","net","os","path","path/posix","path/win32","perf_hooks","process","punycode","querystring","readline","readline/promises","repl","stream","stream/consumers","stream/promises","stream/web","string_decoder","sys","timers","timers/promises","tls","trace_events","tty","url","util","util/types","v8","vm","wasi","worker_threads","zlib","node:sea","node:sqlite","node:test","node:test/reporters"]'
            );

            /***/
        }

        /******/
    };
    /************************************************************************/
    /******/ // The module cache
    /******/ var __webpack_module_cache__ = {};
    /******/
    /******/ // The require function
    /******/ function __nccwpck_require__(moduleId) {
        /******/ // Check if module is in cache
        /******/ var cachedModule = __webpack_module_cache__[moduleId];
        /******/ if (cachedModule !== undefined) {
            /******/ return cachedModule.exports;
            /******/
        }
        /******/ // Create a new module (and put it into the cache)
        /******/ var module = (__webpack_module_cache__[moduleId] = {
            /******/ // no module.id needed
            /******/ // no module.loaded needed
            /******/ exports: {}
            /******/
        });
        /******/
        /******/ // Execute the module function
        /******/ var threw = true;
        /******/ try {
            /******/ __webpack_modules__[moduleId].call(
                module.exports,
                module,
                module.exports,
                __nccwpck_require__
            );
            /******/ threw = false;
            /******/
        } finally {
            /******/ if (threw) delete __webpack_module_cache__[moduleId];
            /******/
        }
        /******/
        /******/ // Return the exports of the module
        /******/ return module.exports;
        /******/
    }
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/compat */
    /******/
    /******/ if (typeof __nccwpck_require__ !== "undefined")
        __nccwpck_require__.ab = __dirname + "/";
    /******/
    /************************************************************************/
    var __webpack_exports__ = {};
    // This entry need to be wrapped in an IIFE because it need to be in strict mode.
    (() => {
        "use strict";
        var exports = __webpack_exports__;

        Object.defineProperty(exports, "__esModule", { value: true });
        const main_1 = __nccwpck_require__(3279);
        (0, main_1.run)()
            .then((path) => (0, main_1.notify)(path))
            .catch(() => (0, main_1.errorExit)());
    })();

    module.exports = __webpack_exports__;
    /******/
})();
