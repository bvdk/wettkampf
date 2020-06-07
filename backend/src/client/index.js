
Object.defineProperty(exports, "__esModule", { value: true });

const {
  DMMF,
  DMMFClass,
  deepGet,
  deepSet,
  makeDocument,
  Engine,
  debugLib,
  transformDocument,
  chalk,
  printStack,
  mergeBy,
  unpack,
  stripAnsi,
  parseDotenv,
  Dataloader,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  lowerCase
} = require('./runtime')

/**
 * Query Engine version: latest
 */

const path = require('path')
const fs = require('fs')

const debug = debugLib('prisma-client')

exports.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = PrismaClientRustPanicError;
exports.PrismaClientInitializationError = PrismaClientInitializationError;
exports.PrismaClientValidationError = PrismaClientValidationError;

class PrismaClientFetcher {
  constructor(prisma, enableDebug = false, hooks) {
    this.prisma = prisma;
    this.debug = enableDebug;
    this.hooks = hooks;
    this.dataloader = new Dataloader(async (requests) => {
      // TODO: More elaborate logic to only batch certain queries together
      // We should e.g. make sure, that findOne queries are batched together
      await this.prisma.connect();
      const queries = requests.map(r => String(r.document))
      debug('Requests:')
      debug(queries)
      const results = await this.prisma.engine.request(queries)
      debug('Results:')
      debug(results)
      return results
    })
  }
  async request({ document, dataPath = [], rootField, typeName, isList, callsite, collectTimestamps, clientMethod }) {
    if (this.hooks && this.hooks.beforeRequest) {
      const query = String(document);
      this.hooks.beforeRequest({ query, path: dataPath, rootField, typeName, document });
    }
    try {
      collectTimestamps && collectTimestamps.record("Pre-prismaClientConnect");
      collectTimestamps && collectTimestamps.record("Post-prismaClientConnect");
      collectTimestamps && collectTimestamps.record("Pre-engine_request");
      const result = await this.dataloader.request({ document });
      collectTimestamps && collectTimestamps.record("Post-engine_request");
      collectTimestamps && collectTimestamps.record("Pre-unpack");
      const unpackResult = this.unpack(document, result, dataPath, rootField, isList);
      collectTimestamps && collectTimestamps.record("Post-unpack");
      return unpackResult;
    } catch (e) {
      debug(e.stack);
      if (callsite) {
        const { stack } = printStack({
          callsite,
          originalMethod: clientMethod,
          onUs: e.isPanic
        });
        const message = stack + e.message;
        if (e.code) {
          throw new PrismaClientKnownRequestError(this.sanitizeMessage(message), e.code, e.meta);
        }
        if (e instanceof PrismaClientUnknownRequestError) {
          throw new PrismaClientUnknownRequestError(this.sanitizeMessage(message));
        } else if (e instanceof PrismaClientInitializationError) {
          throw new PrismaClientInitializationError(this.sanitizeMessage(message));
        } else if (e instanceof PrismaClientRustPanicError) {
          throw new PrismaClientRustPanicError(this.sanitizeMessage(message));
        }
      } else {
        if (e.code) {
          throw new PrismaClientKnownRequestError(this.sanitizeMessage(e.message), e.code, e.meta);
        }
        if (e.isPanic) {
          throw new PrismaClientRustPanicError(e.message);
        } else {
          if (e instanceof PrismaClientUnknownRequestError) {
            throw new PrismaClientUnknownRequestError(this.sanitizeMessage(message));
          } else if (e instanceof PrismaClientInitializationError) {
            throw new PrismaClientInitializationError(this.sanitizeMessage(message));
          } else if (e instanceof PrismaClientRustPanicError) {
            throw new PrismaClientRustPanicError(this.sanitizeMessage(message));
          }
        }
      }
    }
  }
  sanitizeMessage(message) {
    if (this.prisma.errorFormat && this.prisma.errorFormat !== 'pretty') {
      return stripAnsi(message);
    }
    return message;
  }
  unpack(document, data, path, rootField, isList) {
    if (data.data) {
      data = data.data
    }
    const getPath = [];
    if (rootField) {
      getPath.push(rootField);
    }
    getPath.push(...path.filter(p => p !== 'select' && p !== 'include'));
    return unpack({ document, data, path: getPath });
  }
}

class CollectTimestamps {
  constructor(startName) {
    this.records = [];
    this.start = undefined;
    this.additionalResults = {};
    this.start = { name: startName, value: process.hrtime() };
  }
  record(name) {
    this.records.push({ name, value: process.hrtime() });
  }
  elapsed(start, end) {
    const diff = [end[0] - start[0], end[1] - start[1]];
    const nanoseconds = (diff[0] * 1e9) + diff[1];
    const milliseconds = nanoseconds / 1e6;
    return milliseconds;
  }
  addResults(results) {
    Object.assign(this.additionalResults, results);
  }
  getResults() {
    const results = this.records.reduce((acc, record) => {
      const name = record.name.split('-')[1];
      if (acc[name]) {
        acc[name] = this.elapsed(acc[name], record.value);
      }
      else {
        acc[name] = record.value;
      }
      return acc;
    }, {});
    Object.assign(results, {
      total: this.elapsed(this.start.value, this.records[this.records.length - 1].value),
      ...this.additionalResults
    });
    return results;
  }
}


/**
 * Build tool annotations
 * In order to make `ncc` and `node-file-trace` happy.
**/

path.join(__dirname, 'runtime/query-engine-debian-openssl-1.1.x');

/**
 * Client
**/

// tested in getLogLevel.test.ts
function getLogLevel(log) {
    return log.reduce((acc, curr) => {
        const currentLevel = typeof curr === 'string' ? curr : curr.level;
        if (currentLevel === 'query') {
            return acc;
        }
        if (!acc) {
            return currentLevel;
        }
        if (curr === 'info' || acc === 'info') {
            // info always has precedence
            return 'info';
        }
        return currentLevel;
    }, undefined);
}
exports.getLogLevel = getLogLevel;

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js (ORM replacement)
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Events
 * const events = await prisma.event.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://github.com/prisma/prisma2/blob/master/docs/prisma-client-js/api.md).
 */
class PrismaClient {
/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js (ORM replacement)
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Events
 * const events = await prisma.event.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://github.com/prisma/prisma2/blob/master/docs/prisma-client-js/api.md).
 */
  constructor(optionsArg) {
    const options = optionsArg || {}
    const internal = options.__internal || {}

    const useDebug = internal.debug === true
    if (useDebug) {
      debugLib.enable('prisma-client')
    }

    // datamodel = datamodel without datasources + printed datasources

    const predefinedDatasources = []

    const inputDatasources = Object.entries(options.datasources || {}).map(([name, url]) => ({ name, url }))
    const datasources = mergeBy(predefinedDatasources, inputDatasources, source => source.name)

    const engineConfig = internal.engine || {}

    if (options.errorFormat) {
      this.errorFormat = options.errorFormat
    } else if (process.env.NODE_ENV === 'production') {
      this.errorFormat = 'minimal'
    } else if (process.env.NO_COLOR) {
      this.errorFormat = 'colorless'
    } else {
      this.errorFormat = 'pretty'
    }

    this.measurePerformance = internal.measurePerformance || false

    const envFile = this.readEnv()

    this.engineConfig = {
      cwd: engineConfig.cwd || path.resolve(__dirname, "../.."),
      debug: useDebug,
      datamodelPath: path.resolve(__dirname, 'schema.prisma'),
      prismaPath: engineConfig.binaryPath || undefined,
      datasources,
      generator: {"name":"ts","provider":"prisma-client-js","output":"/home/marcel/projects/bvdk/wettkampf/backend/src/client","binaryTargets":[],"config":{}},
      showColors: this.errorFormat === 'pretty',
      logLevel: options.log && getLogLevel(options.log),
      logQueries: options.log && Boolean(options.log.find(o => typeof o === 'string' ? o === 'query' : o.level === 'query')),
      env: envFile
    }

    debug({ engineConfig: this.engineConfig })

    this.engine = new Engine(this.engineConfig)

    this.dmmf = new DMMFClass(dmmf)

    this.fetcher = new PrismaClientFetcher(this, false, internal.hooks)

    if (options.log) {
      for (const log of options.log) {
        const level = typeof log === 'string' ? log : log.emit === 'stdout' ? log.level : null
        if (level) {
          this.on(level, event => {
            const colorMap = {
              query: 'blue',
              info: 'cyan',
              warn: 'yellow'
            }
            console.error(chalk[colorMap[level]](`prisma:${level}`.padEnd(13)) + (event.message || event.query))
          })
        }
      }
    }
  }

  /**
   * @private
   */
  readEnv() {
    const dotEnvPath = path.resolve(path.resolve(__dirname, "../.."), '.env')

    if (fs.existsSync(dotEnvPath)) {
      return parseDotenv(fs.readFileSync(dotEnvPath, 'utf-8'))
    }

    return {}
  }

  on(eventType, callback) {
    this.engine.on(eventType, event => {
      const fields = event.fields
      if (eventType === 'query') {
        callback({
          timestamp: event.timestamp,
          query: fields.query,
          params: fields.params,
          duration: fields.duration_ms,
          target: event.target
        })
      } else { // warn or info events
        callback({
          timestamp: event.timestamp,
          message: fields.message,
          target: event.target
        })
      }
    })
  }
  /**
   * Connect with the database
   */
  async connect() {
    if (this.disconnectionPromise) {
      debug('awaiting disconnection promise')
      await this.disconnectionPromise
    } else {
      debug('disconnection promise doesnt exist')
    }
    if (this.connectionPromise) {
      return this.connectionPromise
    }
    this.connectionPromise = this.engine.start()
    return this.connectionPromise
  }
  /**
   * @private
   */
  async runDisconnect() {
    debug('disconnectionPromise: stopping engine')
    await this.engine.stop()
    delete this.connectionPromise
    this.engine = new Engine(this.engineConfig)
    delete this.disconnectionPromise
  }
  /**
   * Disconnect from the database
   */
  async disconnect() {
    if (!this.disconnectionPromise) {
      this.disconnectionPromise = this.runDisconnect() 
    }
    return this.disconnectionPromise
  }
  /**
   * Makes a raw query
   */ 
  async raw(stringOrTemplateStringsArray) {
    let query = ''
    
    if (Array.isArray(stringOrTemplateStringsArray)) {
      if (stringOrTemplateStringsArray.length !== 1) {
        throw new Error('The prisma.raw method must be used like this prisma.raw`SELECT * FROM Posts` without template literal variables.')
      }
      // Called with prisma.raw``
      query = stringOrTemplateStringsArray[0]
    } else {
      query = stringOrTemplateStringsArray 
    }

    const document = makeDocument({
      dmmf: this.dmmf,
      rootField: "executeRaw",
      rootTypeName: 'mutation',
      select: {
        query
      }
    })

    document.validate({ query }, false, 'raw', this.errorFormat)
    
    return this.fetcher.request({ document, rootField: 'executeRaw', typeName: 'raw', isList: false})
  }

  /**
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Events
   * const events = await prisma.event.findMany()
   * ```
   */
  get event() {
    return EventDelegate(this.dmmf, this.fetcher, this.errorFormat, this.measurePerformance)
  }
  /**
   * `prisma.athlete`: Exposes CRUD operations for the **Athlete** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Athletes
   * const athletes = await prisma.athlete.findMany()
   * ```
   */
  get athlete() {
    return AthleteDelegate(this.dmmf, this.fetcher, this.errorFormat, this.measurePerformance)
  }
  /**
   * `prisma.slot`: Exposes CRUD operations for the **Slot** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Slots
   * const slots = await prisma.slot.findMany()
   * ```
   */
  get slot() {
    return SlotDelegate(this.dmmf, this.fetcher, this.errorFormat, this.measurePerformance)
  }
  /**
   * `prisma.athleteGroup`: Exposes CRUD operations for the **AthleteGroup** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AthleteGroups
   * const athleteGroups = await prisma.athleteGroup.findMany()
   * ```
   */
  get athleteGroup() {
    return AthleteGroupDelegate(this.dmmf, this.fetcher, this.errorFormat, this.measurePerformance)
  }
  /**
   * `prisma.attempt`: Exposes CRUD operations for the **Attempt** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Attempts
   * const attempts = await prisma.attempt.findMany()
   * ```
   */
  get attempt() {
    return AttemptDelegate(this.dmmf, this.fetcher, this.errorFormat, this.measurePerformance)
  }
  /**
   * `prisma.weightClass`: Exposes CRUD operations for the **WeightClass** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more WeightClasses
   * const weightClasses = await prisma.weightClass.findMany()
   * ```
   */
  get weightClass() {
    return WeightClassDelegate(this.dmmf, this.fetcher, this.errorFormat, this.measurePerformance)
  }
  /**
   * `prisma.ageClass`: Exposes CRUD operations for the **AgeClass** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AgeClasses
   * const ageClasses = await prisma.ageClass.findMany()
   * ```
   */
  get ageClass() {
    return AgeClassDelegate(this.dmmf, this.fetcher, this.errorFormat, this.measurePerformance)
  }
  /**
   * `prisma.official`: Exposes CRUD operations for the **Official** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Officials
   * const officials = await prisma.official.findMany()
   * ```
   */
  get official() {
    return OfficialDelegate(this.dmmf, this.fetcher, this.errorFormat, this.measurePerformance)
  }
  /**
   * `prisma.officialSlot`: Exposes CRUD operations for the **OfficialSlot** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more OfficialSlots
   * const officialSlots = await prisma.officialSlot.findMany()
   * ```
   */
  get officialSlot() {
    return OfficialSlotDelegate(this.dmmf, this.fetcher, this.errorFormat, this.measurePerformance)
  }
  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   */
  get user() {
    return UserDelegate(this.dmmf, this.fetcher, this.errorFormat, this.measurePerformance)
  }
}
exports.PrismaClient = PrismaClient



/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.OrderByArg = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Discipline = makeEnum({
  POWERLIFTING: 'POWERLIFTING',
  SQUAT: 'SQUAT',
  BENCHPRESS: 'BENCHPRESS',
  DEADLIFT: 'DEADLIFT'
});

exports.ContestType = makeEnum({
  SINGLE: 'SINGLE',
  TEAM: 'TEAM'
});

exports.Gender = makeEnum({
  MALE: 'MALE',
  FEMALE: 'FEMALE'
});

exports.Position = makeEnum({
  SEITENKAMPFRICHTER: 'SEITENKAMPFRICHTER'
});

exports.Role = makeEnum({
  ADMIN: 'ADMIN',
  USER: 'USER',
  GUEST: 'GUEST'
});


function EventDelegate(dmmf, fetcher, errorFormat, measurePerformance) {
  const Event = {} 
  Event.findOne = (args) => args && args.select ? new EventClient(
    dmmf,
    fetcher,
    'query',
    'findOneEvent',
    'events.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new EventClient(
    dmmf,
    fetcher,
    'query',
    'findOneEvent',
    'events.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Event.findMany = (args) => new EventClient(
    dmmf,
    fetcher,
    'query',
    'findManyEvent',
    'events.findMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Event.create = (args) => args && args.select ? new EventClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneEvent',
    'events.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new EventClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneEvent',
    'events.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Event.delete = (args) => args && args.select ? new EventClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneEvent',
    'events.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new EventClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneEvent',
    'events.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Event.update = (args) => args && args.select ? new EventClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneEvent',
    'events.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new EventClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneEvent',
    'events.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Event.deleteMany = (args) => new EventClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteManyEvent',
    'events.deleteMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Event.updateMany = (args) => new EventClient(
    dmmf,
    fetcher,
    'mutation',
    'updateManyEvent',
    'events.updateMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Event.upsert = (args) => args && args.select ? new EventClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneEvent',
    'events.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new EventClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneEvent',
    'events.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Event.count = () => new EventClient(dmmf, fetcher, 'query', 'aggregateEvent', 'events.count', {}, ['count'], errorFormat)
  return Event
}

class EventClient {
  constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _dataPath, _errorFormat, _measurePerformance, _isList) {
    this._dmmf = _dmmf;
    this._fetcher = _fetcher;
    this._queryType = _queryType;
    this._rootField = _rootField;
    this._clientMethod = _clientMethod;
    this._args = _args;
    this._dataPath = _dataPath;
    this._errorFormat = _errorFormat;
    this._measurePerformance = _measurePerformance;
    this._isList = _isList;
    if (this._measurePerformance) {
      // Timestamps for performance checks
      this._collectTimestamps = new CollectTimestamps("PrismaClient");
    }
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production' && this._errorFormat !== 'minimal') {
      const error = new Error();
      if (error && error.stack) {
        const stack = error.stack;
        this._callsite = stack;
      }
    }
  }

  athlete(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'athlete']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = true
    return new AthleteClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  slot(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'slot']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = true
    return new SlotClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  athleteGroup(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'athleteGroup']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = true
    return new AthleteGroupClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  official(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'official']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = true
    return new OfficialClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  get _document() {
    const { _rootField: rootField } = this
    this._collectTimestamps && this._collectTimestamps.record("Pre-makeDocument")
    const document = makeDocument({
      dmmf: this._dmmf,
      rootField,
      rootTypeName: this._queryType,
      select: this._args
    })
    this._collectTimestamps && this._collectTimestamps.record("Post-makeDocument")
    try {
      this._collectTimestamps && this._collectTimestamps.record("Pre-document.validate")
      document.validate(this._args, false, this._clientMethod, this._errorFormat)
      this._collectTimestamps && this._collectTimestamps.record("Post-document.validate")
    } catch (e) {
      const x = e
      if (this._errorFormat !== 'minimal' && x.render) {
        if (this._callsite) {
          e.message = x.render(this._callsite)
        }
      }
      throw e
    }
    this._collectTimestamps && this._collectTimestamps.record("Pre-transformDocument")
    const transformedDocument = transformDocument(document)
    this._collectTimestamps && this._collectTimestamps.record("Post-transformDocument")
    return transformedDocument
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then(onfulfilled, onrejected) {
    if (!this._requestPromise){
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Event',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.then(onfulfilled, onrejected)
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch(onrejected) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Event',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.catch(onrejected)
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Event',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.finally(onfinally)
  }
}

exports.EventClient = EventClient

function AthleteDelegate(dmmf, fetcher, errorFormat, measurePerformance) {
  const Athlete = {} 
  Athlete.findOne = (args) => args && args.select ? new AthleteClient(
    dmmf,
    fetcher,
    'query',
    'findOneAthlete',
    'athletes.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AthleteClient(
    dmmf,
    fetcher,
    'query',
    'findOneAthlete',
    'athletes.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Athlete.findMany = (args) => new AthleteClient(
    dmmf,
    fetcher,
    'query',
    'findManyAthlete',
    'athletes.findMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Athlete.create = (args) => args && args.select ? new AthleteClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneAthlete',
    'athletes.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AthleteClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneAthlete',
    'athletes.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Athlete.delete = (args) => args && args.select ? new AthleteClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneAthlete',
    'athletes.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AthleteClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneAthlete',
    'athletes.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Athlete.update = (args) => args && args.select ? new AthleteClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneAthlete',
    'athletes.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AthleteClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneAthlete',
    'athletes.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Athlete.deleteMany = (args) => new AthleteClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteManyAthlete',
    'athletes.deleteMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Athlete.updateMany = (args) => new AthleteClient(
    dmmf,
    fetcher,
    'mutation',
    'updateManyAthlete',
    'athletes.updateMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Athlete.upsert = (args) => args && args.select ? new AthleteClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneAthlete',
    'athletes.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AthleteClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneAthlete',
    'athletes.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Athlete.count = () => new AthleteClient(dmmf, fetcher, 'query', 'aggregateAthlete', 'athletes.count', {}, ['count'], errorFormat)
  return Athlete
}

class AthleteClient {
  constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _dataPath, _errorFormat, _measurePerformance, _isList) {
    this._dmmf = _dmmf;
    this._fetcher = _fetcher;
    this._queryType = _queryType;
    this._rootField = _rootField;
    this._clientMethod = _clientMethod;
    this._args = _args;
    this._dataPath = _dataPath;
    this._errorFormat = _errorFormat;
    this._measurePerformance = _measurePerformance;
    this._isList = _isList;
    if (this._measurePerformance) {
      // Timestamps for performance checks
      this._collectTimestamps = new CollectTimestamps("PrismaClient");
    }
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production' && this._errorFormat !== 'minimal') {
      const error = new Error();
      if (error && error.stack) {
        const stack = error.stack;
        this._callsite = stack;
      }
    }
  }

  event(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'event']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = false
    return new EventClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  weightClass(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'weightClass']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = false
    return new WeightClassClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  ageClass(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'ageClass']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = false
    return new AgeClassClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  attempt(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'attempt']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = true
    return new AttemptClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  get _document() {
    const { _rootField: rootField } = this
    this._collectTimestamps && this._collectTimestamps.record("Pre-makeDocument")
    const document = makeDocument({
      dmmf: this._dmmf,
      rootField,
      rootTypeName: this._queryType,
      select: this._args
    })
    this._collectTimestamps && this._collectTimestamps.record("Post-makeDocument")
    try {
      this._collectTimestamps && this._collectTimestamps.record("Pre-document.validate")
      document.validate(this._args, false, this._clientMethod, this._errorFormat)
      this._collectTimestamps && this._collectTimestamps.record("Post-document.validate")
    } catch (e) {
      const x = e
      if (this._errorFormat !== 'minimal' && x.render) {
        if (this._callsite) {
          e.message = x.render(this._callsite)
        }
      }
      throw e
    }
    this._collectTimestamps && this._collectTimestamps.record("Pre-transformDocument")
    const transformedDocument = transformDocument(document)
    this._collectTimestamps && this._collectTimestamps.record("Post-transformDocument")
    return transformedDocument
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then(onfulfilled, onrejected) {
    if (!this._requestPromise){
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Athlete',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.then(onfulfilled, onrejected)
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch(onrejected) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Athlete',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.catch(onrejected)
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Athlete',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.finally(onfinally)
  }
}

exports.AthleteClient = AthleteClient

function SlotDelegate(dmmf, fetcher, errorFormat, measurePerformance) {
  const Slot = {} 
  Slot.findOne = (args) => args && args.select ? new SlotClient(
    dmmf,
    fetcher,
    'query',
    'findOneSlot',
    'slots.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new SlotClient(
    dmmf,
    fetcher,
    'query',
    'findOneSlot',
    'slots.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Slot.findMany = (args) => new SlotClient(
    dmmf,
    fetcher,
    'query',
    'findManySlot',
    'slots.findMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Slot.create = (args) => args && args.select ? new SlotClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneSlot',
    'slots.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new SlotClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneSlot',
    'slots.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Slot.delete = (args) => args && args.select ? new SlotClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneSlot',
    'slots.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new SlotClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneSlot',
    'slots.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Slot.update = (args) => args && args.select ? new SlotClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneSlot',
    'slots.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new SlotClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneSlot',
    'slots.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Slot.deleteMany = (args) => new SlotClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteManySlot',
    'slots.deleteMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Slot.updateMany = (args) => new SlotClient(
    dmmf,
    fetcher,
    'mutation',
    'updateManySlot',
    'slots.updateMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Slot.upsert = (args) => args && args.select ? new SlotClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneSlot',
    'slots.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new SlotClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneSlot',
    'slots.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Slot.count = () => new SlotClient(dmmf, fetcher, 'query', 'aggregateSlot', 'slots.count', {}, ['count'], errorFormat)
  return Slot
}

class SlotClient {
  constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _dataPath, _errorFormat, _measurePerformance, _isList) {
    this._dmmf = _dmmf;
    this._fetcher = _fetcher;
    this._queryType = _queryType;
    this._rootField = _rootField;
    this._clientMethod = _clientMethod;
    this._args = _args;
    this._dataPath = _dataPath;
    this._errorFormat = _errorFormat;
    this._measurePerformance = _measurePerformance;
    this._isList = _isList;
    if (this._measurePerformance) {
      // Timestamps for performance checks
      this._collectTimestamps = new CollectTimestamps("PrismaClient");
    }
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production' && this._errorFormat !== 'minimal') {
      const error = new Error();
      if (error && error.stack) {
        const stack = error.stack;
        this._callsite = stack;
      }
    }
  }

  event(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'event']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = false
    return new EventClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  athleteGroup(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'athleteGroup']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = true
    return new AthleteGroupClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  officialSlot(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'officialSlot']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = true
    return new OfficialSlotClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  get _document() {
    const { _rootField: rootField } = this
    this._collectTimestamps && this._collectTimestamps.record("Pre-makeDocument")
    const document = makeDocument({
      dmmf: this._dmmf,
      rootField,
      rootTypeName: this._queryType,
      select: this._args
    })
    this._collectTimestamps && this._collectTimestamps.record("Post-makeDocument")
    try {
      this._collectTimestamps && this._collectTimestamps.record("Pre-document.validate")
      document.validate(this._args, false, this._clientMethod, this._errorFormat)
      this._collectTimestamps && this._collectTimestamps.record("Post-document.validate")
    } catch (e) {
      const x = e
      if (this._errorFormat !== 'minimal' && x.render) {
        if (this._callsite) {
          e.message = x.render(this._callsite)
        }
      }
      throw e
    }
    this._collectTimestamps && this._collectTimestamps.record("Pre-transformDocument")
    const transformedDocument = transformDocument(document)
    this._collectTimestamps && this._collectTimestamps.record("Post-transformDocument")
    return transformedDocument
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then(onfulfilled, onrejected) {
    if (!this._requestPromise){
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Slot',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.then(onfulfilled, onrejected)
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch(onrejected) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Slot',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.catch(onrejected)
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Slot',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.finally(onfinally)
  }
}

exports.SlotClient = SlotClient

function AthleteGroupDelegate(dmmf, fetcher, errorFormat, measurePerformance) {
  const AthleteGroup = {} 
  AthleteGroup.findOne = (args) => args && args.select ? new AthleteGroupClient(
    dmmf,
    fetcher,
    'query',
    'findOneAthleteGroup',
    'athleteGroups.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AthleteGroupClient(
    dmmf,
    fetcher,
    'query',
    'findOneAthleteGroup',
    'athleteGroups.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  AthleteGroup.findMany = (args) => new AthleteGroupClient(
    dmmf,
    fetcher,
    'query',
    'findManyAthleteGroup',
    'athleteGroups.findMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  AthleteGroup.create = (args) => args && args.select ? new AthleteGroupClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneAthleteGroup',
    'athleteGroups.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AthleteGroupClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneAthleteGroup',
    'athleteGroups.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  AthleteGroup.delete = (args) => args && args.select ? new AthleteGroupClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneAthleteGroup',
    'athleteGroups.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AthleteGroupClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneAthleteGroup',
    'athleteGroups.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  AthleteGroup.update = (args) => args && args.select ? new AthleteGroupClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneAthleteGroup',
    'athleteGroups.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AthleteGroupClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneAthleteGroup',
    'athleteGroups.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  AthleteGroup.deleteMany = (args) => new AthleteGroupClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteManyAthleteGroup',
    'athleteGroups.deleteMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  AthleteGroup.updateMany = (args) => new AthleteGroupClient(
    dmmf,
    fetcher,
    'mutation',
    'updateManyAthleteGroup',
    'athleteGroups.updateMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  AthleteGroup.upsert = (args) => args && args.select ? new AthleteGroupClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneAthleteGroup',
    'athleteGroups.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AthleteGroupClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneAthleteGroup',
    'athleteGroups.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  AthleteGroup.count = () => new AthleteGroupClient(dmmf, fetcher, 'query', 'aggregateAthleteGroup', 'athleteGroups.count', {}, ['count'], errorFormat)
  return AthleteGroup
}

class AthleteGroupClient {
  constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _dataPath, _errorFormat, _measurePerformance, _isList) {
    this._dmmf = _dmmf;
    this._fetcher = _fetcher;
    this._queryType = _queryType;
    this._rootField = _rootField;
    this._clientMethod = _clientMethod;
    this._args = _args;
    this._dataPath = _dataPath;
    this._errorFormat = _errorFormat;
    this._measurePerformance = _measurePerformance;
    this._isList = _isList;
    if (this._measurePerformance) {
      // Timestamps for performance checks
      this._collectTimestamps = new CollectTimestamps("PrismaClient");
    }
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production' && this._errorFormat !== 'minimal') {
      const error = new Error();
      if (error && error.stack) {
        const stack = error.stack;
        this._callsite = stack;
      }
    }
  }

  event(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'event']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = false
    return new EventClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  slot(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'slot']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = false
    return new SlotClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  get _document() {
    const { _rootField: rootField } = this
    this._collectTimestamps && this._collectTimestamps.record("Pre-makeDocument")
    const document = makeDocument({
      dmmf: this._dmmf,
      rootField,
      rootTypeName: this._queryType,
      select: this._args
    })
    this._collectTimestamps && this._collectTimestamps.record("Post-makeDocument")
    try {
      this._collectTimestamps && this._collectTimestamps.record("Pre-document.validate")
      document.validate(this._args, false, this._clientMethod, this._errorFormat)
      this._collectTimestamps && this._collectTimestamps.record("Post-document.validate")
    } catch (e) {
      const x = e
      if (this._errorFormat !== 'minimal' && x.render) {
        if (this._callsite) {
          e.message = x.render(this._callsite)
        }
      }
      throw e
    }
    this._collectTimestamps && this._collectTimestamps.record("Pre-transformDocument")
    const transformedDocument = transformDocument(document)
    this._collectTimestamps && this._collectTimestamps.record("Post-transformDocument")
    return transformedDocument
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then(onfulfilled, onrejected) {
    if (!this._requestPromise){
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'AthleteGroup',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.then(onfulfilled, onrejected)
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch(onrejected) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'AthleteGroup',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.catch(onrejected)
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'AthleteGroup',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.finally(onfinally)
  }
}

exports.AthleteGroupClient = AthleteGroupClient

function AttemptDelegate(dmmf, fetcher, errorFormat, measurePerformance) {
  const Attempt = {} 
  Attempt.findOne = (args) => args && args.select ? new AttemptClient(
    dmmf,
    fetcher,
    'query',
    'findOneAttempt',
    'attempts.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AttemptClient(
    dmmf,
    fetcher,
    'query',
    'findOneAttempt',
    'attempts.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Attempt.findMany = (args) => new AttemptClient(
    dmmf,
    fetcher,
    'query',
    'findManyAttempt',
    'attempts.findMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Attempt.create = (args) => args && args.select ? new AttemptClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneAttempt',
    'attempts.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AttemptClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneAttempt',
    'attempts.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Attempt.delete = (args) => args && args.select ? new AttemptClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneAttempt',
    'attempts.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AttemptClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneAttempt',
    'attempts.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Attempt.update = (args) => args && args.select ? new AttemptClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneAttempt',
    'attempts.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AttemptClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneAttempt',
    'attempts.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Attempt.deleteMany = (args) => new AttemptClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteManyAttempt',
    'attempts.deleteMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Attempt.updateMany = (args) => new AttemptClient(
    dmmf,
    fetcher,
    'mutation',
    'updateManyAttempt',
    'attempts.updateMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Attempt.upsert = (args) => args && args.select ? new AttemptClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneAttempt',
    'attempts.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AttemptClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneAttempt',
    'attempts.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Attempt.count = () => new AttemptClient(dmmf, fetcher, 'query', 'aggregateAttempt', 'attempts.count', {}, ['count'], errorFormat)
  return Attempt
}

class AttemptClient {
  constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _dataPath, _errorFormat, _measurePerformance, _isList) {
    this._dmmf = _dmmf;
    this._fetcher = _fetcher;
    this._queryType = _queryType;
    this._rootField = _rootField;
    this._clientMethod = _clientMethod;
    this._args = _args;
    this._dataPath = _dataPath;
    this._errorFormat = _errorFormat;
    this._measurePerformance = _measurePerformance;
    this._isList = _isList;
    if (this._measurePerformance) {
      // Timestamps for performance checks
      this._collectTimestamps = new CollectTimestamps("PrismaClient");
    }
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production' && this._errorFormat !== 'minimal') {
      const error = new Error();
      if (error && error.stack) {
        const stack = error.stack;
        this._callsite = stack;
      }
    }
  }

  athlete(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'athlete']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = false
    return new AthleteClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  get _document() {
    const { _rootField: rootField } = this
    this._collectTimestamps && this._collectTimestamps.record("Pre-makeDocument")
    const document = makeDocument({
      dmmf: this._dmmf,
      rootField,
      rootTypeName: this._queryType,
      select: this._args
    })
    this._collectTimestamps && this._collectTimestamps.record("Post-makeDocument")
    try {
      this._collectTimestamps && this._collectTimestamps.record("Pre-document.validate")
      document.validate(this._args, false, this._clientMethod, this._errorFormat)
      this._collectTimestamps && this._collectTimestamps.record("Post-document.validate")
    } catch (e) {
      const x = e
      if (this._errorFormat !== 'minimal' && x.render) {
        if (this._callsite) {
          e.message = x.render(this._callsite)
        }
      }
      throw e
    }
    this._collectTimestamps && this._collectTimestamps.record("Pre-transformDocument")
    const transformedDocument = transformDocument(document)
    this._collectTimestamps && this._collectTimestamps.record("Post-transformDocument")
    return transformedDocument
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then(onfulfilled, onrejected) {
    if (!this._requestPromise){
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Attempt',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.then(onfulfilled, onrejected)
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch(onrejected) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Attempt',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.catch(onrejected)
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Attempt',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.finally(onfinally)
  }
}

exports.AttemptClient = AttemptClient

function WeightClassDelegate(dmmf, fetcher, errorFormat, measurePerformance) {
  const WeightClass = {} 
  WeightClass.findOne = (args) => args && args.select ? new WeightClassClient(
    dmmf,
    fetcher,
    'query',
    'findOneWeightClass',
    'weightClasses.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new WeightClassClient(
    dmmf,
    fetcher,
    'query',
    'findOneWeightClass',
    'weightClasses.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  WeightClass.findMany = (args) => new WeightClassClient(
    dmmf,
    fetcher,
    'query',
    'findManyWeightClass',
    'weightClasses.findMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  WeightClass.create = (args) => args && args.select ? new WeightClassClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneWeightClass',
    'weightClasses.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new WeightClassClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneWeightClass',
    'weightClasses.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  WeightClass.delete = (args) => args && args.select ? new WeightClassClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneWeightClass',
    'weightClasses.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new WeightClassClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneWeightClass',
    'weightClasses.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  WeightClass.update = (args) => args && args.select ? new WeightClassClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneWeightClass',
    'weightClasses.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new WeightClassClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneWeightClass',
    'weightClasses.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  WeightClass.deleteMany = (args) => new WeightClassClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteManyWeightClass',
    'weightClasses.deleteMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  WeightClass.updateMany = (args) => new WeightClassClient(
    dmmf,
    fetcher,
    'mutation',
    'updateManyWeightClass',
    'weightClasses.updateMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  WeightClass.upsert = (args) => args && args.select ? new WeightClassClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneWeightClass',
    'weightClasses.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new WeightClassClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneWeightClass',
    'weightClasses.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  WeightClass.count = () => new WeightClassClient(dmmf, fetcher, 'query', 'aggregateWeightClass', 'weightClasses.count', {}, ['count'], errorFormat)
  return WeightClass
}

class WeightClassClient {
  constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _dataPath, _errorFormat, _measurePerformance, _isList) {
    this._dmmf = _dmmf;
    this._fetcher = _fetcher;
    this._queryType = _queryType;
    this._rootField = _rootField;
    this._clientMethod = _clientMethod;
    this._args = _args;
    this._dataPath = _dataPath;
    this._errorFormat = _errorFormat;
    this._measurePerformance = _measurePerformance;
    this._isList = _isList;
    if (this._measurePerformance) {
      // Timestamps for performance checks
      this._collectTimestamps = new CollectTimestamps("PrismaClient");
    }
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production' && this._errorFormat !== 'minimal') {
      const error = new Error();
      if (error && error.stack) {
        const stack = error.stack;
        this._callsite = stack;
      }
    }
  }

  athlete(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'athlete']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = true
    return new AthleteClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  get _document() {
    const { _rootField: rootField } = this
    this._collectTimestamps && this._collectTimestamps.record("Pre-makeDocument")
    const document = makeDocument({
      dmmf: this._dmmf,
      rootField,
      rootTypeName: this._queryType,
      select: this._args
    })
    this._collectTimestamps && this._collectTimestamps.record("Post-makeDocument")
    try {
      this._collectTimestamps && this._collectTimestamps.record("Pre-document.validate")
      document.validate(this._args, false, this._clientMethod, this._errorFormat)
      this._collectTimestamps && this._collectTimestamps.record("Post-document.validate")
    } catch (e) {
      const x = e
      if (this._errorFormat !== 'minimal' && x.render) {
        if (this._callsite) {
          e.message = x.render(this._callsite)
        }
      }
      throw e
    }
    this._collectTimestamps && this._collectTimestamps.record("Pre-transformDocument")
    const transformedDocument = transformDocument(document)
    this._collectTimestamps && this._collectTimestamps.record("Post-transformDocument")
    return transformedDocument
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then(onfulfilled, onrejected) {
    if (!this._requestPromise){
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'WeightClass',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.then(onfulfilled, onrejected)
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch(onrejected) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'WeightClass',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.catch(onrejected)
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'WeightClass',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.finally(onfinally)
  }
}

exports.WeightClassClient = WeightClassClient

function AgeClassDelegate(dmmf, fetcher, errorFormat, measurePerformance) {
  const AgeClass = {} 
  AgeClass.findOne = (args) => args && args.select ? new AgeClassClient(
    dmmf,
    fetcher,
    'query',
    'findOneAgeClass',
    'ageClasses.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AgeClassClient(
    dmmf,
    fetcher,
    'query',
    'findOneAgeClass',
    'ageClasses.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  AgeClass.findMany = (args) => new AgeClassClient(
    dmmf,
    fetcher,
    'query',
    'findManyAgeClass',
    'ageClasses.findMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  AgeClass.create = (args) => args && args.select ? new AgeClassClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneAgeClass',
    'ageClasses.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AgeClassClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneAgeClass',
    'ageClasses.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  AgeClass.delete = (args) => args && args.select ? new AgeClassClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneAgeClass',
    'ageClasses.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AgeClassClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneAgeClass',
    'ageClasses.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  AgeClass.update = (args) => args && args.select ? new AgeClassClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneAgeClass',
    'ageClasses.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AgeClassClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneAgeClass',
    'ageClasses.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  AgeClass.deleteMany = (args) => new AgeClassClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteManyAgeClass',
    'ageClasses.deleteMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  AgeClass.updateMany = (args) => new AgeClassClient(
    dmmf,
    fetcher,
    'mutation',
    'updateManyAgeClass',
    'ageClasses.updateMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  AgeClass.upsert = (args) => args && args.select ? new AgeClassClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneAgeClass',
    'ageClasses.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new AgeClassClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneAgeClass',
    'ageClasses.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  AgeClass.count = () => new AgeClassClient(dmmf, fetcher, 'query', 'aggregateAgeClass', 'ageClasses.count', {}, ['count'], errorFormat)
  return AgeClass
}

class AgeClassClient {
  constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _dataPath, _errorFormat, _measurePerformance, _isList) {
    this._dmmf = _dmmf;
    this._fetcher = _fetcher;
    this._queryType = _queryType;
    this._rootField = _rootField;
    this._clientMethod = _clientMethod;
    this._args = _args;
    this._dataPath = _dataPath;
    this._errorFormat = _errorFormat;
    this._measurePerformance = _measurePerformance;
    this._isList = _isList;
    if (this._measurePerformance) {
      // Timestamps for performance checks
      this._collectTimestamps = new CollectTimestamps("PrismaClient");
    }
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production' && this._errorFormat !== 'minimal') {
      const error = new Error();
      if (error && error.stack) {
        const stack = error.stack;
        this._callsite = stack;
      }
    }
  }

  athlete(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'athlete']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = true
    return new AthleteClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  get _document() {
    const { _rootField: rootField } = this
    this._collectTimestamps && this._collectTimestamps.record("Pre-makeDocument")
    const document = makeDocument({
      dmmf: this._dmmf,
      rootField,
      rootTypeName: this._queryType,
      select: this._args
    })
    this._collectTimestamps && this._collectTimestamps.record("Post-makeDocument")
    try {
      this._collectTimestamps && this._collectTimestamps.record("Pre-document.validate")
      document.validate(this._args, false, this._clientMethod, this._errorFormat)
      this._collectTimestamps && this._collectTimestamps.record("Post-document.validate")
    } catch (e) {
      const x = e
      if (this._errorFormat !== 'minimal' && x.render) {
        if (this._callsite) {
          e.message = x.render(this._callsite)
        }
      }
      throw e
    }
    this._collectTimestamps && this._collectTimestamps.record("Pre-transformDocument")
    const transformedDocument = transformDocument(document)
    this._collectTimestamps && this._collectTimestamps.record("Post-transformDocument")
    return transformedDocument
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then(onfulfilled, onrejected) {
    if (!this._requestPromise){
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'AgeClass',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.then(onfulfilled, onrejected)
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch(onrejected) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'AgeClass',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.catch(onrejected)
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'AgeClass',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.finally(onfinally)
  }
}

exports.AgeClassClient = AgeClassClient

function OfficialDelegate(dmmf, fetcher, errorFormat, measurePerformance) {
  const Official = {} 
  Official.findOne = (args) => args && args.select ? new OfficialClient(
    dmmf,
    fetcher,
    'query',
    'findOneOfficial',
    'officials.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new OfficialClient(
    dmmf,
    fetcher,
    'query',
    'findOneOfficial',
    'officials.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Official.findMany = (args) => new OfficialClient(
    dmmf,
    fetcher,
    'query',
    'findManyOfficial',
    'officials.findMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Official.create = (args) => args && args.select ? new OfficialClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneOfficial',
    'officials.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new OfficialClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneOfficial',
    'officials.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Official.delete = (args) => args && args.select ? new OfficialClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneOfficial',
    'officials.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new OfficialClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneOfficial',
    'officials.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Official.update = (args) => args && args.select ? new OfficialClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneOfficial',
    'officials.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new OfficialClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneOfficial',
    'officials.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Official.deleteMany = (args) => new OfficialClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteManyOfficial',
    'officials.deleteMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Official.updateMany = (args) => new OfficialClient(
    dmmf,
    fetcher,
    'mutation',
    'updateManyOfficial',
    'officials.updateMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Official.upsert = (args) => args && args.select ? new OfficialClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneOfficial',
    'officials.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new OfficialClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneOfficial',
    'officials.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  Official.count = () => new OfficialClient(dmmf, fetcher, 'query', 'aggregateOfficial', 'officials.count', {}, ['count'], errorFormat)
  return Official
}

class OfficialClient {
  constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _dataPath, _errorFormat, _measurePerformance, _isList) {
    this._dmmf = _dmmf;
    this._fetcher = _fetcher;
    this._queryType = _queryType;
    this._rootField = _rootField;
    this._clientMethod = _clientMethod;
    this._args = _args;
    this._dataPath = _dataPath;
    this._errorFormat = _errorFormat;
    this._measurePerformance = _measurePerformance;
    this._isList = _isList;
    if (this._measurePerformance) {
      // Timestamps for performance checks
      this._collectTimestamps = new CollectTimestamps("PrismaClient");
    }
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production' && this._errorFormat !== 'minimal') {
      const error = new Error();
      if (error && error.stack) {
        const stack = error.stack;
        this._callsite = stack;
      }
    }
  }

  event(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'event']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = false
    return new EventClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  officialSlot(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'officialSlot']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = true
    return new OfficialSlotClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  get _document() {
    const { _rootField: rootField } = this
    this._collectTimestamps && this._collectTimestamps.record("Pre-makeDocument")
    const document = makeDocument({
      dmmf: this._dmmf,
      rootField,
      rootTypeName: this._queryType,
      select: this._args
    })
    this._collectTimestamps && this._collectTimestamps.record("Post-makeDocument")
    try {
      this._collectTimestamps && this._collectTimestamps.record("Pre-document.validate")
      document.validate(this._args, false, this._clientMethod, this._errorFormat)
      this._collectTimestamps && this._collectTimestamps.record("Post-document.validate")
    } catch (e) {
      const x = e
      if (this._errorFormat !== 'minimal' && x.render) {
        if (this._callsite) {
          e.message = x.render(this._callsite)
        }
      }
      throw e
    }
    this._collectTimestamps && this._collectTimestamps.record("Pre-transformDocument")
    const transformedDocument = transformDocument(document)
    this._collectTimestamps && this._collectTimestamps.record("Post-transformDocument")
    return transformedDocument
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then(onfulfilled, onrejected) {
    if (!this._requestPromise){
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Official',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.then(onfulfilled, onrejected)
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch(onrejected) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Official',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.catch(onrejected)
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'Official',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.finally(onfinally)
  }
}

exports.OfficialClient = OfficialClient

function OfficialSlotDelegate(dmmf, fetcher, errorFormat, measurePerformance) {
  const OfficialSlot = {} 
  OfficialSlot.findOne = (args) => args && args.select ? new OfficialSlotClient(
    dmmf,
    fetcher,
    'query',
    'findOneOfficialSlot',
    'officialSlots.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new OfficialSlotClient(
    dmmf,
    fetcher,
    'query',
    'findOneOfficialSlot',
    'officialSlots.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  OfficialSlot.findMany = (args) => new OfficialSlotClient(
    dmmf,
    fetcher,
    'query',
    'findManyOfficialSlot',
    'officialSlots.findMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  OfficialSlot.create = (args) => args && args.select ? new OfficialSlotClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneOfficialSlot',
    'officialSlots.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new OfficialSlotClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneOfficialSlot',
    'officialSlots.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  OfficialSlot.delete = (args) => args && args.select ? new OfficialSlotClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneOfficialSlot',
    'officialSlots.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new OfficialSlotClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneOfficialSlot',
    'officialSlots.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  OfficialSlot.update = (args) => args && args.select ? new OfficialSlotClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneOfficialSlot',
    'officialSlots.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new OfficialSlotClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneOfficialSlot',
    'officialSlots.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  OfficialSlot.deleteMany = (args) => new OfficialSlotClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteManyOfficialSlot',
    'officialSlots.deleteMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  OfficialSlot.updateMany = (args) => new OfficialSlotClient(
    dmmf,
    fetcher,
    'mutation',
    'updateManyOfficialSlot',
    'officialSlots.updateMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  OfficialSlot.upsert = (args) => args && args.select ? new OfficialSlotClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneOfficialSlot',
    'officialSlots.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new OfficialSlotClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneOfficialSlot',
    'officialSlots.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  OfficialSlot.count = () => new OfficialSlotClient(dmmf, fetcher, 'query', 'aggregateOfficialSlot', 'officialSlots.count', {}, ['count'], errorFormat)
  return OfficialSlot
}

class OfficialSlotClient {
  constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _dataPath, _errorFormat, _measurePerformance, _isList) {
    this._dmmf = _dmmf;
    this._fetcher = _fetcher;
    this._queryType = _queryType;
    this._rootField = _rootField;
    this._clientMethod = _clientMethod;
    this._args = _args;
    this._dataPath = _dataPath;
    this._errorFormat = _errorFormat;
    this._measurePerformance = _measurePerformance;
    this._isList = _isList;
    if (this._measurePerformance) {
      // Timestamps for performance checks
      this._collectTimestamps = new CollectTimestamps("PrismaClient");
    }
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production' && this._errorFormat !== 'minimal') {
      const error = new Error();
      if (error && error.stack) {
        const stack = error.stack;
        this._callsite = stack;
      }
    }
  }

  official(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'official']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = false
    return new OfficialClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  slot(args) {
    const prefix = this._dataPath.includes('select') ? 'select' : this._dataPath.includes('include') ? 'include' : 'select'
    const dataPath = [...this._dataPath, prefix, 'slot']
    const newArgs = deepSet(this._args, dataPath, args || true)
    this._isList = false
    return new SlotClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, dataPath, this._errorFormat, this._measurePerformance, this._isList)
  }

  get _document() {
    const { _rootField: rootField } = this
    this._collectTimestamps && this._collectTimestamps.record("Pre-makeDocument")
    const document = makeDocument({
      dmmf: this._dmmf,
      rootField,
      rootTypeName: this._queryType,
      select: this._args
    })
    this._collectTimestamps && this._collectTimestamps.record("Post-makeDocument")
    try {
      this._collectTimestamps && this._collectTimestamps.record("Pre-document.validate")
      document.validate(this._args, false, this._clientMethod, this._errorFormat)
      this._collectTimestamps && this._collectTimestamps.record("Post-document.validate")
    } catch (e) {
      const x = e
      if (this._errorFormat !== 'minimal' && x.render) {
        if (this._callsite) {
          e.message = x.render(this._callsite)
        }
      }
      throw e
    }
    this._collectTimestamps && this._collectTimestamps.record("Pre-transformDocument")
    const transformedDocument = transformDocument(document)
    this._collectTimestamps && this._collectTimestamps.record("Post-transformDocument")
    return transformedDocument
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then(onfulfilled, onrejected) {
    if (!this._requestPromise){
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'OfficialSlot',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.then(onfulfilled, onrejected)
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch(onrejected) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'OfficialSlot',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.catch(onrejected)
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'OfficialSlot',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.finally(onfinally)
  }
}

exports.OfficialSlotClient = OfficialSlotClient

function UserDelegate(dmmf, fetcher, errorFormat, measurePerformance) {
  const User = {} 
  User.findOne = (args) => args && args.select ? new UserClient(
    dmmf,
    fetcher,
    'query',
    'findOneUser',
    'users.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new UserClient(
    dmmf,
    fetcher,
    'query',
    'findOneUser',
    'users.findOne',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  User.findMany = (args) => new UserClient(
    dmmf,
    fetcher,
    'query',
    'findManyUser',
    'users.findMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  User.create = (args) => args && args.select ? new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneUser',
    'users.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'createOneUser',
    'users.create',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  User.delete = (args) => args && args.select ? new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneUser',
    'users.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteOneUser',
    'users.delete',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  User.update = (args) => args && args.select ? new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneUser',
    'users.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'updateOneUser',
    'users.update',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  User.deleteMany = (args) => new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'deleteManyUser',
    'users.deleteMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  User.updateMany = (args) => new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'updateManyUser',
    'users.updateMany',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  User.upsert = (args) => args && args.select ? new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneUser',
    'users.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  ) : new UserClient(
    dmmf,
    fetcher,
    'mutation',
    'upsertOneUser',
    'users.upsert',
    args || {},
    [],
    errorFormat,
    measurePerformance
  )
  User.count = () => new UserClient(dmmf, fetcher, 'query', 'aggregateUser', 'users.count', {}, ['count'], errorFormat)
  return User
}

class UserClient {
  constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _dataPath, _errorFormat, _measurePerformance, _isList) {
    this._dmmf = _dmmf;
    this._fetcher = _fetcher;
    this._queryType = _queryType;
    this._rootField = _rootField;
    this._clientMethod = _clientMethod;
    this._args = _args;
    this._dataPath = _dataPath;
    this._errorFormat = _errorFormat;
    this._measurePerformance = _measurePerformance;
    this._isList = _isList;
    if (this._measurePerformance) {
      // Timestamps for performance checks
      this._collectTimestamps = new CollectTimestamps("PrismaClient");
    }
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production' && this._errorFormat !== 'minimal') {
      const error = new Error();
      if (error && error.stack) {
        const stack = error.stack;
        this._callsite = stack;
      }
    }
  }


  get _document() {
    const { _rootField: rootField } = this
    this._collectTimestamps && this._collectTimestamps.record("Pre-makeDocument")
    const document = makeDocument({
      dmmf: this._dmmf,
      rootField,
      rootTypeName: this._queryType,
      select: this._args
    })
    this._collectTimestamps && this._collectTimestamps.record("Post-makeDocument")
    try {
      this._collectTimestamps && this._collectTimestamps.record("Pre-document.validate")
      document.validate(this._args, false, this._clientMethod, this._errorFormat)
      this._collectTimestamps && this._collectTimestamps.record("Post-document.validate")
    } catch (e) {
      const x = e
      if (this._errorFormat !== 'minimal' && x.render) {
        if (this._callsite) {
          e.message = x.render(this._callsite)
        }
      }
      throw e
    }
    this._collectTimestamps && this._collectTimestamps.record("Pre-transformDocument")
    const transformedDocument = transformDocument(document)
    this._collectTimestamps && this._collectTimestamps.record("Post-transformDocument")
    return transformedDocument
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then(onfulfilled, onrejected) {
    if (!this._requestPromise){
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'User',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.then(onfulfilled, onrejected)
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch(onrejected) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'User',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.catch(onrejected)
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally) {
    if (!this._requestPromise) {
      this._requestPromise = this._fetcher.request({
        document: this._document,
        dataPath: this._dataPath,
        rootField: this._rootField,
        typeName: 'User',
        isList: this._isList,
        callsite: this._callsite,
        collectTimestamps: this._collectTimestamps,
        clientMethod: this._clientMethod
      })
    }
    return this._requestPromise.finally(onfinally)
  }
}

exports.UserClient = UserClient


/**
 * DMMF
 */
const dmmfString = '{"datamodel":{"enums":[{"name":"Discipline","values":[{"name":"POWERLIFTING","dbName":null},{"name":"SQUAT","dbName":null},{"name":"BENCHPRESS","dbName":null},{"name":"DEADLIFT","dbName":null}],"dbName":null},{"name":"ContestType","values":[{"name":"SINGLE","dbName":null},{"name":"TEAM","dbName":null}],"dbName":null},{"name":"Gender","values":[{"name":"MALE","dbName":null},{"name":"FEMALE","dbName":null}],"dbName":null},{"name":"Role","values":[{"name":"ADMIN","dbName":null},{"name":"USER","dbName":null},{"name":"GUEST","dbName":null}],"dbName":null},{"name":"Position","values":[{"name":"SEITENKAMPFRICHTER","dbName":null}],"dbName":null}],"models":[{"name":"Event","isEmbedded":false,"dbName":null,"fields":[{"name":"id","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"type":"String","default":{"name":"uuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"name","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"discipline","kind":"enum","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Discipline","isGenerated":false,"isUpdatedAt":false},{"name":"contestType","kind":"enum","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"ContestType","isGenerated":false,"isUpdatedAt":false},{"name":"athlete","kind":"object","dbNames":[],"isList":true,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Athlete","relationName":"AthleteToEvent","relationToFields":[],"relationOnDelete":"NONE","isGenerated":true,"isUpdatedAt":false},{"name":"slot","kind":"object","dbNames":[],"isList":true,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Slot","relationName":"EventToSlot","relationToFields":[],"relationOnDelete":"NONE","isGenerated":true,"isUpdatedAt":false},{"name":"athleteGroup","kind":"object","dbNames":[],"isList":true,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"type":"AthleteGroup","relationName":"AthleteGroupToEvent","relationToFields":[],"relationOnDelete":"NONE","isGenerated":true,"isUpdatedAt":false},{"name":"official","kind":"object","dbNames":[],"isList":true,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Official","relationName":"EventToOfficial","relationToFields":[],"relationOnDelete":"NONE","isGenerated":true,"isUpdatedAt":false}],"isGenerated":false,"idFields":[],"uniqueFields":[]},{"name":"Athlete","isEmbedded":false,"dbName":null,"fields":[{"name":"id","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"type":"String","default":{"name":"uuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"raw","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Boolean","isGenerated":false,"isUpdatedAt":false},{"name":"athleteNumber","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"firstName","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"lastName","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"gender","kind":"enum","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Gender","isGenerated":false,"isUpdatedAt":false},{"name":"club","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"birthday","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"total","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"norm","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Boolean","isGenerated":false,"isUpdatedAt":false},{"name":"lateRegistration","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Boolean","isGenerated":false,"isUpdatedAt":false},{"name":"price","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"bodyWeight","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"wilks","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"dots","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"los","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"KB1","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"KB2","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"KB3","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"BD1","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"BD2","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"BD3","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"KH1","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"KH2","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"KH3","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"points","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"place","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"location","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"nextAttemptsSortKeys","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"importId","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"event","kind":"object","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Event","relationName":"AthleteToEvent","relationToFields":["id"],"relationOnDelete":"NONE","isGenerated":false,"isUpdatedAt":false},{"name":"eventId","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"weightClass","kind":"object","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"WeightClass","relationName":"AthleteToWeightClass","relationToFields":["id"],"relationOnDelete":"NONE","isGenerated":false,"isUpdatedAt":false},{"name":"weightClassId","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"ageClass","kind":"object","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"AgeClass","relationName":"AgeClassToAthlete","relationToFields":["id"],"relationOnDelete":"NONE","isGenerated":false,"isUpdatedAt":false},{"name":"ageClassId","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"resultClassId","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"attempt","kind":"object","dbNames":[],"isList":true,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Attempt","relationName":"AthleteToAttempt","relationToFields":[],"relationOnDelete":"NONE","isGenerated":true,"isUpdatedAt":false}],"isGenerated":false,"idFields":[],"uniqueFields":[]},{"name":"Slot","isEmbedded":false,"dbName":null,"fields":[{"name":"id","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"type":"String","default":{"name":"uuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"name","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"event","kind":"object","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Event","relationName":"EventToSlot","relationToFields":["id"],"relationOnDelete":"NONE","isGenerated":false,"isUpdatedAt":false},{"name":"eventId","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"athleteGroup","kind":"object","dbNames":[],"isList":true,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"type":"AthleteGroup","relationName":"AthleteGroupToSlot","relationToFields":[],"relationOnDelete":"NONE","isGenerated":true,"isUpdatedAt":false},{"name":"officialSlot","kind":"object","dbNames":[],"isList":true,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"type":"OfficialSlot","relationName":"OfficialSlotToSlot","relationToFields":[],"relationOnDelete":"NONE","isGenerated":true,"isUpdatedAt":false}],"isGenerated":false,"idFields":[],"uniqueFields":[]},{"name":"AthleteGroup","isEmbedded":false,"dbName":null,"fields":[{"name":"id","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"type":"String","default":{"name":"uuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"name","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"event","kind":"object","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Event","relationName":"AthleteGroupToEvent","relationToFields":["id"],"relationOnDelete":"NONE","isGenerated":false,"isUpdatedAt":false},{"name":"eventId","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"slot","kind":"object","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Slot","relationName":"AthleteGroupToSlot","relationToFields":["id"],"relationOnDelete":"NONE","isGenerated":false,"isUpdatedAt":false},{"name":"slotId","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"type":"String","isGenerated":false,"isUpdatedAt":false}],"isGenerated":false,"idFields":[],"uniqueFields":[]},{"name":"Attempt","isEmbedded":false,"dbName":null,"fields":[{"name":"id","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"type":"String","default":{"name":"uuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"discipline","kind":"enum","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Discipline","isGenerated":false,"isUpdatedAt":false},{"name":"date","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"index","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"weight","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"raw","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Boolean","isGenerated":false,"isUpdatedAt":false},{"name":"valid","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Boolean","isGenerated":false,"isUpdatedAt":false},{"name":"done","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Boolean","isGenerated":false,"isUpdatedAt":false},{"name":"resign","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Boolean","isGenerated":false,"isUpdatedAt":false},{"name":"athlete","kind":"object","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Athlete","relationName":"AthleteToAttempt","relationToFields":["id"],"relationOnDelete":"NONE","isGenerated":false,"isUpdatedAt":false},{"name":"athleteId","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"type":"String","isGenerated":false,"isUpdatedAt":false}],"isGenerated":false,"idFields":[],"uniqueFields":[]},{"name":"WeightClass","isEmbedded":false,"dbName":null,"fields":[{"name":"id","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"type":"String","default":{"name":"uuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"name","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"gender","kind":"enum","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Gender","isGenerated":false,"isUpdatedAt":false},{"name":"min","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"max","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"athlete","kind":"object","dbNames":[],"isList":true,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Athlete","relationName":"AthleteToWeightClass","relationToFields":[],"relationOnDelete":"NONE","isGenerated":true,"isUpdatedAt":false}],"isGenerated":false,"idFields":[],"uniqueFields":[]},{"name":"AgeClass","isEmbedded":false,"dbName":null,"fields":[{"name":"id","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"type":"String","default":{"name":"uuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"name","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"sortId","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"athlete","kind":"object","dbNames":[],"isList":true,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Athlete","relationName":"AgeClassToAthlete","relationToFields":[],"relationOnDelete":"NONE","isGenerated":true,"isUpdatedAt":false}],"isGenerated":false,"idFields":[],"uniqueFields":[]},{"name":"Official","isEmbedded":false,"dbName":null,"fields":[{"name":"id","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"type":"String","default":{"name":"uuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"officalNumber","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"lastName","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"firstName","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"club","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"license","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"position","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"location","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"importId","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"event","kind":"object","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Event","relationName":"EventToOfficial","relationToFields":["id"],"relationOnDelete":"NONE","isGenerated":false,"isUpdatedAt":false},{"name":"eventId","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"officialSlot","kind":"object","dbNames":[],"isList":true,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"type":"OfficialSlot","relationName":"OfficialToOfficialSlot","relationToFields":[],"relationOnDelete":"NONE","isGenerated":true,"isUpdatedAt":false}],"isGenerated":false,"idFields":[],"uniqueFields":[]},{"name":"OfficialSlot","isEmbedded":false,"dbName":null,"fields":[{"name":"id","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"type":"String","default":{"name":"uuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"position","kind":"enum","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Position","isGenerated":false,"isUpdatedAt":false},{"name":"official","kind":"object","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Official","relationName":"OfficialToOfficialSlot","relationToFields":["id"],"relationOnDelete":"NONE","isGenerated":false,"isUpdatedAt":false},{"name":"officialId","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"slot","kind":"object","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Slot","relationName":"OfficialSlotToSlot","relationToFields":["id"],"relationOnDelete":"NONE","isGenerated":false,"isUpdatedAt":false},{"name":"slotId","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"type":"String","isGenerated":false,"isUpdatedAt":false}],"isGenerated":false,"idFields":[],"uniqueFields":[]},{"name":"User","isEmbedded":false,"dbName":null,"fields":[{"name":"id","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"type":"String","default":{"name":"uuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"role","kind":"enum","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"Role","default":"GUEST","isGenerated":false,"isUpdatedAt":false},{"name":"username","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"passwordHash","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"salt","kind":"scalar","dbNames":[],"isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"type":"String","isGenerated":false,"isUpdatedAt":false}],"isGenerated":false,"idFields":[],"uniqueFields":[]}]},"mappings":[{"model":"Event","plural":"events","findOne":"findOneEvent","findMany":"findManyEvent","create":"createOneEvent","delete":"deleteOneEvent","update":"updateOneEvent","deleteMany":"deleteManyEvent","updateMany":"updateManyEvent","upsert":"upsertOneEvent","aggregate":"aggregateEvent"},{"model":"Athlete","plural":"athletes","findOne":"findOneAthlete","findMany":"findManyAthlete","create":"createOneAthlete","delete":"deleteOneAthlete","update":"updateOneAthlete","deleteMany":"deleteManyAthlete","updateMany":"updateManyAthlete","upsert":"upsertOneAthlete","aggregate":"aggregateAthlete"},{"model":"Slot","plural":"slots","findOne":"findOneSlot","findMany":"findManySlot","create":"createOneSlot","delete":"deleteOneSlot","update":"updateOneSlot","deleteMany":"deleteManySlot","updateMany":"updateManySlot","upsert":"upsertOneSlot","aggregate":"aggregateSlot"},{"model":"AthleteGroup","plural":"athleteGroups","findOne":"findOneAthleteGroup","findMany":"findManyAthleteGroup","create":"createOneAthleteGroup","delete":"deleteOneAthleteGroup","update":"updateOneAthleteGroup","deleteMany":"deleteManyAthleteGroup","updateMany":"updateManyAthleteGroup","upsert":"upsertOneAthleteGroup","aggregate":"aggregateAthleteGroup"},{"model":"Attempt","plural":"attempts","findOne":"findOneAttempt","findMany":"findManyAttempt","create":"createOneAttempt","delete":"deleteOneAttempt","update":"updateOneAttempt","deleteMany":"deleteManyAttempt","updateMany":"updateManyAttempt","upsert":"upsertOneAttempt","aggregate":"aggregateAttempt"},{"model":"WeightClass","plural":"weightClasses","findOne":"findOneWeightClass","findMany":"findManyWeightClass","create":"createOneWeightClass","delete":"deleteOneWeightClass","update":"updateOneWeightClass","deleteMany":"deleteManyWeightClass","updateMany":"updateManyWeightClass","upsert":"upsertOneWeightClass","aggregate":"aggregateWeightClass"},{"model":"AgeClass","plural":"ageClasses","findOne":"findOneAgeClass","findMany":"findManyAgeClass","create":"createOneAgeClass","delete":"deleteOneAgeClass","update":"updateOneAgeClass","deleteMany":"deleteManyAgeClass","updateMany":"updateManyAgeClass","upsert":"upsertOneAgeClass","aggregate":"aggregateAgeClass"},{"model":"Official","plural":"officials","findOne":"findOneOfficial","findMany":"findManyOfficial","create":"createOneOfficial","delete":"deleteOneOfficial","update":"updateOneOfficial","deleteMany":"deleteManyOfficial","updateMany":"updateManyOfficial","upsert":"upsertOneOfficial","aggregate":"aggregateOfficial"},{"model":"OfficialSlot","plural":"officialSlots","findOne":"findOneOfficialSlot","findMany":"findManyOfficialSlot","create":"createOneOfficialSlot","delete":"deleteOneOfficialSlot","update":"updateOneOfficialSlot","deleteMany":"deleteManyOfficialSlot","updateMany":"updateManyOfficialSlot","upsert":"upsertOneOfficialSlot","aggregate":"aggregateOfficialSlot"},{"model":"User","plural":"users","findOne":"findOneUser","findMany":"findManyUser","create":"createOneUser","delete":"deleteOneUser","update":"updateOneUser","deleteMany":"deleteManyUser","updateMany":"updateManyUser","upsert":"upsertOneUser","aggregate":"aggregateUser"}],"schema":{"enums":[{"name":"OrderByArg","values":["asc","desc"]},{"name":"Discipline","values":["POWERLIFTING","SQUAT","BENCHPRESS","DEADLIFT"]},{"name":"ContestType","values":["SINGLE","TEAM"]},{"name":"Gender","values":["MALE","FEMALE"]},{"name":"Position","values":["SEITENKAMPFRICHTER"]},{"name":"Role","values":["ADMIN","USER","GUEST"]}],"outputTypes":[{"name":"WeightClass","fields":[{"name":"id","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"createdAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"updatedAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"name","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"gender","args":[],"outputType":{"type":"Gender","kind":"enum","isRequired":true,"isList":false}},{"name":"min","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"max","args":[],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}},{"name":"athlete","args":[{"name":"where","inputType":[{"type":"AthleteWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"AthleteOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Athlete","kind":"object","isRequired":false,"isList":true}}]},{"name":"AgeClass","fields":[{"name":"id","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"createdAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"updatedAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"name","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"sortId","args":[],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}},{"name":"athlete","args":[{"name":"where","inputType":[{"type":"AthleteWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"AthleteOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Athlete","kind":"object","isRequired":false,"isList":true}}]},{"name":"Attempt","fields":[{"name":"id","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"createdAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"updatedAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"discipline","args":[],"outputType":{"type":"Discipline","kind":"enum","isRequired":true,"isList":false}},{"name":"date","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"index","args":[],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}},{"name":"weight","args":[],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}},{"name":"raw","args":[],"outputType":{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}},{"name":"valid","args":[],"outputType":{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}},{"name":"done","args":[],"outputType":{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}},{"name":"resign","args":[],"outputType":{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}},{"name":"athlete","args":[],"outputType":{"type":"Athlete","kind":"object","isRequired":true,"isList":false}},{"name":"athleteId","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"Athlete","fields":[{"name":"id","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"createdAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"updatedAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"raw","args":[],"outputType":{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}},{"name":"athleteNumber","args":[],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}},{"name":"firstName","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"lastName","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"gender","args":[],"outputType":{"type":"Gender","kind":"enum","isRequired":true,"isList":false}},{"name":"club","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"birthday","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"total","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"norm","args":[],"outputType":{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}},{"name":"lateRegistration","args":[],"outputType":{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}},{"name":"price","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"bodyWeight","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"wilks","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"dots","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"los","args":[],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}},{"name":"KB1","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"KB2","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"KB3","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"BD1","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"BD2","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"BD3","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"KH1","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"KH2","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"KH3","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"points","args":[],"outputType":{"type":"Float","kind":"scalar","isRequired":true,"isList":false}},{"name":"place","args":[],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}},{"name":"location","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"nextAttemptsSortKeys","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"importId","args":[],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}},{"name":"event","args":[],"outputType":{"type":"Event","kind":"object","isRequired":true,"isList":false}},{"name":"eventId","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"weightClass","args":[],"outputType":{"type":"WeightClass","kind":"object","isRequired":true,"isList":false}},{"name":"weightClassId","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"ageClass","args":[],"outputType":{"type":"AgeClass","kind":"object","isRequired":true,"isList":false}},{"name":"ageClassId","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"resultClassId","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"attempt","args":[{"name":"where","inputType":[{"type":"AttemptWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"AttemptOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"AttemptWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"AttemptWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Attempt","kind":"object","isRequired":false,"isList":true}}]},{"name":"AthleteGroup","fields":[{"name":"id","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"createdAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"updatedAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"name","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"event","args":[],"outputType":{"type":"Event","kind":"object","isRequired":true,"isList":false}},{"name":"eventId","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"slot","args":[],"outputType":{"type":"Slot","kind":"object","isRequired":true,"isList":false}},{"name":"slotId","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"Official","fields":[{"name":"id","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"createdAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"updatedAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"officalNumber","args":[],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}},{"name":"lastName","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"firstName","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"club","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"license","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"position","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"location","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"importId","args":[],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}},{"name":"event","args":[],"outputType":{"type":"Event","kind":"object","isRequired":true,"isList":false}},{"name":"eventId","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"officialSlot","args":[{"name":"where","inputType":[{"type":"OfficialSlotWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"OfficialSlotOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"OfficialSlot","kind":"object","isRequired":false,"isList":true}}]},{"name":"OfficialSlot","fields":[{"name":"id","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"createdAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"updatedAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"position","args":[],"outputType":{"type":"Position","kind":"enum","isRequired":true,"isList":false}},{"name":"official","args":[],"outputType":{"type":"Official","kind":"object","isRequired":true,"isList":false}},{"name":"officialId","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"slot","args":[],"outputType":{"type":"Slot","kind":"object","isRequired":true,"isList":false}},{"name":"slotId","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"Slot","fields":[{"name":"id","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"createdAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"updatedAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"name","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"event","args":[],"outputType":{"type":"Event","kind":"object","isRequired":true,"isList":false}},{"name":"eventId","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"athleteGroup","args":[{"name":"where","inputType":[{"type":"AthleteGroupWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"AthleteGroupOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"AthleteGroup","kind":"object","isRequired":false,"isList":true}},{"name":"officialSlot","args":[{"name":"where","inputType":[{"type":"OfficialSlotWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"OfficialSlotOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"OfficialSlot","kind":"object","isRequired":false,"isList":true}}]},{"name":"Event","fields":[{"name":"id","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"createdAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"updatedAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"name","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"discipline","args":[],"outputType":{"type":"Discipline","kind":"enum","isRequired":true,"isList":false}},{"name":"contestType","args":[],"outputType":{"type":"ContestType","kind":"enum","isRequired":true,"isList":false}},{"name":"athlete","args":[{"name":"where","inputType":[{"type":"AthleteWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"AthleteOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Athlete","kind":"object","isRequired":false,"isList":true}},{"name":"slot","args":[{"name":"where","inputType":[{"type":"SlotWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"SlotOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Slot","kind":"object","isRequired":false,"isList":true}},{"name":"athleteGroup","args":[{"name":"where","inputType":[{"type":"AthleteGroupWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"AthleteGroupOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"AthleteGroup","kind":"object","isRequired":false,"isList":true}},{"name":"official","args":[{"name":"where","inputType":[{"type":"OfficialWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"OfficialOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Official","kind":"object","isRequired":false,"isList":true}}]},{"name":"AggregateEvent","fields":[{"name":"count","args":[{"name":"where","inputType":[{"type":"EventWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"EventOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"EventWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"EventWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"AggregateAthlete","fields":[{"name":"count","args":[{"name":"where","inputType":[{"type":"AthleteWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"AthleteOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"AggregateSlot","fields":[{"name":"count","args":[{"name":"where","inputType":[{"type":"SlotWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"SlotOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"AggregateAthleteGroup","fields":[{"name":"count","args":[{"name":"where","inputType":[{"type":"AthleteGroupWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"AthleteGroupOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"AggregateAttempt","fields":[{"name":"count","args":[{"name":"where","inputType":[{"type":"AttemptWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"AttemptOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"AttemptWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"AttemptWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"AggregateWeightClass","fields":[{"name":"count","args":[{"name":"where","inputType":[{"type":"WeightClassWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"WeightClassOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"WeightClassWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"WeightClassWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"AggregateAgeClass","fields":[{"name":"count","args":[{"name":"where","inputType":[{"type":"AgeClassWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"AgeClassOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"AgeClassWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"AgeClassWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"AggregateOfficial","fields":[{"name":"count","args":[{"name":"where","inputType":[{"type":"OfficialWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"OfficialOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"AggregateOfficialSlot","fields":[{"name":"count","args":[{"name":"where","inputType":[{"type":"OfficialSlotWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"OfficialSlotOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"User","fields":[{"name":"id","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"createdAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"updatedAt","args":[],"outputType":{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}},{"name":"role","args":[],"outputType":{"type":"Role","kind":"enum","isRequired":true,"isList":false}},{"name":"username","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"passwordHash","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}},{"name":"salt","args":[],"outputType":{"type":"String","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"AggregateUser","fields":[{"name":"count","args":[{"name":"where","inputType":[{"type":"UserWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"UserOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"UserWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"UserWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"Query","fields":[{"name":"findManyEvent","args":[{"name":"where","inputType":[{"type":"EventWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"EventOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"EventWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"EventWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Event","kind":"object","isRequired":true,"isList":true}},{"name":"aggregateEvent","args":[],"outputType":{"type":"AggregateEvent","kind":"object","isRequired":true,"isList":false}},{"name":"findOneEvent","args":[{"name":"where","inputType":[{"type":"EventWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Event","kind":"object","isRequired":false,"isList":false}},{"name":"findManyAthlete","args":[{"name":"where","inputType":[{"type":"AthleteWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"AthleteOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Athlete","kind":"object","isRequired":true,"isList":true}},{"name":"aggregateAthlete","args":[],"outputType":{"type":"AggregateAthlete","kind":"object","isRequired":true,"isList":false}},{"name":"findOneAthlete","args":[{"name":"where","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Athlete","kind":"object","isRequired":false,"isList":false}},{"name":"findManySlot","args":[{"name":"where","inputType":[{"type":"SlotWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"SlotOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Slot","kind":"object","isRequired":true,"isList":true}},{"name":"aggregateSlot","args":[],"outputType":{"type":"AggregateSlot","kind":"object","isRequired":true,"isList":false}},{"name":"findOneSlot","args":[{"name":"where","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Slot","kind":"object","isRequired":false,"isList":false}},{"name":"findManyAthleteGroup","args":[{"name":"where","inputType":[{"type":"AthleteGroupWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"AthleteGroupOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"AthleteGroup","kind":"object","isRequired":true,"isList":true}},{"name":"aggregateAthleteGroup","args":[],"outputType":{"type":"AggregateAthleteGroup","kind":"object","isRequired":true,"isList":false}},{"name":"findOneAthleteGroup","args":[{"name":"where","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"AthleteGroup","kind":"object","isRequired":false,"isList":false}},{"name":"findManyAttempt","args":[{"name":"where","inputType":[{"type":"AttemptWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"AttemptOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"AttemptWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"AttemptWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Attempt","kind":"object","isRequired":true,"isList":true}},{"name":"aggregateAttempt","args":[],"outputType":{"type":"AggregateAttempt","kind":"object","isRequired":true,"isList":false}},{"name":"findOneAttempt","args":[{"name":"where","inputType":[{"type":"AttemptWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Attempt","kind":"object","isRequired":false,"isList":false}},{"name":"findManyWeightClass","args":[{"name":"where","inputType":[{"type":"WeightClassWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"WeightClassOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"WeightClassWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"WeightClassWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"WeightClass","kind":"object","isRequired":true,"isList":true}},{"name":"aggregateWeightClass","args":[],"outputType":{"type":"AggregateWeightClass","kind":"object","isRequired":true,"isList":false}},{"name":"findOneWeightClass","args":[{"name":"where","inputType":[{"type":"WeightClassWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"WeightClass","kind":"object","isRequired":false,"isList":false}},{"name":"findManyAgeClass","args":[{"name":"where","inputType":[{"type":"AgeClassWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"AgeClassOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"AgeClassWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"AgeClassWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"AgeClass","kind":"object","isRequired":true,"isList":true}},{"name":"aggregateAgeClass","args":[],"outputType":{"type":"AggregateAgeClass","kind":"object","isRequired":true,"isList":false}},{"name":"findOneAgeClass","args":[{"name":"where","inputType":[{"type":"AgeClassWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"AgeClass","kind":"object","isRequired":false,"isList":false}},{"name":"findManyOfficial","args":[{"name":"where","inputType":[{"type":"OfficialWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"OfficialOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Official","kind":"object","isRequired":true,"isList":true}},{"name":"aggregateOfficial","args":[],"outputType":{"type":"AggregateOfficial","kind":"object","isRequired":true,"isList":false}},{"name":"findOneOfficial","args":[{"name":"where","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Official","kind":"object","isRequired":false,"isList":false}},{"name":"findManyOfficialSlot","args":[{"name":"where","inputType":[{"type":"OfficialSlotWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"OfficialSlotOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"OfficialSlot","kind":"object","isRequired":true,"isList":true}},{"name":"aggregateOfficialSlot","args":[],"outputType":{"type":"AggregateOfficialSlot","kind":"object","isRequired":true,"isList":false}},{"name":"findOneOfficialSlot","args":[{"name":"where","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"OfficialSlot","kind":"object","isRequired":false,"isList":false}},{"name":"findManyUser","args":[{"name":"where","inputType":[{"type":"UserWhereInput","kind":"object","isRequired":false,"isList":false}]},{"name":"orderBy","inputType":[{"isList":false,"isRequired":false,"type":"UserOrderByInput","kind":"object"}]},{"name":"skip","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"after","inputType":[{"type":"UserWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"before","inputType":[{"type":"UserWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"first","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"last","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"User","kind":"object","isRequired":true,"isList":true}},{"name":"aggregateUser","args":[],"outputType":{"type":"AggregateUser","kind":"object","isRequired":true,"isList":false}},{"name":"findOneUser","args":[{"name":"where","inputType":[{"type":"UserWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"User","kind":"object","isRequired":false,"isList":false}}]},{"name":"BatchPayload","fields":[{"name":"count","args":[],"outputType":{"type":"Int","kind":"scalar","isRequired":true,"isList":false}}]},{"name":"Mutation","fields":[{"name":"createOneEvent","args":[{"name":"data","inputType":[{"type":"EventCreateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Event","kind":"object","isRequired":true,"isList":false}},{"name":"deleteOneEvent","args":[{"name":"where","inputType":[{"type":"EventWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Event","kind":"object","isRequired":false,"isList":false}},{"name":"updateOneEvent","args":[{"name":"data","inputType":[{"type":"EventUpdateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"EventWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Event","kind":"object","isRequired":false,"isList":false}},{"name":"upsertOneEvent","args":[{"name":"where","inputType":[{"type":"EventWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"EventCreateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"EventUpdateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Event","kind":"object","isRequired":true,"isList":false}},{"name":"updateManyEvent","args":[{"name":"data","inputType":[{"type":"EventUpdateManyMutationInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"EventWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"deleteManyEvent","args":[{"name":"where","inputType":[{"type":"EventWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"createOneAthlete","args":[{"name":"data","inputType":[{"type":"AthleteCreateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Athlete","kind":"object","isRequired":true,"isList":false}},{"name":"deleteOneAthlete","args":[{"name":"where","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Athlete","kind":"object","isRequired":false,"isList":false}},{"name":"updateOneAthlete","args":[{"name":"data","inputType":[{"type":"AthleteUpdateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Athlete","kind":"object","isRequired":false,"isList":false}},{"name":"upsertOneAthlete","args":[{"name":"where","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"AthleteCreateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"AthleteUpdateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Athlete","kind":"object","isRequired":true,"isList":false}},{"name":"updateManyAthlete","args":[{"name":"data","inputType":[{"type":"AthleteUpdateManyMutationInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"AthleteWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"deleteManyAthlete","args":[{"name":"where","inputType":[{"type":"AthleteWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"createOneSlot","args":[{"name":"data","inputType":[{"type":"SlotCreateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Slot","kind":"object","isRequired":true,"isList":false}},{"name":"deleteOneSlot","args":[{"name":"where","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Slot","kind":"object","isRequired":false,"isList":false}},{"name":"updateOneSlot","args":[{"name":"data","inputType":[{"type":"SlotUpdateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Slot","kind":"object","isRequired":false,"isList":false}},{"name":"upsertOneSlot","args":[{"name":"where","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"SlotCreateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"SlotUpdateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Slot","kind":"object","isRequired":true,"isList":false}},{"name":"updateManySlot","args":[{"name":"data","inputType":[{"type":"SlotUpdateManyMutationInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"SlotWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"deleteManySlot","args":[{"name":"where","inputType":[{"type":"SlotWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"createOneAthleteGroup","args":[{"name":"data","inputType":[{"type":"AthleteGroupCreateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"AthleteGroup","kind":"object","isRequired":true,"isList":false}},{"name":"deleteOneAthleteGroup","args":[{"name":"where","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"AthleteGroup","kind":"object","isRequired":false,"isList":false}},{"name":"updateOneAthleteGroup","args":[{"name":"data","inputType":[{"type":"AthleteGroupUpdateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"AthleteGroup","kind":"object","isRequired":false,"isList":false}},{"name":"upsertOneAthleteGroup","args":[{"name":"where","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"AthleteGroupCreateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"AthleteGroupUpdateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"AthleteGroup","kind":"object","isRequired":true,"isList":false}},{"name":"updateManyAthleteGroup","args":[{"name":"data","inputType":[{"type":"AthleteGroupUpdateManyMutationInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"AthleteGroupWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"deleteManyAthleteGroup","args":[{"name":"where","inputType":[{"type":"AthleteGroupWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"createOneAttempt","args":[{"name":"data","inputType":[{"type":"AttemptCreateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Attempt","kind":"object","isRequired":true,"isList":false}},{"name":"deleteOneAttempt","args":[{"name":"where","inputType":[{"type":"AttemptWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Attempt","kind":"object","isRequired":false,"isList":false}},{"name":"updateOneAttempt","args":[{"name":"data","inputType":[{"type":"AttemptUpdateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"AttemptWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Attempt","kind":"object","isRequired":false,"isList":false}},{"name":"upsertOneAttempt","args":[{"name":"where","inputType":[{"type":"AttemptWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"AttemptCreateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"AttemptUpdateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Attempt","kind":"object","isRequired":true,"isList":false}},{"name":"updateManyAttempt","args":[{"name":"data","inputType":[{"type":"AttemptUpdateManyMutationInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"AttemptWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"deleteManyAttempt","args":[{"name":"where","inputType":[{"type":"AttemptWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"createOneWeightClass","args":[{"name":"data","inputType":[{"type":"WeightClassCreateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"WeightClass","kind":"object","isRequired":true,"isList":false}},{"name":"deleteOneWeightClass","args":[{"name":"where","inputType":[{"type":"WeightClassWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"WeightClass","kind":"object","isRequired":false,"isList":false}},{"name":"updateOneWeightClass","args":[{"name":"data","inputType":[{"type":"WeightClassUpdateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"WeightClassWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"WeightClass","kind":"object","isRequired":false,"isList":false}},{"name":"upsertOneWeightClass","args":[{"name":"where","inputType":[{"type":"WeightClassWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"WeightClassCreateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"WeightClassUpdateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"WeightClass","kind":"object","isRequired":true,"isList":false}},{"name":"updateManyWeightClass","args":[{"name":"data","inputType":[{"type":"WeightClassUpdateManyMutationInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"WeightClassWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"deleteManyWeightClass","args":[{"name":"where","inputType":[{"type":"WeightClassWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"createOneAgeClass","args":[{"name":"data","inputType":[{"type":"AgeClassCreateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"AgeClass","kind":"object","isRequired":true,"isList":false}},{"name":"deleteOneAgeClass","args":[{"name":"where","inputType":[{"type":"AgeClassWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"AgeClass","kind":"object","isRequired":false,"isList":false}},{"name":"updateOneAgeClass","args":[{"name":"data","inputType":[{"type":"AgeClassUpdateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"AgeClassWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"AgeClass","kind":"object","isRequired":false,"isList":false}},{"name":"upsertOneAgeClass","args":[{"name":"where","inputType":[{"type":"AgeClassWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"AgeClassCreateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"AgeClassUpdateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"AgeClass","kind":"object","isRequired":true,"isList":false}},{"name":"updateManyAgeClass","args":[{"name":"data","inputType":[{"type":"AgeClassUpdateManyMutationInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"AgeClassWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"deleteManyAgeClass","args":[{"name":"where","inputType":[{"type":"AgeClassWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"createOneOfficial","args":[{"name":"data","inputType":[{"type":"OfficialCreateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Official","kind":"object","isRequired":true,"isList":false}},{"name":"deleteOneOfficial","args":[{"name":"where","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Official","kind":"object","isRequired":false,"isList":false}},{"name":"updateOneOfficial","args":[{"name":"data","inputType":[{"type":"OfficialUpdateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Official","kind":"object","isRequired":false,"isList":false}},{"name":"upsertOneOfficial","args":[{"name":"where","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"OfficialCreateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"OfficialUpdateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"Official","kind":"object","isRequired":true,"isList":false}},{"name":"updateManyOfficial","args":[{"name":"data","inputType":[{"type":"OfficialUpdateManyMutationInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"OfficialWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"deleteManyOfficial","args":[{"name":"where","inputType":[{"type":"OfficialWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"createOneOfficialSlot","args":[{"name":"data","inputType":[{"type":"OfficialSlotCreateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"OfficialSlot","kind":"object","isRequired":true,"isList":false}},{"name":"deleteOneOfficialSlot","args":[{"name":"where","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"OfficialSlot","kind":"object","isRequired":false,"isList":false}},{"name":"updateOneOfficialSlot","args":[{"name":"data","inputType":[{"type":"OfficialSlotUpdateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"OfficialSlot","kind":"object","isRequired":false,"isList":false}},{"name":"upsertOneOfficialSlot","args":[{"name":"where","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"OfficialSlotCreateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"OfficialSlotUpdateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"OfficialSlot","kind":"object","isRequired":true,"isList":false}},{"name":"updateManyOfficialSlot","args":[{"name":"data","inputType":[{"type":"OfficialSlotUpdateManyMutationInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"OfficialSlotWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"deleteManyOfficialSlot","args":[{"name":"where","inputType":[{"type":"OfficialSlotWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"createOneUser","args":[{"name":"data","inputType":[{"type":"UserCreateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"User","kind":"object","isRequired":true,"isList":false}},{"name":"deleteOneUser","args":[{"name":"where","inputType":[{"type":"UserWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"User","kind":"object","isRequired":false,"isList":false}},{"name":"updateOneUser","args":[{"name":"data","inputType":[{"type":"UserUpdateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"UserWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"User","kind":"object","isRequired":false,"isList":false}},{"name":"upsertOneUser","args":[{"name":"where","inputType":[{"type":"UserWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"UserCreateInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"UserUpdateInput","kind":"object","isRequired":true,"isList":false}]}],"outputType":{"type":"User","kind":"object","isRequired":true,"isList":false}},{"name":"updateManyUser","args":[{"name":"data","inputType":[{"type":"UserUpdateManyMutationInput","kind":"object","isRequired":true,"isList":false}]},{"name":"where","inputType":[{"type":"UserWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"deleteManyUser","args":[{"name":"where","inputType":[{"type":"UserWhereInput","kind":"object","isRequired":false,"isList":false}]}],"outputType":{"type":"BatchPayload","kind":"object","isRequired":true,"isList":false}},{"name":"executeRaw","args":[{"name":"query","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"parameters","inputType":[{"type":"Json","kind":"scalar","isRequired":false,"isList":false}]}],"outputType":{"type":"Json","kind":"scalar","isRequired":true,"isList":false}}]}],"inputTypes":[{"name":"WeightClassWhereInput","fields":[{"name":"id","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"},{"type":"UUIDFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"name","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"gender","inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Gender"},{"type":"GenderFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"min","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"max","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"athlete","inputType":[{"type":"AthleteFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false,"nullEqualsUndefined":true},{"name":"AND","inputType":[{"type":"WeightClassWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"WeightClassWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"WeightClassWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"AgeClassWhereInput","fields":[{"name":"id","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"},{"type":"UUIDFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"name","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"sortId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"athlete","inputType":[{"type":"AthleteFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false,"nullEqualsUndefined":true},{"name":"AND","inputType":[{"type":"AgeClassWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"AgeClassWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"AgeClassWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"AttemptWhereInput","fields":[{"name":"id","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"},{"type":"UUIDFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"discipline","inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Discipline"},{"type":"DisciplineFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"date","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"index","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"weight","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"raw","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"type":"BooleanFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"valid","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"type":"BooleanFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"done","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"type":"BooleanFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"resign","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"type":"BooleanFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"athleteId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"AND","inputType":[{"type":"AttemptWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"AttemptWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"AttemptWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"athlete","inputType":[{"type":"AthleteWhereInput","kind":"object","isRequired":false,"isList":false}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"AthleteWhereInput","fields":[{"name":"id","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"},{"type":"UUIDFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"raw","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"type":"BooleanFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"athleteNumber","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"firstName","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"lastName","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"gender","inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Gender"},{"type":"GenderFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"club","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"birthday","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"total","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"norm","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"type":"BooleanFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"lateRegistration","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"type":"BooleanFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"price","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"bodyWeight","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"wilks","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"dots","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"los","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"KB1","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"KB2","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"KB3","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"BD1","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"BD2","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"BD3","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"KH1","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"KH2","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"KH3","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"points","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"place","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"location","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"nextAttemptsSortKeys","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"importId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"eventId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"weightClassId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"ageClassId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"resultClassId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"attempt","inputType":[{"type":"AttemptFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false,"nullEqualsUndefined":true},{"name":"AND","inputType":[{"type":"AthleteWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"AthleteWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"AthleteWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"event","inputType":[{"type":"EventWhereInput","kind":"object","isRequired":false,"isList":false}],"isRelationFilter":true},{"name":"weightClass","inputType":[{"type":"WeightClassWhereInput","kind":"object","isRequired":false,"isList":false}],"isRelationFilter":true},{"name":"ageClass","inputType":[{"type":"AgeClassWhereInput","kind":"object","isRequired":false,"isList":false}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"AthleteGroupWhereInput","fields":[{"name":"id","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"},{"type":"UUIDFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"name","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"eventId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"slotId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"AND","inputType":[{"type":"AthleteGroupWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"AthleteGroupWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"AthleteGroupWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"event","inputType":[{"type":"EventWhereInput","kind":"object","isRequired":false,"isList":false}],"isRelationFilter":true},{"name":"slot","inputType":[{"type":"SlotWhereInput","kind":"object","isRequired":false,"isList":false}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"OfficialWhereInput","fields":[{"name":"id","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"},{"type":"UUIDFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"officalNumber","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"lastName","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"firstName","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"club","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"license","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"position","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"location","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"importId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"eventId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"officialSlot","inputType":[{"type":"OfficialSlotFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false,"nullEqualsUndefined":true},{"name":"AND","inputType":[{"type":"OfficialWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"OfficialWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"OfficialWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"event","inputType":[{"type":"EventWhereInput","kind":"object","isRequired":false,"isList":false}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"OfficialSlotWhereInput","fields":[{"name":"id","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"},{"type":"UUIDFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"position","inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Position"},{"type":"PositionFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"officialId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"slotId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"AND","inputType":[{"type":"OfficialSlotWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"OfficialSlotWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"OfficialSlotWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"official","inputType":[{"type":"OfficialWhereInput","kind":"object","isRequired":false,"isList":false}],"isRelationFilter":true},{"name":"slot","inputType":[{"type":"SlotWhereInput","kind":"object","isRequired":false,"isList":false}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"SlotWhereInput","fields":[{"name":"id","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"},{"type":"UUIDFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"name","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"eventId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"athleteGroup","inputType":[{"type":"AthleteGroupFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false,"nullEqualsUndefined":true},{"name":"officialSlot","inputType":[{"type":"OfficialSlotFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false,"nullEqualsUndefined":true},{"name":"AND","inputType":[{"type":"SlotWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"SlotWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"SlotWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"event","inputType":[{"type":"EventWhereInput","kind":"object","isRequired":false,"isList":false}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"EventWhereInput","fields":[{"name":"id","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"},{"type":"UUIDFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"name","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"discipline","inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Discipline"},{"type":"DisciplineFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"contestType","inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"ContestType"},{"type":"ContestTypeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"athlete","inputType":[{"type":"AthleteFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false,"nullEqualsUndefined":true},{"name":"slot","inputType":[{"type":"SlotFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false,"nullEqualsUndefined":true},{"name":"athleteGroup","inputType":[{"type":"AthleteGroupFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false,"nullEqualsUndefined":true},{"name":"official","inputType":[{"type":"OfficialFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false,"nullEqualsUndefined":true},{"name":"AND","inputType":[{"type":"EventWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"EventWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"EventWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"EventWhereUniqueInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}],"atLeastOne":true},{"name":"AthleteWhereUniqueInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}],"atLeastOne":true},{"name":"AttemptWhereUniqueInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}],"atLeastOne":true},{"name":"SlotWhereUniqueInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}],"atLeastOne":true},{"name":"AthleteGroupWhereUniqueInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}],"atLeastOne":true},{"name":"OfficialSlotWhereUniqueInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}],"atLeastOne":true},{"name":"OfficialWhereUniqueInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}],"atLeastOne":true},{"name":"WeightClassWhereUniqueInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}],"atLeastOne":true},{"name":"AgeClassWhereUniqueInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}],"atLeastOne":true},{"name":"UserWhereInput","fields":[{"name":"id","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"},{"type":"UUIDFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"role","inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Role"},{"type":"RoleFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"username","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"passwordHash","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"salt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"AND","inputType":[{"type":"UserWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"UserWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"UserWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"UserWhereUniqueInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}],"atLeastOne":true},{"name":"WeightClassCreateWithoutAthleteInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"gender","inputType":[{"type":"Gender","kind":"enum","isRequired":true,"isList":false}]},{"name":"min","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"max","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]}]},{"name":"WeightClassCreateOneWithoutAthleteInput","fields":[{"name":"create","inputType":[{"type":"WeightClassCreateWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"WeightClassWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AgeClassCreateWithoutAthleteInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"sortId","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]}]},{"name":"AgeClassCreateOneWithoutAthleteInput","fields":[{"name":"create","inputType":[{"type":"AgeClassCreateWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"AgeClassWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AttemptCreateWithoutAthleteInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"discipline","inputType":[{"type":"Discipline","kind":"enum","isRequired":true,"isList":false}]},{"name":"date","inputType":[{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}]},{"name":"index","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"weight","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"valid","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"done","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"resign","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]}]},{"name":"AttemptCreateManyWithoutAthleteInput","fields":[{"name":"create","inputType":[{"type":"AttemptCreateWithoutAthleteInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"AttemptWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"AthleteCreateWithoutEventInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"athleteNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"gender","inputType":[{"type":"Gender","kind":"enum","isRequired":true,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"birthday","inputType":[{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}]},{"name":"total","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"norm","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"lateRegistration","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"price","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"bodyWeight","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"wilks","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"dots","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"los","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KB1","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KB2","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KB3","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"BD1","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"BD2","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"BD3","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KH1","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KH2","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KH3","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"points","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"place","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"nextAttemptsSortKeys","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"resultClassId","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"weightClass","inputType":[{"type":"WeightClassCreateOneWithoutAthleteInput","kind":"object","isRequired":true,"isList":false}]},{"name":"ageClass","inputType":[{"type":"AgeClassCreateOneWithoutAthleteInput","kind":"object","isRequired":true,"isList":false}]},{"name":"attempt","inputType":[{"type":"AttemptCreateManyWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteCreateManyWithoutEventInput","fields":[{"name":"create","inputType":[{"type":"AthleteCreateWithoutEventInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"EventCreateWithoutOfficialInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"discipline","inputType":[{"type":"Discipline","kind":"enum","isRequired":true,"isList":false}]},{"name":"contestType","inputType":[{"type":"ContestType","kind":"enum","isRequired":true,"isList":false}]},{"name":"athlete","inputType":[{"type":"AthleteCreateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"slot","inputType":[{"type":"SlotCreateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"athleteGroup","inputType":[{"type":"AthleteGroupCreateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"EventCreateOneWithoutOfficialInput","fields":[{"name":"create","inputType":[{"type":"EventCreateWithoutOfficialInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"EventWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"OfficialCreateWithoutOfficialSlotInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"officalNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"license","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"position","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"event","inputType":[{"type":"EventCreateOneWithoutOfficialInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"OfficialCreateOneWithoutOfficialSlotInput","fields":[{"name":"create","inputType":[{"type":"OfficialCreateWithoutOfficialSlotInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"OfficialSlotCreateWithoutSlotInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"position","inputType":[{"type":"Position","kind":"enum","isRequired":true,"isList":false}]},{"name":"official","inputType":[{"type":"OfficialCreateOneWithoutOfficialSlotInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"OfficialSlotCreateManyWithoutSlotInput","fields":[{"name":"create","inputType":[{"type":"OfficialSlotCreateWithoutSlotInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"SlotCreateWithoutAthleteGroupInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"event","inputType":[{"type":"EventCreateOneWithoutSlotInput","kind":"object","isRequired":true,"isList":false}]},{"name":"officialSlot","inputType":[{"type":"OfficialSlotCreateManyWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"SlotCreateOneWithoutAthleteGroupInput","fields":[{"name":"create","inputType":[{"type":"SlotCreateWithoutAthleteGroupInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteGroupCreateWithoutEventInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"slot","inputType":[{"type":"SlotCreateOneWithoutAthleteGroupInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteGroupCreateManyWithoutEventInput","fields":[{"name":"create","inputType":[{"type":"AthleteGroupCreateWithoutEventInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"EventCreateWithoutSlotInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"discipline","inputType":[{"type":"Discipline","kind":"enum","isRequired":true,"isList":false}]},{"name":"contestType","inputType":[{"type":"ContestType","kind":"enum","isRequired":true,"isList":false}]},{"name":"athlete","inputType":[{"type":"AthleteCreateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"athleteGroup","inputType":[{"type":"AthleteGroupCreateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"official","inputType":[{"type":"OfficialCreateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"EventCreateOneWithoutSlotInput","fields":[{"name":"create","inputType":[{"type":"EventCreateWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"EventWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"SlotCreateWithoutOfficialSlotInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"event","inputType":[{"type":"EventCreateOneWithoutSlotInput","kind":"object","isRequired":true,"isList":false}]},{"name":"athleteGroup","inputType":[{"type":"AthleteGroupCreateManyWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"SlotCreateOneWithoutOfficialSlotInput","fields":[{"name":"create","inputType":[{"type":"SlotCreateWithoutOfficialSlotInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"OfficialSlotCreateWithoutOfficialInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"position","inputType":[{"type":"Position","kind":"enum","isRequired":true,"isList":false}]},{"name":"slot","inputType":[{"type":"SlotCreateOneWithoutOfficialSlotInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"OfficialSlotCreateManyWithoutOfficialInput","fields":[{"name":"create","inputType":[{"type":"OfficialSlotCreateWithoutOfficialInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"OfficialCreateWithoutEventInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"officalNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"license","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"position","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"officialSlot","inputType":[{"type":"OfficialSlotCreateManyWithoutOfficialInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"OfficialCreateManyWithoutEventInput","fields":[{"name":"create","inputType":[{"type":"OfficialCreateWithoutEventInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"EventCreateWithoutAthleteGroupInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"discipline","inputType":[{"type":"Discipline","kind":"enum","isRequired":true,"isList":false}]},{"name":"contestType","inputType":[{"type":"ContestType","kind":"enum","isRequired":true,"isList":false}]},{"name":"athlete","inputType":[{"type":"AthleteCreateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"slot","inputType":[{"type":"SlotCreateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"official","inputType":[{"type":"OfficialCreateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"EventCreateOneWithoutAthleteGroupInput","fields":[{"name":"create","inputType":[{"type":"EventCreateWithoutAthleteGroupInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"EventWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteGroupCreateWithoutSlotInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"event","inputType":[{"type":"EventCreateOneWithoutAthleteGroupInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteGroupCreateManyWithoutSlotInput","fields":[{"name":"create","inputType":[{"type":"AthleteGroupCreateWithoutSlotInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"SlotCreateWithoutEventInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"athleteGroup","inputType":[{"type":"AthleteGroupCreateManyWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]},{"name":"officialSlot","inputType":[{"type":"OfficialSlotCreateManyWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"SlotCreateManyWithoutEventInput","fields":[{"name":"create","inputType":[{"type":"SlotCreateWithoutEventInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"EventCreateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"discipline","inputType":[{"type":"Discipline","kind":"enum","isRequired":true,"isList":false}]},{"name":"contestType","inputType":[{"type":"ContestType","kind":"enum","isRequired":true,"isList":false}]},{"name":"athlete","inputType":[{"type":"AthleteCreateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"slot","inputType":[{"type":"SlotCreateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"athleteGroup","inputType":[{"type":"AthleteGroupCreateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"official","inputType":[{"type":"OfficialCreateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"WeightClassUpdateWithoutAthleteDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"gender","inputType":[{"type":"Gender","kind":"enum","isRequired":false,"isList":false}]},{"name":"min","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"max","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}]},{"name":"WeightClassUpsertWithoutAthleteInput","fields":[{"name":"update","inputType":[{"type":"WeightClassUpdateWithoutAthleteDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"WeightClassCreateWithoutAthleteInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"WeightClassUpdateOneRequiredWithoutAthleteInput","fields":[{"name":"create","inputType":[{"type":"WeightClassCreateWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"WeightClassWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"update","inputType":[{"type":"WeightClassUpdateWithoutAthleteDataInput","kind":"object","isRequired":false,"isList":false}]},{"name":"upsert","inputType":[{"type":"WeightClassUpsertWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AgeClassUpdateWithoutAthleteDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"sortId","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}]},{"name":"AgeClassUpsertWithoutAthleteInput","fields":[{"name":"update","inputType":[{"type":"AgeClassUpdateWithoutAthleteDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"AgeClassCreateWithoutAthleteInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AgeClassUpdateOneRequiredWithoutAthleteInput","fields":[{"name":"create","inputType":[{"type":"AgeClassCreateWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"AgeClassWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"update","inputType":[{"type":"AgeClassUpdateWithoutAthleteDataInput","kind":"object","isRequired":false,"isList":false}]},{"name":"upsert","inputType":[{"type":"AgeClassUpsertWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AttemptUpdateWithoutAthleteDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"discipline","inputType":[{"type":"Discipline","kind":"enum","isRequired":false,"isList":false}]},{"name":"date","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"index","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"weight","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"valid","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"done","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"resign","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]}]},{"name":"AttemptUpdateWithWhereUniqueWithoutAthleteInput","fields":[{"name":"where","inputType":[{"type":"AttemptWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"AttemptUpdateWithoutAthleteDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AttemptScalarWhereInput","fields":[{"name":"id","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"},{"type":"UUIDFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"discipline","inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Discipline"},{"type":"DisciplineFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"date","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"index","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"weight","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"raw","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"type":"BooleanFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"valid","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"type":"BooleanFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"done","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"type":"BooleanFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"resign","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"type":"BooleanFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"athleteId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"AND","inputType":[{"type":"AttemptScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"AttemptScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"AttemptScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"AttemptUpdateManyDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"discipline","inputType":[{"type":"Discipline","kind":"enum","isRequired":false,"isList":false}]},{"name":"date","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"index","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"weight","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"valid","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"done","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"resign","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]}]},{"name":"AttemptUpdateManyWithWhereNestedInput","fields":[{"name":"where","inputType":[{"type":"AttemptScalarWhereInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"AttemptUpdateManyDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AttemptUpsertWithWhereUniqueWithoutAthleteInput","fields":[{"name":"where","inputType":[{"type":"AttemptWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"AttemptUpdateWithoutAthleteDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"AttemptCreateWithoutAthleteInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AttemptUpdateManyWithoutAthleteInput","fields":[{"name":"create","inputType":[{"type":"AttemptCreateWithoutAthleteInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"AttemptWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"set","inputType":[{"type":"AttemptWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"disconnect","inputType":[{"type":"AttemptWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"delete","inputType":[{"type":"AttemptWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"update","inputType":[{"type":"AttemptUpdateWithWhereUniqueWithoutAthleteInput","kind":"object","isRequired":false,"isList":true}]},{"name":"updateMany","inputType":[{"type":"AttemptUpdateManyWithWhereNestedInput","kind":"object","isRequired":false,"isList":true}]},{"name":"deleteMany","inputType":[{"type":"AttemptScalarWhereInput","kind":"object","isRequired":false,"isList":true}]},{"name":"upsert","inputType":[{"type":"AttemptUpsertWithWhereUniqueWithoutAthleteInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"AthleteUpdateWithoutEventDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"athleteNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"gender","inputType":[{"type":"Gender","kind":"enum","isRequired":false,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"birthday","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"total","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"norm","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lateRegistration","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"price","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"bodyWeight","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"wilks","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"dots","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"los","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"points","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"place","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"nextAttemptsSortKeys","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"resultClassId","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"weightClass","inputType":[{"type":"WeightClassUpdateOneRequiredWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]},{"name":"ageClass","inputType":[{"type":"AgeClassUpdateOneRequiredWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]},{"name":"attempt","inputType":[{"type":"AttemptUpdateManyWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteUpdateWithWhereUniqueWithoutEventInput","fields":[{"name":"where","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"AthleteUpdateWithoutEventDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteScalarWhereInput","fields":[{"name":"id","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"},{"type":"UUIDFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"raw","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"type":"BooleanFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"athleteNumber","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"firstName","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"lastName","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"gender","inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Gender"},{"type":"GenderFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"club","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"birthday","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"total","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"norm","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"type":"BooleanFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"lateRegistration","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"type":"BooleanFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"price","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"bodyWeight","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"wilks","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"dots","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"los","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"KB1","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"KB2","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"KB3","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"BD1","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"BD2","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"BD3","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"KH1","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"KH2","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"KH3","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"points","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"type":"FloatFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"place","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"location","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"nextAttemptsSortKeys","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"importId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"eventId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"weightClassId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"ageClassId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"resultClassId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"attempt","inputType":[{"type":"AttemptFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false,"nullEqualsUndefined":true},{"name":"AND","inputType":[{"type":"AthleteScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"AthleteScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"AthleteScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"AthleteUpdateManyDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"athleteNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"gender","inputType":[{"type":"Gender","kind":"enum","isRequired":false,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"birthday","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"total","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"norm","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lateRegistration","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"price","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"bodyWeight","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"wilks","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"dots","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"los","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"points","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"place","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"nextAttemptsSortKeys","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"resultClassId","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}]},{"name":"AthleteUpdateManyWithWhereNestedInput","fields":[{"name":"where","inputType":[{"type":"AthleteScalarWhereInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"AthleteUpdateManyDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteUpsertWithWhereUniqueWithoutEventInput","fields":[{"name":"where","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"AthleteUpdateWithoutEventDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"AthleteCreateWithoutEventInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteUpdateManyWithoutEventInput","fields":[{"name":"create","inputType":[{"type":"AthleteCreateWithoutEventInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"set","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"disconnect","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"delete","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"update","inputType":[{"type":"AthleteUpdateWithWhereUniqueWithoutEventInput","kind":"object","isRequired":false,"isList":true}]},{"name":"updateMany","inputType":[{"type":"AthleteUpdateManyWithWhereNestedInput","kind":"object","isRequired":false,"isList":true}]},{"name":"deleteMany","inputType":[{"type":"AthleteScalarWhereInput","kind":"object","isRequired":false,"isList":true}]},{"name":"upsert","inputType":[{"type":"AthleteUpsertWithWhereUniqueWithoutEventInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"EventUpdateWithoutOfficialDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"discipline","inputType":[{"type":"Discipline","kind":"enum","isRequired":false,"isList":false}]},{"name":"contestType","inputType":[{"type":"ContestType","kind":"enum","isRequired":false,"isList":false}]},{"name":"athlete","inputType":[{"type":"AthleteUpdateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"slot","inputType":[{"type":"SlotUpdateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"athleteGroup","inputType":[{"type":"AthleteGroupUpdateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"EventUpsertWithoutOfficialInput","fields":[{"name":"update","inputType":[{"type":"EventUpdateWithoutOfficialDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"EventCreateWithoutOfficialInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"EventUpdateOneRequiredWithoutOfficialInput","fields":[{"name":"create","inputType":[{"type":"EventCreateWithoutOfficialInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"EventWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"update","inputType":[{"type":"EventUpdateWithoutOfficialDataInput","kind":"object","isRequired":false,"isList":false}]},{"name":"upsert","inputType":[{"type":"EventUpsertWithoutOfficialInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"OfficialUpdateWithoutOfficialSlotDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"officalNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"license","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"position","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"event","inputType":[{"type":"EventUpdateOneRequiredWithoutOfficialInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"OfficialUpsertWithoutOfficialSlotInput","fields":[{"name":"update","inputType":[{"type":"OfficialUpdateWithoutOfficialSlotDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"OfficialCreateWithoutOfficialSlotInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"OfficialUpdateOneRequiredWithoutOfficialSlotInput","fields":[{"name":"create","inputType":[{"type":"OfficialCreateWithoutOfficialSlotInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"update","inputType":[{"type":"OfficialUpdateWithoutOfficialSlotDataInput","kind":"object","isRequired":false,"isList":false}]},{"name":"upsert","inputType":[{"type":"OfficialUpsertWithoutOfficialSlotInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"OfficialSlotUpdateWithoutSlotDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"position","inputType":[{"type":"Position","kind":"enum","isRequired":false,"isList":false}]},{"name":"official","inputType":[{"type":"OfficialUpdateOneRequiredWithoutOfficialSlotInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"OfficialSlotUpdateWithWhereUniqueWithoutSlotInput","fields":[{"name":"where","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"OfficialSlotUpdateWithoutSlotDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"OfficialSlotScalarWhereInput","fields":[{"name":"id","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"},{"type":"UUIDFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"position","inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Position"},{"type":"PositionFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"officialId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"slotId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"AND","inputType":[{"type":"OfficialSlotScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"OfficialSlotScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"OfficialSlotScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"OfficialSlotUpdateManyDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"position","inputType":[{"type":"Position","kind":"enum","isRequired":false,"isList":false}]}]},{"name":"OfficialSlotUpdateManyWithWhereNestedInput","fields":[{"name":"where","inputType":[{"type":"OfficialSlotScalarWhereInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"OfficialSlotUpdateManyDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"OfficialSlotUpsertWithWhereUniqueWithoutSlotInput","fields":[{"name":"where","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"OfficialSlotUpdateWithoutSlotDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"OfficialSlotCreateWithoutSlotInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"OfficialSlotUpdateManyWithoutSlotInput","fields":[{"name":"create","inputType":[{"type":"OfficialSlotCreateWithoutSlotInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"set","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"disconnect","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"delete","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"update","inputType":[{"type":"OfficialSlotUpdateWithWhereUniqueWithoutSlotInput","kind":"object","isRequired":false,"isList":true}]},{"name":"updateMany","inputType":[{"type":"OfficialSlotUpdateManyWithWhereNestedInput","kind":"object","isRequired":false,"isList":true}]},{"name":"deleteMany","inputType":[{"type":"OfficialSlotScalarWhereInput","kind":"object","isRequired":false,"isList":true}]},{"name":"upsert","inputType":[{"type":"OfficialSlotUpsertWithWhereUniqueWithoutSlotInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"SlotUpdateWithoutAthleteGroupDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"event","inputType":[{"type":"EventUpdateOneRequiredWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]},{"name":"officialSlot","inputType":[{"type":"OfficialSlotUpdateManyWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"SlotUpsertWithoutAthleteGroupInput","fields":[{"name":"update","inputType":[{"type":"SlotUpdateWithoutAthleteGroupDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"SlotCreateWithoutAthleteGroupInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"SlotUpdateOneRequiredWithoutAthleteGroupInput","fields":[{"name":"create","inputType":[{"type":"SlotCreateWithoutAthleteGroupInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"update","inputType":[{"type":"SlotUpdateWithoutAthleteGroupDataInput","kind":"object","isRequired":false,"isList":false}]},{"name":"upsert","inputType":[{"type":"SlotUpsertWithoutAthleteGroupInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteGroupUpdateWithoutEventDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"slot","inputType":[{"type":"SlotUpdateOneRequiredWithoutAthleteGroupInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteGroupUpdateWithWhereUniqueWithoutEventInput","fields":[{"name":"where","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"AthleteGroupUpdateWithoutEventDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteGroupScalarWhereInput","fields":[{"name":"id","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"},{"type":"UUIDFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"name","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"eventId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"slotId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"AND","inputType":[{"type":"AthleteGroupScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"AthleteGroupScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"AthleteGroupScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"AthleteGroupUpdateManyDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}]},{"name":"AthleteGroupUpdateManyWithWhereNestedInput","fields":[{"name":"where","inputType":[{"type":"AthleteGroupScalarWhereInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"AthleteGroupUpdateManyDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteGroupUpsertWithWhereUniqueWithoutEventInput","fields":[{"name":"where","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"AthleteGroupUpdateWithoutEventDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"AthleteGroupCreateWithoutEventInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteGroupUpdateManyWithoutEventInput","fields":[{"name":"create","inputType":[{"type":"AthleteGroupCreateWithoutEventInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"set","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"disconnect","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"delete","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"update","inputType":[{"type":"AthleteGroupUpdateWithWhereUniqueWithoutEventInput","kind":"object","isRequired":false,"isList":true}]},{"name":"updateMany","inputType":[{"type":"AthleteGroupUpdateManyWithWhereNestedInput","kind":"object","isRequired":false,"isList":true}]},{"name":"deleteMany","inputType":[{"type":"AthleteGroupScalarWhereInput","kind":"object","isRequired":false,"isList":true}]},{"name":"upsert","inputType":[{"type":"AthleteGroupUpsertWithWhereUniqueWithoutEventInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"EventUpdateWithoutSlotDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"discipline","inputType":[{"type":"Discipline","kind":"enum","isRequired":false,"isList":false}]},{"name":"contestType","inputType":[{"type":"ContestType","kind":"enum","isRequired":false,"isList":false}]},{"name":"athlete","inputType":[{"type":"AthleteUpdateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"athleteGroup","inputType":[{"type":"AthleteGroupUpdateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"official","inputType":[{"type":"OfficialUpdateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"EventUpsertWithoutSlotInput","fields":[{"name":"update","inputType":[{"type":"EventUpdateWithoutSlotDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"EventCreateWithoutSlotInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"EventUpdateOneRequiredWithoutSlotInput","fields":[{"name":"create","inputType":[{"type":"EventCreateWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"EventWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"update","inputType":[{"type":"EventUpdateWithoutSlotDataInput","kind":"object","isRequired":false,"isList":false}]},{"name":"upsert","inputType":[{"type":"EventUpsertWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"SlotUpdateWithoutOfficialSlotDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"event","inputType":[{"type":"EventUpdateOneRequiredWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]},{"name":"athleteGroup","inputType":[{"type":"AthleteGroupUpdateManyWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"SlotUpsertWithoutOfficialSlotInput","fields":[{"name":"update","inputType":[{"type":"SlotUpdateWithoutOfficialSlotDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"SlotCreateWithoutOfficialSlotInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"SlotUpdateOneRequiredWithoutOfficialSlotInput","fields":[{"name":"create","inputType":[{"type":"SlotCreateWithoutOfficialSlotInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"update","inputType":[{"type":"SlotUpdateWithoutOfficialSlotDataInput","kind":"object","isRequired":false,"isList":false}]},{"name":"upsert","inputType":[{"type":"SlotUpsertWithoutOfficialSlotInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"OfficialSlotUpdateWithoutOfficialDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"position","inputType":[{"type":"Position","kind":"enum","isRequired":false,"isList":false}]},{"name":"slot","inputType":[{"type":"SlotUpdateOneRequiredWithoutOfficialSlotInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"OfficialSlotUpdateWithWhereUniqueWithoutOfficialInput","fields":[{"name":"where","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"OfficialSlotUpdateWithoutOfficialDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"OfficialSlotUpsertWithWhereUniqueWithoutOfficialInput","fields":[{"name":"where","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"OfficialSlotUpdateWithoutOfficialDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"OfficialSlotCreateWithoutOfficialInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"OfficialSlotUpdateManyWithoutOfficialInput","fields":[{"name":"create","inputType":[{"type":"OfficialSlotCreateWithoutOfficialInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"set","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"disconnect","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"delete","inputType":[{"type":"OfficialSlotWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"update","inputType":[{"type":"OfficialSlotUpdateWithWhereUniqueWithoutOfficialInput","kind":"object","isRequired":false,"isList":true}]},{"name":"updateMany","inputType":[{"type":"OfficialSlotUpdateManyWithWhereNestedInput","kind":"object","isRequired":false,"isList":true}]},{"name":"deleteMany","inputType":[{"type":"OfficialSlotScalarWhereInput","kind":"object","isRequired":false,"isList":true}]},{"name":"upsert","inputType":[{"type":"OfficialSlotUpsertWithWhereUniqueWithoutOfficialInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"OfficialUpdateWithoutEventDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"officalNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"license","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"position","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"officialSlot","inputType":[{"type":"OfficialSlotUpdateManyWithoutOfficialInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"OfficialUpdateWithWhereUniqueWithoutEventInput","fields":[{"name":"where","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"OfficialUpdateWithoutEventDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"OfficialScalarWhereInput","fields":[{"name":"id","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"},{"type":"UUIDFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"officalNumber","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"lastName","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"firstName","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"club","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"license","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"position","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"location","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"importId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"type":"IntFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"eventId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"officialSlot","inputType":[{"type":"OfficialSlotFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false,"nullEqualsUndefined":true},{"name":"AND","inputType":[{"type":"OfficialScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"OfficialScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"OfficialScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"OfficialUpdateManyDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"officalNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"license","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"position","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}]},{"name":"OfficialUpdateManyWithWhereNestedInput","fields":[{"name":"where","inputType":[{"type":"OfficialScalarWhereInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"OfficialUpdateManyDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"OfficialUpsertWithWhereUniqueWithoutEventInput","fields":[{"name":"where","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"OfficialUpdateWithoutEventDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"OfficialCreateWithoutEventInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"OfficialUpdateManyWithoutEventInput","fields":[{"name":"create","inputType":[{"type":"OfficialCreateWithoutEventInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"set","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"disconnect","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"delete","inputType":[{"type":"OfficialWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"update","inputType":[{"type":"OfficialUpdateWithWhereUniqueWithoutEventInput","kind":"object","isRequired":false,"isList":true}]},{"name":"updateMany","inputType":[{"type":"OfficialUpdateManyWithWhereNestedInput","kind":"object","isRequired":false,"isList":true}]},{"name":"deleteMany","inputType":[{"type":"OfficialScalarWhereInput","kind":"object","isRequired":false,"isList":true}]},{"name":"upsert","inputType":[{"type":"OfficialUpsertWithWhereUniqueWithoutEventInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"EventUpdateWithoutAthleteGroupDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"discipline","inputType":[{"type":"Discipline","kind":"enum","isRequired":false,"isList":false}]},{"name":"contestType","inputType":[{"type":"ContestType","kind":"enum","isRequired":false,"isList":false}]},{"name":"athlete","inputType":[{"type":"AthleteUpdateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"slot","inputType":[{"type":"SlotUpdateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"official","inputType":[{"type":"OfficialUpdateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"EventUpsertWithoutAthleteGroupInput","fields":[{"name":"update","inputType":[{"type":"EventUpdateWithoutAthleteGroupDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"EventCreateWithoutAthleteGroupInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"EventUpdateOneRequiredWithoutAthleteGroupInput","fields":[{"name":"create","inputType":[{"type":"EventCreateWithoutAthleteGroupInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"EventWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"update","inputType":[{"type":"EventUpdateWithoutAthleteGroupDataInput","kind":"object","isRequired":false,"isList":false}]},{"name":"upsert","inputType":[{"type":"EventUpsertWithoutAthleteGroupInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteGroupUpdateWithoutSlotDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"event","inputType":[{"type":"EventUpdateOneRequiredWithoutAthleteGroupInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteGroupUpdateWithWhereUniqueWithoutSlotInput","fields":[{"name":"where","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"AthleteGroupUpdateWithoutSlotDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteGroupUpsertWithWhereUniqueWithoutSlotInput","fields":[{"name":"where","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"AthleteGroupUpdateWithoutSlotDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"AthleteGroupCreateWithoutSlotInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteGroupUpdateManyWithoutSlotInput","fields":[{"name":"create","inputType":[{"type":"AthleteGroupCreateWithoutSlotInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"set","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"disconnect","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"delete","inputType":[{"type":"AthleteGroupWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"update","inputType":[{"type":"AthleteGroupUpdateWithWhereUniqueWithoutSlotInput","kind":"object","isRequired":false,"isList":true}]},{"name":"updateMany","inputType":[{"type":"AthleteGroupUpdateManyWithWhereNestedInput","kind":"object","isRequired":false,"isList":true}]},{"name":"deleteMany","inputType":[{"type":"AthleteGroupScalarWhereInput","kind":"object","isRequired":false,"isList":true}]},{"name":"upsert","inputType":[{"type":"AthleteGroupUpsertWithWhereUniqueWithoutSlotInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"SlotUpdateWithoutEventDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"athleteGroup","inputType":[{"type":"AthleteGroupUpdateManyWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]},{"name":"officialSlot","inputType":[{"type":"OfficialSlotUpdateManyWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"SlotUpdateWithWhereUniqueWithoutEventInput","fields":[{"name":"where","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"SlotUpdateWithoutEventDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"SlotScalarWhereInput","fields":[{"name":"id","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"},{"type":"UUIDFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"type":"DateTimeFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"name","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"eventId","inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"type":"StringFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false},{"name":"athleteGroup","inputType":[{"type":"AthleteGroupFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false,"nullEqualsUndefined":true},{"name":"officialSlot","inputType":[{"type":"OfficialSlotFilter","isList":false,"isRequired":false,"kind":"object"}],"isRelationFilter":false,"nullEqualsUndefined":true},{"name":"AND","inputType":[{"type":"SlotScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"OR","inputType":[{"type":"SlotScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true},{"name":"NOT","inputType":[{"type":"SlotScalarWhereInput","kind":"object","isRequired":false,"isList":true}],"isRelationFilter":true}],"isWhereType":true,"atLeastOne":false},{"name":"SlotUpdateManyDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}]},{"name":"SlotUpdateManyWithWhereNestedInput","fields":[{"name":"where","inputType":[{"type":"SlotScalarWhereInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"SlotUpdateManyDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"SlotUpsertWithWhereUniqueWithoutEventInput","fields":[{"name":"where","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"SlotUpdateWithoutEventDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"SlotCreateWithoutEventInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"SlotUpdateManyWithoutEventInput","fields":[{"name":"create","inputType":[{"type":"SlotCreateWithoutEventInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"set","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"disconnect","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"delete","inputType":[{"type":"SlotWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"update","inputType":[{"type":"SlotUpdateWithWhereUniqueWithoutEventInput","kind":"object","isRequired":false,"isList":true}]},{"name":"updateMany","inputType":[{"type":"SlotUpdateManyWithWhereNestedInput","kind":"object","isRequired":false,"isList":true}]},{"name":"deleteMany","inputType":[{"type":"SlotScalarWhereInput","kind":"object","isRequired":false,"isList":true}]},{"name":"upsert","inputType":[{"type":"SlotUpsertWithWhereUniqueWithoutEventInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"EventUpdateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"discipline","inputType":[{"type":"Discipline","kind":"enum","isRequired":false,"isList":false}]},{"name":"contestType","inputType":[{"type":"ContestType","kind":"enum","isRequired":false,"isList":false}]},{"name":"athlete","inputType":[{"type":"AthleteUpdateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"slot","inputType":[{"type":"SlotUpdateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"athleteGroup","inputType":[{"type":"AthleteGroupUpdateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"official","inputType":[{"type":"OfficialUpdateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"EventUpdateManyMutationInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"discipline","inputType":[{"type":"Discipline","kind":"enum","isRequired":false,"isList":false}]},{"name":"contestType","inputType":[{"type":"ContestType","kind":"enum","isRequired":false,"isList":false}]}]},{"name":"EventCreateWithoutAthleteInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"discipline","inputType":[{"type":"Discipline","kind":"enum","isRequired":true,"isList":false}]},{"name":"contestType","inputType":[{"type":"ContestType","kind":"enum","isRequired":true,"isList":false}]},{"name":"slot","inputType":[{"type":"SlotCreateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"athleteGroup","inputType":[{"type":"AthleteGroupCreateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"official","inputType":[{"type":"OfficialCreateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"EventCreateOneWithoutAthleteInput","fields":[{"name":"create","inputType":[{"type":"EventCreateWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"EventWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteCreateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"athleteNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"gender","inputType":[{"type":"Gender","kind":"enum","isRequired":true,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"birthday","inputType":[{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}]},{"name":"total","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"norm","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"lateRegistration","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"price","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"bodyWeight","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"wilks","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"dots","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"los","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KB1","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KB2","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KB3","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"BD1","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"BD2","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"BD3","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KH1","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KH2","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KH3","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"points","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"place","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"nextAttemptsSortKeys","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"resultClassId","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"event","inputType":[{"type":"EventCreateOneWithoutAthleteInput","kind":"object","isRequired":true,"isList":false}]},{"name":"weightClass","inputType":[{"type":"WeightClassCreateOneWithoutAthleteInput","kind":"object","isRequired":true,"isList":false}]},{"name":"ageClass","inputType":[{"type":"AgeClassCreateOneWithoutAthleteInput","kind":"object","isRequired":true,"isList":false}]},{"name":"attempt","inputType":[{"type":"AttemptCreateManyWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"EventUpdateWithoutAthleteDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"discipline","inputType":[{"type":"Discipline","kind":"enum","isRequired":false,"isList":false}]},{"name":"contestType","inputType":[{"type":"ContestType","kind":"enum","isRequired":false,"isList":false}]},{"name":"slot","inputType":[{"type":"SlotUpdateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"athleteGroup","inputType":[{"type":"AthleteGroupUpdateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]},{"name":"official","inputType":[{"type":"OfficialUpdateManyWithoutEventInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"EventUpsertWithoutAthleteInput","fields":[{"name":"update","inputType":[{"type":"EventUpdateWithoutAthleteDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"EventCreateWithoutAthleteInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"EventUpdateOneRequiredWithoutAthleteInput","fields":[{"name":"create","inputType":[{"type":"EventCreateWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"EventWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"update","inputType":[{"type":"EventUpdateWithoutAthleteDataInput","kind":"object","isRequired":false,"isList":false}]},{"name":"upsert","inputType":[{"type":"EventUpsertWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteUpdateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"athleteNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"gender","inputType":[{"type":"Gender","kind":"enum","isRequired":false,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"birthday","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"total","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"norm","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lateRegistration","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"price","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"bodyWeight","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"wilks","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"dots","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"los","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"points","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"place","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"nextAttemptsSortKeys","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"resultClassId","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"event","inputType":[{"type":"EventUpdateOneRequiredWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]},{"name":"weightClass","inputType":[{"type":"WeightClassUpdateOneRequiredWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]},{"name":"ageClass","inputType":[{"type":"AgeClassUpdateOneRequiredWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]},{"name":"attempt","inputType":[{"type":"AttemptUpdateManyWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteUpdateManyMutationInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"athleteNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"gender","inputType":[{"type":"Gender","kind":"enum","isRequired":false,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"birthday","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"total","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"norm","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lateRegistration","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"price","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"bodyWeight","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"wilks","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"dots","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"los","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"points","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"place","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"nextAttemptsSortKeys","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"resultClassId","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}]},{"name":"SlotCreateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"event","inputType":[{"type":"EventCreateOneWithoutSlotInput","kind":"object","isRequired":true,"isList":false}]},{"name":"athleteGroup","inputType":[{"type":"AthleteGroupCreateManyWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]},{"name":"officialSlot","inputType":[{"type":"OfficialSlotCreateManyWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"SlotUpdateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"event","inputType":[{"type":"EventUpdateOneRequiredWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]},{"name":"athleteGroup","inputType":[{"type":"AthleteGroupUpdateManyWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]},{"name":"officialSlot","inputType":[{"type":"OfficialSlotUpdateManyWithoutSlotInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"SlotUpdateManyMutationInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}]},{"name":"AthleteGroupCreateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"event","inputType":[{"type":"EventCreateOneWithoutAthleteGroupInput","kind":"object","isRequired":true,"isList":false}]},{"name":"slot","inputType":[{"type":"SlotCreateOneWithoutAthleteGroupInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteGroupUpdateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"event","inputType":[{"type":"EventUpdateOneRequiredWithoutAthleteGroupInput","kind":"object","isRequired":false,"isList":false}]},{"name":"slot","inputType":[{"type":"SlotUpdateOneRequiredWithoutAthleteGroupInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteGroupUpdateManyMutationInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}]},{"name":"AthleteCreateWithoutAttemptInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"athleteNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"gender","inputType":[{"type":"Gender","kind":"enum","isRequired":true,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"birthday","inputType":[{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}]},{"name":"total","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"norm","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"lateRegistration","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"price","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"bodyWeight","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"wilks","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"dots","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"los","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KB1","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KB2","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KB3","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"BD1","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"BD2","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"BD3","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KH1","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KH2","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KH3","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"points","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"place","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"nextAttemptsSortKeys","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"resultClassId","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"event","inputType":[{"type":"EventCreateOneWithoutAthleteInput","kind":"object","isRequired":true,"isList":false}]},{"name":"weightClass","inputType":[{"type":"WeightClassCreateOneWithoutAthleteInput","kind":"object","isRequired":true,"isList":false}]},{"name":"ageClass","inputType":[{"type":"AgeClassCreateOneWithoutAthleteInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteCreateOneWithoutAttemptInput","fields":[{"name":"create","inputType":[{"type":"AthleteCreateWithoutAttemptInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AttemptCreateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"discipline","inputType":[{"type":"Discipline","kind":"enum","isRequired":true,"isList":false}]},{"name":"date","inputType":[{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}]},{"name":"index","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"weight","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"valid","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"done","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"resign","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"athlete","inputType":[{"type":"AthleteCreateOneWithoutAttemptInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteUpdateWithoutAttemptDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"athleteNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"gender","inputType":[{"type":"Gender","kind":"enum","isRequired":false,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"birthday","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"total","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"norm","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lateRegistration","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"price","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"bodyWeight","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"wilks","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"dots","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"los","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"points","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"place","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"nextAttemptsSortKeys","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"resultClassId","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"event","inputType":[{"type":"EventUpdateOneRequiredWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]},{"name":"weightClass","inputType":[{"type":"WeightClassUpdateOneRequiredWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]},{"name":"ageClass","inputType":[{"type":"AgeClassUpdateOneRequiredWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteUpsertWithoutAttemptInput","fields":[{"name":"update","inputType":[{"type":"AthleteUpdateWithoutAttemptDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"AthleteCreateWithoutAttemptInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteUpdateOneRequiredWithoutAttemptInput","fields":[{"name":"create","inputType":[{"type":"AthleteCreateWithoutAttemptInput","kind":"object","isRequired":false,"isList":false}]},{"name":"connect","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":false}]},{"name":"update","inputType":[{"type":"AthleteUpdateWithoutAttemptDataInput","kind":"object","isRequired":false,"isList":false}]},{"name":"upsert","inputType":[{"type":"AthleteUpsertWithoutAttemptInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AttemptUpdateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"discipline","inputType":[{"type":"Discipline","kind":"enum","isRequired":false,"isList":false}]},{"name":"date","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"index","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"weight","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"valid","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"done","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"resign","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"athlete","inputType":[{"type":"AthleteUpdateOneRequiredWithoutAttemptInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AttemptUpdateManyMutationInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"discipline","inputType":[{"type":"Discipline","kind":"enum","isRequired":false,"isList":false}]},{"name":"date","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"index","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"weight","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"valid","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"done","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"resign","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]}]},{"name":"AthleteCreateWithoutWeightClassInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"athleteNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"gender","inputType":[{"type":"Gender","kind":"enum","isRequired":true,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"birthday","inputType":[{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}]},{"name":"total","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"norm","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"lateRegistration","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"price","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"bodyWeight","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"wilks","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"dots","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"los","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KB1","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KB2","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KB3","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"BD1","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"BD2","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"BD3","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KH1","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KH2","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KH3","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"points","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"place","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"nextAttemptsSortKeys","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"resultClassId","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"event","inputType":[{"type":"EventCreateOneWithoutAthleteInput","kind":"object","isRequired":true,"isList":false}]},{"name":"ageClass","inputType":[{"type":"AgeClassCreateOneWithoutAthleteInput","kind":"object","isRequired":true,"isList":false}]},{"name":"attempt","inputType":[{"type":"AttemptCreateManyWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteCreateManyWithoutWeightClassInput","fields":[{"name":"create","inputType":[{"type":"AthleteCreateWithoutWeightClassInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"WeightClassCreateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"gender","inputType":[{"type":"Gender","kind":"enum","isRequired":true,"isList":false}]},{"name":"min","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"max","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"athlete","inputType":[{"type":"AthleteCreateManyWithoutWeightClassInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteUpdateWithoutWeightClassDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"athleteNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"gender","inputType":[{"type":"Gender","kind":"enum","isRequired":false,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"birthday","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"total","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"norm","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lateRegistration","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"price","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"bodyWeight","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"wilks","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"dots","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"los","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"points","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"place","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"nextAttemptsSortKeys","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"resultClassId","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"event","inputType":[{"type":"EventUpdateOneRequiredWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]},{"name":"ageClass","inputType":[{"type":"AgeClassUpdateOneRequiredWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]},{"name":"attempt","inputType":[{"type":"AttemptUpdateManyWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteUpdateWithWhereUniqueWithoutWeightClassInput","fields":[{"name":"where","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"AthleteUpdateWithoutWeightClassDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteUpsertWithWhereUniqueWithoutWeightClassInput","fields":[{"name":"where","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"AthleteUpdateWithoutWeightClassDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"AthleteCreateWithoutWeightClassInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteUpdateManyWithoutWeightClassInput","fields":[{"name":"create","inputType":[{"type":"AthleteCreateWithoutWeightClassInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"set","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"disconnect","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"delete","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"update","inputType":[{"type":"AthleteUpdateWithWhereUniqueWithoutWeightClassInput","kind":"object","isRequired":false,"isList":true}]},{"name":"updateMany","inputType":[{"type":"AthleteUpdateManyWithWhereNestedInput","kind":"object","isRequired":false,"isList":true}]},{"name":"deleteMany","inputType":[{"type":"AthleteScalarWhereInput","kind":"object","isRequired":false,"isList":true}]},{"name":"upsert","inputType":[{"type":"AthleteUpsertWithWhereUniqueWithoutWeightClassInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"WeightClassUpdateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"gender","inputType":[{"type":"Gender","kind":"enum","isRequired":false,"isList":false}]},{"name":"min","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"max","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"athlete","inputType":[{"type":"AthleteUpdateManyWithoutWeightClassInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"WeightClassUpdateManyMutationInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"gender","inputType":[{"type":"Gender","kind":"enum","isRequired":false,"isList":false}]},{"name":"min","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"max","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}]},{"name":"AthleteCreateWithoutAgeClassInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"athleteNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"gender","inputType":[{"type":"Gender","kind":"enum","isRequired":true,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"birthday","inputType":[{"type":"DateTime","kind":"scalar","isRequired":true,"isList":false}]},{"name":"total","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"norm","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"lateRegistration","inputType":[{"type":"Boolean","kind":"scalar","isRequired":true,"isList":false}]},{"name":"price","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"bodyWeight","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"wilks","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"dots","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"los","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KB1","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KB2","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KB3","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"BD1","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"BD2","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"BD3","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KH1","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KH2","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"KH3","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"points","inputType":[{"type":"Float","kind":"scalar","isRequired":true,"isList":false}]},{"name":"place","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"nextAttemptsSortKeys","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"resultClassId","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"event","inputType":[{"type":"EventCreateOneWithoutAthleteInput","kind":"object","isRequired":true,"isList":false}]},{"name":"weightClass","inputType":[{"type":"WeightClassCreateOneWithoutAthleteInput","kind":"object","isRequired":true,"isList":false}]},{"name":"attempt","inputType":[{"type":"AttemptCreateManyWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteCreateManyWithoutAgeClassInput","fields":[{"name":"create","inputType":[{"type":"AthleteCreateWithoutAgeClassInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"AgeClassCreateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"sortId","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"athlete","inputType":[{"type":"AthleteCreateManyWithoutAgeClassInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteUpdateWithoutAgeClassDataInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"raw","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"athleteNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"gender","inputType":[{"type":"Gender","kind":"enum","isRequired":false,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"birthday","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"total","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"norm","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lateRegistration","inputType":[{"type":"Boolean","kind":"scalar","isRequired":false,"isList":false}]},{"name":"price","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"bodyWeight","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"wilks","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"dots","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"los","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KB3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"BD3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH1","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH2","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"KH3","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"points","inputType":[{"type":"Float","kind":"scalar","isRequired":false,"isList":false}]},{"name":"place","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"nextAttemptsSortKeys","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"resultClassId","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"event","inputType":[{"type":"EventUpdateOneRequiredWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]},{"name":"weightClass","inputType":[{"type":"WeightClassUpdateOneRequiredWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]},{"name":"attempt","inputType":[{"type":"AttemptUpdateManyWithoutAthleteInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AthleteUpdateWithWhereUniqueWithoutAgeClassInput","fields":[{"name":"where","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"data","inputType":[{"type":"AthleteUpdateWithoutAgeClassDataInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteUpsertWithWhereUniqueWithoutAgeClassInput","fields":[{"name":"where","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":true,"isList":false}]},{"name":"update","inputType":[{"type":"AthleteUpdateWithoutAgeClassDataInput","kind":"object","isRequired":true,"isList":false}]},{"name":"create","inputType":[{"type":"AthleteCreateWithoutAgeClassInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"AthleteUpdateManyWithoutAgeClassInput","fields":[{"name":"create","inputType":[{"type":"AthleteCreateWithoutAgeClassInput","kind":"object","isRequired":false,"isList":true}]},{"name":"connect","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"set","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"disconnect","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"delete","inputType":[{"type":"AthleteWhereUniqueInput","kind":"object","isRequired":false,"isList":true}]},{"name":"update","inputType":[{"type":"AthleteUpdateWithWhereUniqueWithoutAgeClassInput","kind":"object","isRequired":false,"isList":true}]},{"name":"updateMany","inputType":[{"type":"AthleteUpdateManyWithWhereNestedInput","kind":"object","isRequired":false,"isList":true}]},{"name":"deleteMany","inputType":[{"type":"AthleteScalarWhereInput","kind":"object","isRequired":false,"isList":true}]},{"name":"upsert","inputType":[{"type":"AthleteUpsertWithWhereUniqueWithoutAgeClassInput","kind":"object","isRequired":false,"isList":true}]}]},{"name":"AgeClassUpdateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"sortId","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"athlete","inputType":[{"type":"AthleteUpdateManyWithoutAgeClassInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"AgeClassUpdateManyMutationInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"name","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"sortId","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}]},{"name":"OfficialCreateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"officalNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"license","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"position","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":true,"isList":false}]},{"name":"event","inputType":[{"type":"EventCreateOneWithoutOfficialInput","kind":"object","isRequired":true,"isList":false}]},{"name":"officialSlot","inputType":[{"type":"OfficialSlotCreateManyWithoutOfficialInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"OfficialUpdateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"officalNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"license","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"position","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"event","inputType":[{"type":"EventUpdateOneRequiredWithoutOfficialInput","kind":"object","isRequired":false,"isList":false}]},{"name":"officialSlot","inputType":[{"type":"OfficialSlotUpdateManyWithoutOfficialInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"OfficialUpdateManyMutationInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"officalNumber","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]},{"name":"lastName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"firstName","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"club","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"license","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"position","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"location","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"importId","inputType":[{"type":"Int","kind":"scalar","isRequired":false,"isList":false}]}]},{"name":"OfficialSlotCreateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"position","inputType":[{"type":"Position","kind":"enum","isRequired":true,"isList":false}]},{"name":"official","inputType":[{"type":"OfficialCreateOneWithoutOfficialSlotInput","kind":"object","isRequired":true,"isList":false}]},{"name":"slot","inputType":[{"type":"SlotCreateOneWithoutOfficialSlotInput","kind":"object","isRequired":true,"isList":false}]}]},{"name":"OfficialSlotUpdateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"position","inputType":[{"type":"Position","kind":"enum","isRequired":false,"isList":false}]},{"name":"official","inputType":[{"type":"OfficialUpdateOneRequiredWithoutOfficialSlotInput","kind":"object","isRequired":false,"isList":false}]},{"name":"slot","inputType":[{"type":"SlotUpdateOneRequiredWithoutOfficialSlotInput","kind":"object","isRequired":false,"isList":false}]}]},{"name":"OfficialSlotUpdateManyMutationInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"position","inputType":[{"type":"Position","kind":"enum","isRequired":false,"isList":false}]}]},{"name":"UserCreateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"role","inputType":[{"type":"Role","kind":"enum","isRequired":false,"isList":false}]},{"name":"username","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"passwordHash","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]},{"name":"salt","inputType":[{"type":"String","kind":"scalar","isRequired":true,"isList":false}]}]},{"name":"UserUpdateInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"role","inputType":[{"type":"Role","kind":"enum","isRequired":false,"isList":false}]},{"name":"username","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"passwordHash","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"salt","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}]},{"name":"UserUpdateManyMutationInput","fields":[{"name":"id","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"createdAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"updatedAt","inputType":[{"type":"DateTime","kind":"scalar","isRequired":false,"isList":false}]},{"name":"role","inputType":[{"type":"Role","kind":"enum","isRequired":false,"isList":false}]},{"name":"username","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"passwordHash","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]},{"name":"salt","inputType":[{"type":"String","kind":"scalar","isRequired":false,"isList":false}]}]},{"name":"UUIDFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"},{"isList":false,"isRequired":false,"kind":"scalar","type":"UUIDFilter"}]},{"name":"in","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"UUID"}]},{"name":"notIn","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"UUID"}]},{"name":"lt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"}]},{"name":"lte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"}]},{"name":"gt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"}]},{"name":"gte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"}]},{"name":"contains","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"}]},{"name":"startsWith","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"}]},{"name":"endsWith","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"UUID"}]}],"atLeastOne":false},{"name":"DateTimeFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"},{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTimeFilter"}]},{"name":"in","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"DateTime"}]},{"name":"notIn","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"DateTime"}]},{"name":"lt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"}]},{"name":"lte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"}]},{"name":"gt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"}]},{"name":"gte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"DateTime"}]}],"atLeastOne":false},{"name":"StringFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"},{"isList":false,"isRequired":false,"kind":"scalar","type":"StringFilter"}]},{"name":"in","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"notIn","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"lt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"lte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"gt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"gte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"contains","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"startsWith","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]},{"name":"endsWith","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"String"}]}],"atLeastOne":false},{"name":"GenderFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Gender"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Gender"},{"isList":false,"isRequired":false,"kind":"enum","type":"GenderFilter"}]},{"name":"in","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"enum","type":"Gender"}]},{"name":"notIn","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"enum","type":"Gender"}]}],"atLeastOne":false},{"name":"FloatFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"},{"isList":false,"isRequired":false,"kind":"scalar","type":"FloatFilter"}]},{"name":"in","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"Float"}]},{"name":"notIn","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"Float"}]},{"name":"lt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"}]},{"name":"lte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"}]},{"name":"gt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"}]},{"name":"gte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Float"}]}],"atLeastOne":false},{"name":"IntFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"},{"isList":false,"isRequired":false,"kind":"scalar","type":"IntFilter"}]},{"name":"in","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"Int"}]},{"name":"notIn","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"scalar","type":"Int"}]},{"name":"lt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"}]},{"name":"lte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"}]},{"name":"gt","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"}]},{"name":"gte","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Int"}]}],"atLeastOne":false},{"name":"AthleteFilter","fields":[{"name":"every","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"AthleteWhereInput"}]},{"name":"some","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"AthleteWhereInput"}]},{"name":"none","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"AthleteWhereInput"}]}],"atLeastOne":false},{"name":"DisciplineFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Discipline"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Discipline"},{"isList":false,"isRequired":false,"kind":"enum","type":"DisciplineFilter"}]},{"name":"in","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"enum","type":"Discipline"}]},{"name":"notIn","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"enum","type":"Discipline"}]}],"atLeastOne":false},{"name":"BooleanFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"scalar","type":"Boolean"},{"isList":false,"isRequired":false,"kind":"scalar","type":"BooleanFilter"}]}],"atLeastOne":false},{"name":"AttemptFilter","fields":[{"name":"every","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"AttemptWhereInput"}]},{"name":"some","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"AttemptWhereInput"}]},{"name":"none","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"AttemptWhereInput"}]}],"atLeastOne":false},{"name":"OfficialSlotFilter","fields":[{"name":"every","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"OfficialSlotWhereInput"}]},{"name":"some","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"OfficialSlotWhereInput"}]},{"name":"none","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"OfficialSlotWhereInput"}]}],"atLeastOne":false},{"name":"PositionFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Position"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Position"},{"isList":false,"isRequired":false,"kind":"enum","type":"PositionFilter"}]},{"name":"in","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"enum","type":"Position"}]},{"name":"notIn","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"enum","type":"Position"}]}],"atLeastOne":false},{"name":"AthleteGroupFilter","fields":[{"name":"every","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"AthleteGroupWhereInput"}]},{"name":"some","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"AthleteGroupWhereInput"}]},{"name":"none","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"AthleteGroupWhereInput"}]}],"atLeastOne":false},{"name":"ContestTypeFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"ContestType"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"ContestType"},{"isList":false,"isRequired":false,"kind":"enum","type":"ContestTypeFilter"}]},{"name":"in","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"enum","type":"ContestType"}]},{"name":"notIn","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"enum","type":"ContestType"}]}],"atLeastOne":false},{"name":"SlotFilter","fields":[{"name":"every","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"SlotWhereInput"}]},{"name":"some","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"SlotWhereInput"}]},{"name":"none","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"SlotWhereInput"}]}],"atLeastOne":false},{"name":"OfficialFilter","fields":[{"name":"every","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"OfficialWhereInput"}]},{"name":"some","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"OfficialWhereInput"}]},{"name":"none","isRelationFilter":true,"inputType":[{"isList":false,"isRequired":false,"kind":"object","type":"OfficialWhereInput"}]}],"atLeastOne":false},{"name":"RoleFilter","fields":[{"name":"equals","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Role"}]},{"name":"not","isRelationFilter":false,"inputType":[{"isList":false,"isRequired":false,"kind":"enum","type":"Role"},{"isList":false,"isRequired":false,"kind":"enum","type":"RoleFilter"}]},{"name":"in","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"enum","type":"Role"}]},{"name":"notIn","isRelationFilter":false,"inputType":[{"isList":true,"isRequired":false,"kind":"enum","type":"Role"}]}],"atLeastOne":false},{"name":"EventOrderByInput","atLeastOne":true,"atMostOne":true,"isOrderType":true,"fields":[{"name":"id","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"name","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"discipline","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"contestType","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false}]},{"name":"AthleteOrderByInput","atLeastOne":true,"atMostOne":true,"isOrderType":true,"fields":[{"name":"id","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"raw","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"athleteNumber","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"firstName","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"lastName","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"gender","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"club","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"birthday","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"total","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"norm","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"lateRegistration","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"price","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"bodyWeight","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"wilks","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"dots","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"los","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"KB1","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"KB2","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"KB3","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"BD1","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"BD2","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"BD3","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"KH1","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"KH2","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"KH3","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"points","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"place","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"location","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"nextAttemptsSortKeys","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"importId","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"event","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"eventId","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"weightClass","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"weightClassId","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"ageClass","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"ageClassId","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"resultClassId","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false}]},{"name":"AttemptOrderByInput","atLeastOne":true,"atMostOne":true,"isOrderType":true,"fields":[{"name":"id","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"discipline","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"date","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"index","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"weight","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"raw","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"valid","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"done","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"resign","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"athlete","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"athleteId","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false}]},{"name":"SlotOrderByInput","atLeastOne":true,"atMostOne":true,"isOrderType":true,"fields":[{"name":"id","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"name","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"event","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"eventId","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false}]},{"name":"AthleteGroupOrderByInput","atLeastOne":true,"atMostOne":true,"isOrderType":true,"fields":[{"name":"id","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"name","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"event","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"eventId","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"slot","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"slotId","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false}]},{"name":"OfficialSlotOrderByInput","atLeastOne":true,"atMostOne":true,"isOrderType":true,"fields":[{"name":"id","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"position","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"official","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"officialId","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"slot","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"slotId","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false}]},{"name":"OfficialOrderByInput","atLeastOne":true,"atMostOne":true,"isOrderType":true,"fields":[{"name":"id","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"officalNumber","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"lastName","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"firstName","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"club","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"license","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"position","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"location","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"importId","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"event","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"eventId","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false}]},{"name":"WeightClassOrderByInput","atLeastOne":true,"atMostOne":true,"isOrderType":true,"fields":[{"name":"id","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"name","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"gender","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"min","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"max","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false}]},{"name":"AgeClassOrderByInput","atLeastOne":true,"atMostOne":true,"isOrderType":true,"fields":[{"name":"id","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"name","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"sortId","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false}]},{"name":"UserOrderByInput","atLeastOne":true,"atMostOne":true,"isOrderType":true,"fields":[{"name":"id","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"createdAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"updatedAt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"role","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"username","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"passwordHash","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false},{"name":"salt","inputType":[{"type":"OrderByArg","isList":false,"isRequired":false,"kind":"enum"}],"isRelationFilter":false}]}]}}'

// We are parsing 2 times, as we want independent objects, because
// DMMFClass introduces circular references in the dmmf object
const dmmf = JSON.parse(dmmfString)
exports.dmmf = JSON.parse(dmmfString)
    