import {
  DMMF,
  DMMFClass,
  Engine,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
} from './runtime';

export { PrismaClientKnownRequestError }
export { PrismaClientUnknownRequestError }
export { PrismaClientRustPanicError }
export { PrismaClientInitializationError }
export { PrismaClientValidationError }

/**
 * Query Engine version: latest
 */

/**
 * Utility Types
 */

/**
 * Get the type of the value, that the Promise holds.
 */
export declare type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

/**
 * Get the return type of a function which returns a Promise.
 */
export declare type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>


export declare type Enumerable<T> = T | Array<T>;
export declare type MergeTruthyValues<R extends object, S extends object> = {
  [key in keyof S | keyof R]: key extends false ? never : key extends keyof S ? S[key] extends false ? never : S[key] : key extends keyof R ? R[key] : never;
};
export declare type CleanupNever<T> = {
  [key in keyof T]: T[key] extends never ? never : key;
}[keyof T];
/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export declare type Subset<T, U> = {
  [key in keyof T]: key extends keyof U ? T[key] : never;
};
declare class PrismaClientFetcher {
  private readonly prisma;
  private readonly debug;
  private readonly hooks?;
  constructor(prisma: PrismaClient<any, any>, debug?: boolean, hooks?: Hooks | undefined);
  request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string, collectTimestamps?: any): Promise<T>;
  sanitizeMessage(message: string): string;
  protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
}


/**
 * Client
**/


export type Datasources = {
  db?: string
}

export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

export interface PrismaClientOptions {
  datasources?: Datasources

  /**
   * @default "pretty"
   */
  errorFormat?: ErrorFormat

  log?: Array<LogLevel | LogDefinition>

  /**
   * You probably don't want to use this. `__internal` is used by internal tooling.
   */
  __internal?: {
    debug?: boolean
    hooks?: Hooks
    engine?: {
      cwd?: string
      binaryPath?: string
    }
    measurePerformance?: boolean
  }
}

export type Hooks = {
  beforeRequest?: (options: {query: string, path: string[], rootField?: string, typeName?: string, document: any}) => any
}

/* Types for Logging */
export type LogLevel = 'info' | 'query' | 'warn'
export type LogDefinition = {
  level: LogLevel
  emit: 'stdout' | 'event'
}

export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
export type GetEvents<T extends Array<LogLevel | LogDefinition>> = GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]>

export type QueryEvent = {
  timestamp: Date
  query: string
  params: string
  duration: number
  target: string
}

export type LogEvent = {
  timestamp: Date
  message: string
  target: string
}
/* End Types for Logging */

// tested in getLogLevel.test.ts
export declare function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

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
export declare class PrismaClient<T extends PrismaClientOptions = {}, U = keyof T extends 'log' ? T['log'] extends Array<LogLevel | LogDefinition> ? GetEvents<T['log']> : never : never> {
  /**
   * @private
   */
  private fetcher;
  /**
   * @private
   */
  private readonly dmmf;
  /**
   * @private
   */
  private connectionPromise?;
  /**
   * @private
   */
  private disconnectionPromise?;
  /**
   * @private
   */
  private readonly engineConfig;
  /**
   * @private
   */
  private readonly measurePerformance;
  /**
   * @private
   */
  private engine: Engine;
  /**
   * @private
   */
  private errorFormat: ErrorFormat;

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
  constructor(optionsArg?: T);
  on<V extends U>(eventType: V, callback: V extends never ? never : (event: V extends 'query' ? QueryEvent : LogEvent) => void): void;
  /**
   * Connect with the database
   */
  connect(): Promise<void>;
  /**
   * @private
   */
  private runDisconnect;
  /**
   * Disconnect from the database
   */
  disconnect(): Promise<any>;
  /**
   * Makes a raw query
   * @example
   * ```
   * // Fetch all entries from the `User` table
   * const result = await prisma.raw`SELECT * FROM User;`
   * // Or
   * const result = await prisma.raw('SELECT * FROM User;')
  * ```
  * 
  * Read more in our [docs](https://github.com/prisma/prisma2/blob/master/docs/prisma-client-js/api.md#raw-database-access).
  */
  raw<T = any>(query: string | TemplateStringsArray): Promise<T>;

  /**
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.event.findMany()
    * ```
    */
  get event(): EventDelegate;

  /**
   * `prisma.athlete`: Exposes CRUD operations for the **Athlete** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Athletes
    * const athletes = await prisma.athlete.findMany()
    * ```
    */
  get athlete(): AthleteDelegate;

  /**
   * `prisma.slot`: Exposes CRUD operations for the **Slot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Slots
    * const slots = await prisma.slot.findMany()
    * ```
    */
  get slot(): SlotDelegate;

  /**
   * `prisma.athleteGroup`: Exposes CRUD operations for the **AthleteGroup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AthleteGroups
    * const athleteGroups = await prisma.athleteGroup.findMany()
    * ```
    */
  get athleteGroup(): AthleteGroupDelegate;

  /**
   * `prisma.attempt`: Exposes CRUD operations for the **Attempt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Attempts
    * const attempts = await prisma.attempt.findMany()
    * ```
    */
  get attempt(): AttemptDelegate;

  /**
   * `prisma.weightClass`: Exposes CRUD operations for the **WeightClass** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WeightClasses
    * const weightClasses = await prisma.weightClass.findMany()
    * ```
    */
  get weightClass(): WeightClassDelegate;

  /**
   * `prisma.ageClass`: Exposes CRUD operations for the **AgeClass** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgeClasses
    * const ageClasses = await prisma.ageClass.findMany()
    * ```
    */
  get ageClass(): AgeClassDelegate;

  /**
   * `prisma.official`: Exposes CRUD operations for the **Official** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Officials
    * const officials = await prisma.official.findMany()
    * ```
    */
  get official(): OfficialDelegate;

  /**
   * `prisma.officialSlot`: Exposes CRUD operations for the **OfficialSlot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OfficialSlots
    * const officialSlots = await prisma.officialSlot.findMany()
    * ```
    */
  get officialSlot(): OfficialSlotDelegate;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): UserDelegate;
}



/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export declare const OrderByArg: {
  asc: 'asc',
  desc: 'desc'
};

export declare type OrderByArg = (typeof OrderByArg)[keyof typeof OrderByArg]


export declare const Discipline: {
  POWERLIFTING: 'POWERLIFTING',
  SQUAT: 'SQUAT',
  BENCHPRESS: 'BENCHPRESS',
  DEADLIFT: 'DEADLIFT'
};

export declare type Discipline = (typeof Discipline)[keyof typeof Discipline]


export declare const ContestType: {
  SINGLE: 'SINGLE',
  TEAM: 'TEAM'
};

export declare type ContestType = (typeof ContestType)[keyof typeof ContestType]


export declare const Gender: {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
};

export declare type Gender = (typeof Gender)[keyof typeof Gender]


export declare const Position: {
  SEITENKAMPFRICHTER: 'SEITENKAMPFRICHTER'
};

export declare type Position = (typeof Position)[keyof typeof Position]


export declare const Role: {
  ADMIN: 'ADMIN',
  USER: 'USER',
  GUEST: 'GUEST'
};

export declare type Role = (typeof Role)[keyof typeof Role]



/**
 * Model Event
 */

export type Event = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  discipline: Discipline
  contestType: ContestType
}

export type EventScalars = 'id' | 'createdAt' | 'updatedAt' | 'name' | 'discipline' | 'contestType'
  

export type EventSelect = {
  id?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  name?: boolean
  discipline?: boolean
  contestType?: boolean
  athletes?: boolean | FindManyAthleteSelectArgsOptional
  slots?: boolean | FindManySlotSelectArgsOptional
  athleteGroups?: boolean | FindManyAthleteGroupSelectArgsOptional
  officials?: boolean | FindManyOfficialSelectArgsOptional
}

export type EventInclude = {
  athletes?: boolean | FindManyAthleteIncludeArgsOptional
  slots?: boolean | FindManySlotIncludeArgsOptional
  athleteGroups?: boolean | FindManyAthleteGroupIncludeArgsOptional
  officials?: boolean | FindManyOfficialIncludeArgsOptional
}

type EventDefault = {
  id: true
  createdAt: true
  updatedAt: true
  name: true
  discipline: true
  contestType: true
}


export type EventGetSelectPayload<S extends boolean | EventSelect> = S extends true
  ? Event
  : S extends EventSelect
  ? {
      [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends EventScalars
        ? Event[P]
        : P extends 'athletes'
        ? Array<AthleteGetSelectPayload<ExtractFindManyAthleteSelectArgs<S[P]>>>
        : P extends 'slots'
        ? Array<SlotGetSelectPayload<ExtractFindManySlotSelectArgs<S[P]>>>
        : P extends 'athleteGroups'
        ? Array<AthleteGroupGetSelectPayload<ExtractFindManyAthleteGroupSelectArgs<S[P]>>>
        : P extends 'officials'
        ? Array<OfficialGetSelectPayload<ExtractFindManyOfficialSelectArgs<S[P]>>>
        : never
    }
   : never

export type EventGetIncludePayload<S extends boolean | EventInclude> = S extends true
  ? Event
  : S extends EventInclude
  ? {
      [P in CleanupNever<MergeTruthyValues<EventDefault, S>>]: P extends EventScalars
        ? Event[P]
        : P extends 'athletes'
        ? Array<AthleteGetIncludePayload<ExtractFindManyAthleteIncludeArgs<S[P]>>>
        : P extends 'slots'
        ? Array<SlotGetIncludePayload<ExtractFindManySlotIncludeArgs<S[P]>>>
        : P extends 'athleteGroups'
        ? Array<AthleteGroupGetIncludePayload<ExtractFindManyAthleteGroupIncludeArgs<S[P]>>>
        : P extends 'officials'
        ? Array<OfficialGetIncludePayload<ExtractFindManyOfficialIncludeArgs<S[P]>>>
        : never
    }
   : never

export interface EventDelegate {
  /**
   * Find zero or one Event.
   * @param {FindOneEventArgs} args - Arguments to find a Event
   * @example
   * // Get one Event
   * const event = await prisma.event.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneEventArgs>(
    args: Subset<T, FindOneEventArgs>
  ): T extends FindOneEventArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneEventSelectArgs ? Promise<EventGetSelectPayload<ExtractFindOneEventSelectArgs<T>> | null>
  : T extends FindOneEventIncludeArgs ? Promise<EventGetIncludePayload<ExtractFindOneEventIncludeArgs<T>> | null> : EventClient<Event | null>
  /**
   * Find zero or more Events.
   * @param {FindManyEventArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Events
   * const events = await prisma.event.findMany()
   * 
   * // Get first 10 Events
   * const events = await prisma.event.findMany({ first: 10 })
   * 
   * // Only select the `id`
   * const eventWithIdOnly = await prisma.event.findMany({ select: { id: true } })
   * 
  **/
  findMany<T extends FindManyEventArgs>(
    args?: Subset<T, FindManyEventArgs>
  ): T extends FindManyEventArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyEventSelectArgs
  ? Promise<Array<EventGetSelectPayload<ExtractFindManyEventSelectArgs<T>>>> : T extends FindManyEventIncludeArgs
  ? Promise<Array<EventGetIncludePayload<ExtractFindManyEventIncludeArgs<T>>>> : Promise<Array<Event>>
  /**
   * Create a Event.
   * @param {EventCreateArgs} args - Arguments to create a Event.
   * @example
   * // Create one Event
   * const user = await prisma.event.create({
   *   data: {
   *     // ... data to create a Event
   *   }
   * })
   * 
  **/
  create<T extends EventCreateArgs>(
    args: Subset<T, EventCreateArgs>
  ): T extends EventCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends EventSelectCreateArgs ? Promise<EventGetSelectPayload<ExtractEventSelectCreateArgs<T>>>
  : T extends EventIncludeCreateArgs ? Promise<EventGetIncludePayload<ExtractEventIncludeCreateArgs<T>>> : EventClient<Event>
  /**
   * Delete a Event.
   * @param {EventDeleteArgs} args - Arguments to delete one Event.
   * @example
   * // Delete one Event
   * const user = await prisma.event.delete({
   *   where: {
   *     // ... filter to delete one Event
   *   }
   * })
   * 
  **/
  delete<T extends EventDeleteArgs>(
    args: Subset<T, EventDeleteArgs>
  ): T extends EventDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends EventSelectDeleteArgs ? Promise<EventGetSelectPayload<ExtractEventSelectDeleteArgs<T>>>
  : T extends EventIncludeDeleteArgs ? Promise<EventGetIncludePayload<ExtractEventIncludeDeleteArgs<T>>> : EventClient<Event>
  /**
   * Update one Event.
   * @param {EventUpdateArgs} args - Arguments to update one Event.
   * @example
   * // Update one Event
   * const event = await prisma.event.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends EventUpdateArgs>(
    args: Subset<T, EventUpdateArgs>
  ): T extends EventUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends EventSelectUpdateArgs ? Promise<EventGetSelectPayload<ExtractEventSelectUpdateArgs<T>>>
  : T extends EventIncludeUpdateArgs ? Promise<EventGetIncludePayload<ExtractEventIncludeUpdateArgs<T>>> : EventClient<Event>
  /**
   * Delete zero or more Events.
   * @param {EventDeleteManyArgs} args - Arguments to filter Events to delete.
   * @example
   * // Delete a few Events
   * const { count } = await prisma.event.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends EventDeleteManyArgs>(
    args: Subset<T, EventDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Events.
   * @param {EventUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Events
   * const event = await prisma.event.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  updateMany<T extends EventUpdateManyArgs>(
    args: Subset<T, EventUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one Event.
   * @param {EventUpsertArgs} args - Arguments to update or create a Event.
   * @example
   * // Update or create a Event
   * const event = await prisma.event.upsert({
   *   create: {
   *     // ... data to create a Event
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Event we want to update
   *   }
   * })
  **/
  upsert<T extends EventUpsertArgs>(
    args: Subset<T, EventUpsertArgs>
  ): T extends EventUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends EventSelectUpsertArgs ? Promise<EventGetSelectPayload<ExtractEventSelectUpsertArgs<T>>>
  : T extends EventIncludeUpsertArgs ? Promise<EventGetIncludePayload<ExtractEventIncludeUpsertArgs<T>>> : EventClient<Event>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class EventClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  private _collectTimestamps?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  athletes<T extends FindManyAthleteArgs = {}>(args?: Subset<T, FindManyAthleteArgs>): T extends FindManyAthleteArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyAthleteSelectArgs
  ? Promise<Array<AthleteGetSelectPayload<ExtractFindManyAthleteSelectArgs<T>>>> : T extends FindManyAthleteIncludeArgs
  ? Promise<Array<AthleteGetIncludePayload<ExtractFindManyAthleteIncludeArgs<T>>>> : Promise<Array<Athlete>>;

  slots<T extends FindManySlotArgs = {}>(args?: Subset<T, FindManySlotArgs>): T extends FindManySlotArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManySlotSelectArgs
  ? Promise<Array<SlotGetSelectPayload<ExtractFindManySlotSelectArgs<T>>>> : T extends FindManySlotIncludeArgs
  ? Promise<Array<SlotGetIncludePayload<ExtractFindManySlotIncludeArgs<T>>>> : Promise<Array<Slot>>;

  athleteGroups<T extends FindManyAthleteGroupArgs = {}>(args?: Subset<T, FindManyAthleteGroupArgs>): T extends FindManyAthleteGroupArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyAthleteGroupSelectArgs
  ? Promise<Array<AthleteGroupGetSelectPayload<ExtractFindManyAthleteGroupSelectArgs<T>>>> : T extends FindManyAthleteGroupIncludeArgs
  ? Promise<Array<AthleteGroupGetIncludePayload<ExtractFindManyAthleteGroupIncludeArgs<T>>>> : Promise<Array<AthleteGroup>>;

  officials<T extends FindManyOfficialArgs = {}>(args?: Subset<T, FindManyOfficialArgs>): T extends FindManyOfficialArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyOfficialSelectArgs
  ? Promise<Array<OfficialGetSelectPayload<ExtractFindManyOfficialSelectArgs<T>>>> : T extends FindManyOfficialIncludeArgs
  ? Promise<Array<OfficialGetIncludePayload<ExtractFindManyOfficialIncludeArgs<T>>>> : Promise<Array<Official>>;

  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * Event findOne
 */
export type FindOneEventArgs = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select?: EventSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: EventInclude | null
  /**
   * Filter, which Event to fetch.
  **/
  where: EventWhereUniqueInput
}

export type FindOneEventArgsRequired = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select: EventSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: EventInclude
  /**
   * Filter, which Event to fetch.
  **/
  where: EventWhereUniqueInput
}

export type FindOneEventSelectArgs = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select: EventSelect
  /**
   * Filter, which Event to fetch.
  **/
  where: EventWhereUniqueInput
}

export type FindOneEventSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select?: EventSelect | null
  /**
   * Filter, which Event to fetch.
  **/
  where: EventWhereUniqueInput
}

export type FindOneEventIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: EventInclude
  /**
   * Filter, which Event to fetch.
  **/
  where: EventWhereUniqueInput
}

export type FindOneEventIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: EventInclude | null
  /**
   * Filter, which Event to fetch.
  **/
  where: EventWhereUniqueInput
}

export type ExtractFindOneEventSelectArgs<S extends undefined | boolean | FindOneEventSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneEventSelectArgs
  ? S['select']
  : true

export type ExtractFindOneEventIncludeArgs<S extends undefined | boolean | FindOneEventIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneEventIncludeArgs
  ? S['include']
  : true



/**
 * Event findMany
 */
export type FindManyEventArgs = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select?: EventSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: EventInclude | null
  /**
   * Filter, which Events to fetch.
  **/
  where?: EventWhereInput | null
  /**
   * Determine the order of the Events to fetch.
  **/
  orderBy?: EventOrderByInput | null
  /**
   * Skip the first `n` Events.
  **/
  skip?: number | null
  /**
   * Get all Events that come after the Event you provide with the current order.
  **/
  after?: EventWhereUniqueInput | null
  /**
   * Get all Events that come before the Event you provide with the current order.
  **/
  before?: EventWhereUniqueInput | null
  /**
   * Get the first `n` Events.
  **/
  first?: number | null
  /**
   * Get the last `n` Events.
  **/
  last?: number | null
}

export type FindManyEventArgsRequired = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select: EventSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: EventInclude
  /**
   * Filter, which Events to fetch.
  **/
  where?: EventWhereInput | null
  /**
   * Determine the order of the Events to fetch.
  **/
  orderBy?: EventOrderByInput | null
  /**
   * Skip the first `n` Events.
  **/
  skip?: number | null
  /**
   * Get all Events that come after the Event you provide with the current order.
  **/
  after?: EventWhereUniqueInput | null
  /**
   * Get all Events that come before the Event you provide with the current order.
  **/
  before?: EventWhereUniqueInput | null
  /**
   * Get the first `n` Events.
  **/
  first?: number | null
  /**
   * Get the last `n` Events.
  **/
  last?: number | null
}

export type FindManyEventSelectArgs = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select: EventSelect
  /**
   * Filter, which Events to fetch.
  **/
  where?: EventWhereInput | null
  /**
   * Determine the order of the Events to fetch.
  **/
  orderBy?: EventOrderByInput | null
  /**
   * Skip the first `n` Events.
  **/
  skip?: number | null
  /**
   * Get all Events that come after the Event you provide with the current order.
  **/
  after?: EventWhereUniqueInput | null
  /**
   * Get all Events that come before the Event you provide with the current order.
  **/
  before?: EventWhereUniqueInput | null
  /**
   * Get the first `n` Events.
  **/
  first?: number | null
  /**
   * Get the last `n` Events.
  **/
  last?: number | null
}

export type FindManyEventSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select?: EventSelect | null
  /**
   * Filter, which Events to fetch.
  **/
  where?: EventWhereInput | null
  /**
   * Determine the order of the Events to fetch.
  **/
  orderBy?: EventOrderByInput | null
  /**
   * Skip the first `n` Events.
  **/
  skip?: number | null
  /**
   * Get all Events that come after the Event you provide with the current order.
  **/
  after?: EventWhereUniqueInput | null
  /**
   * Get all Events that come before the Event you provide with the current order.
  **/
  before?: EventWhereUniqueInput | null
  /**
   * Get the first `n` Events.
  **/
  first?: number | null
  /**
   * Get the last `n` Events.
  **/
  last?: number | null
}

export type FindManyEventIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: EventInclude
  /**
   * Filter, which Events to fetch.
  **/
  where?: EventWhereInput | null
  /**
   * Determine the order of the Events to fetch.
  **/
  orderBy?: EventOrderByInput | null
  /**
   * Skip the first `n` Events.
  **/
  skip?: number | null
  /**
   * Get all Events that come after the Event you provide with the current order.
  **/
  after?: EventWhereUniqueInput | null
  /**
   * Get all Events that come before the Event you provide with the current order.
  **/
  before?: EventWhereUniqueInput | null
  /**
   * Get the first `n` Events.
  **/
  first?: number | null
  /**
   * Get the last `n` Events.
  **/
  last?: number | null
}

export type FindManyEventIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: EventInclude | null
  /**
   * Filter, which Events to fetch.
  **/
  where?: EventWhereInput | null
  /**
   * Determine the order of the Events to fetch.
  **/
  orderBy?: EventOrderByInput | null
  /**
   * Skip the first `n` Events.
  **/
  skip?: number | null
  /**
   * Get all Events that come after the Event you provide with the current order.
  **/
  after?: EventWhereUniqueInput | null
  /**
   * Get all Events that come before the Event you provide with the current order.
  **/
  before?: EventWhereUniqueInput | null
  /**
   * Get the first `n` Events.
  **/
  first?: number | null
  /**
   * Get the last `n` Events.
  **/
  last?: number | null
}

export type ExtractFindManyEventSelectArgs<S extends undefined | boolean | FindManyEventSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyEventSelectArgs
  ? S['select']
  : true

export type ExtractFindManyEventIncludeArgs<S extends undefined | boolean | FindManyEventIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyEventIncludeArgs
  ? S['include']
  : true



/**
 * Event create
 */
export type EventCreateArgs = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select?: EventSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: EventInclude | null
  /**
   * The data needed to create a Event.
  **/
  data: EventCreateInput
}

export type EventCreateArgsRequired = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select: EventSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: EventInclude
  /**
   * The data needed to create a Event.
  **/
  data: EventCreateInput
}

export type EventSelectCreateArgs = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select: EventSelect
  /**
   * The data needed to create a Event.
  **/
  data: EventCreateInput
}

export type EventSelectCreateArgsOptional = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select?: EventSelect | null
  /**
   * The data needed to create a Event.
  **/
  data: EventCreateInput
}

export type EventIncludeCreateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: EventInclude
  /**
   * The data needed to create a Event.
  **/
  data: EventCreateInput
}

export type EventIncludeCreateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: EventInclude | null
  /**
   * The data needed to create a Event.
  **/
  data: EventCreateInput
}

export type ExtractEventSelectCreateArgs<S extends undefined | boolean | EventSelectCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends EventSelectCreateArgs
  ? S['select']
  : true

export type ExtractEventIncludeCreateArgs<S extends undefined | boolean | EventIncludeCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends EventIncludeCreateArgs
  ? S['include']
  : true



/**
 * Event update
 */
export type EventUpdateArgs = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select?: EventSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: EventInclude | null
  /**
   * The data needed to update a Event.
  **/
  data: EventUpdateInput
  /**
   * Choose, which Event to update.
  **/
  where: EventWhereUniqueInput
}

export type EventUpdateArgsRequired = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select: EventSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: EventInclude
  /**
   * The data needed to update a Event.
  **/
  data: EventUpdateInput
  /**
   * Choose, which Event to update.
  **/
  where: EventWhereUniqueInput
}

export type EventSelectUpdateArgs = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select: EventSelect
  /**
   * The data needed to update a Event.
  **/
  data: EventUpdateInput
  /**
   * Choose, which Event to update.
  **/
  where: EventWhereUniqueInput
}

export type EventSelectUpdateArgsOptional = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select?: EventSelect | null
  /**
   * The data needed to update a Event.
  **/
  data: EventUpdateInput
  /**
   * Choose, which Event to update.
  **/
  where: EventWhereUniqueInput
}

export type EventIncludeUpdateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: EventInclude
  /**
   * The data needed to update a Event.
  **/
  data: EventUpdateInput
  /**
   * Choose, which Event to update.
  **/
  where: EventWhereUniqueInput
}

export type EventIncludeUpdateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: EventInclude | null
  /**
   * The data needed to update a Event.
  **/
  data: EventUpdateInput
  /**
   * Choose, which Event to update.
  **/
  where: EventWhereUniqueInput
}

export type ExtractEventSelectUpdateArgs<S extends undefined | boolean | EventSelectUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends EventSelectUpdateArgs
  ? S['select']
  : true

export type ExtractEventIncludeUpdateArgs<S extends undefined | boolean | EventIncludeUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends EventIncludeUpdateArgs
  ? S['include']
  : true



/**
 * Event updateMany
 */
export type EventUpdateManyArgs = {
  data: EventUpdateManyMutationInput
  where?: EventWhereInput | null
}


/**
 * Event upsert
 */
export type EventUpsertArgs = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select?: EventSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: EventInclude | null
  /**
   * The filter to search for the Event to update in case it exists.
  **/
  where: EventWhereUniqueInput
  /**
   * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
  **/
  create: EventCreateInput
  /**
   * In case the Event was found with the provided `where` argument, update it with this data.
  **/
  update: EventUpdateInput
}

export type EventUpsertArgsRequired = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select: EventSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: EventInclude
  /**
   * The filter to search for the Event to update in case it exists.
  **/
  where: EventWhereUniqueInput
  /**
   * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
  **/
  create: EventCreateInput
  /**
   * In case the Event was found with the provided `where` argument, update it with this data.
  **/
  update: EventUpdateInput
}

export type EventSelectUpsertArgs = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select: EventSelect
  /**
   * The filter to search for the Event to update in case it exists.
  **/
  where: EventWhereUniqueInput
  /**
   * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
  **/
  create: EventCreateInput
  /**
   * In case the Event was found with the provided `where` argument, update it with this data.
  **/
  update: EventUpdateInput
}

export type EventSelectUpsertArgsOptional = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select?: EventSelect | null
  /**
   * The filter to search for the Event to update in case it exists.
  **/
  where: EventWhereUniqueInput
  /**
   * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
  **/
  create: EventCreateInput
  /**
   * In case the Event was found with the provided `where` argument, update it with this data.
  **/
  update: EventUpdateInput
}

export type EventIncludeUpsertArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: EventInclude
  /**
   * The filter to search for the Event to update in case it exists.
  **/
  where: EventWhereUniqueInput
  /**
   * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
  **/
  create: EventCreateInput
  /**
   * In case the Event was found with the provided `where` argument, update it with this data.
  **/
  update: EventUpdateInput
}

export type EventIncludeUpsertArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: EventInclude | null
  /**
   * The filter to search for the Event to update in case it exists.
  **/
  where: EventWhereUniqueInput
  /**
   * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
  **/
  create: EventCreateInput
  /**
   * In case the Event was found with the provided `where` argument, update it with this data.
  **/
  update: EventUpdateInput
}

export type ExtractEventSelectUpsertArgs<S extends undefined | boolean | EventSelectUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends EventSelectUpsertArgs
  ? S['select']
  : true

export type ExtractEventIncludeUpsertArgs<S extends undefined | boolean | EventIncludeUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends EventIncludeUpsertArgs
  ? S['include']
  : true



/**
 * Event delete
 */
export type EventDeleteArgs = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select?: EventSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: EventInclude | null
  /**
   * Filter which Event to delete.
  **/
  where: EventWhereUniqueInput
}

export type EventDeleteArgsRequired = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select: EventSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: EventInclude
  /**
   * Filter which Event to delete.
  **/
  where: EventWhereUniqueInput
}

export type EventSelectDeleteArgs = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select: EventSelect
  /**
   * Filter which Event to delete.
  **/
  where: EventWhereUniqueInput
}

export type EventSelectDeleteArgsOptional = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select?: EventSelect | null
  /**
   * Filter which Event to delete.
  **/
  where: EventWhereUniqueInput
}

export type EventIncludeDeleteArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: EventInclude
  /**
   * Filter which Event to delete.
  **/
  where: EventWhereUniqueInput
}

export type EventIncludeDeleteArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: EventInclude | null
  /**
   * Filter which Event to delete.
  **/
  where: EventWhereUniqueInput
}

export type ExtractEventSelectDeleteArgs<S extends undefined | boolean | EventSelectDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends EventSelectDeleteArgs
  ? S['select']
  : true

export type ExtractEventIncludeDeleteArgs<S extends undefined | boolean | EventIncludeDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends EventIncludeDeleteArgs
  ? S['include']
  : true



/**
 * Event deleteMany
 */
export type EventDeleteManyArgs = {
  where?: EventWhereInput | null
}


/**
 * Event without action
 */
export type EventArgs = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select?: EventSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: EventInclude | null
}

export type EventArgsRequired = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select: EventSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: EventInclude
}

export type EventSelectArgs = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select: EventSelect
}

export type EventSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Event
  **/
  select?: EventSelect | null
}

export type EventIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: EventInclude
}

export type EventIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: EventInclude | null
}

export type ExtractEventSelectArgs<S extends undefined | boolean | EventSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends EventSelectArgs
  ? S['select']
  : true

export type ExtractEventIncludeArgs<S extends undefined | boolean | EventIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends EventIncludeArgs
  ? S['include']
  : true




/**
 * Model Athlete
 */

export type Athlete = {
  id: string
  createdAt: Date
  updatedAt: Date
  raw: boolean
  athleteNumber: number
  firstName: string
  lastName: string
  gender: Gender
  club: string
  birthday: Date
  total: number
  norm: boolean
  lateRegistration: boolean
  price: number
  bodyWeight: number
  wilks: number
  dots: number
  los: number
  KB1: number
  KB2: number
  KB3: number
  BD1: number
  BD2: number
  BD3: number
  KH1: number
  KH2: number
  KH3: number
  points: number
  place: number
  location: string
  nextAttemptsSortKeys: string
  importId: number
  resultClassId: string
}

export type AthleteScalars = 'id' | 'createdAt' | 'updatedAt' | 'raw' | 'athleteNumber' | 'firstName' | 'lastName' | 'gender' | 'club' | 'birthday' | 'total' | 'norm' | 'lateRegistration' | 'price' | 'bodyWeight' | 'wilks' | 'dots' | 'los' | 'KB1' | 'KB2' | 'KB3' | 'BD1' | 'BD2' | 'BD3' | 'KH1' | 'KH2' | 'KH3' | 'points' | 'place' | 'location' | 'nextAttemptsSortKeys' | 'importId' | 'resultClassId'
  

export type AthleteSelect = {
  id?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  raw?: boolean
  athleteNumber?: boolean
  firstName?: boolean
  lastName?: boolean
  gender?: boolean
  club?: boolean
  birthday?: boolean
  total?: boolean
  norm?: boolean
  lateRegistration?: boolean
  price?: boolean
  bodyWeight?: boolean
  wilks?: boolean
  dots?: boolean
  los?: boolean
  KB1?: boolean
  KB2?: boolean
  KB3?: boolean
  BD1?: boolean
  BD2?: boolean
  BD3?: boolean
  KH1?: boolean
  KH2?: boolean
  KH3?: boolean
  points?: boolean
  place?: boolean
  location?: boolean
  nextAttemptsSortKeys?: boolean
  importId?: boolean
  event?: boolean | EventSelectArgsOptional
  weightClass?: boolean | WeightClassSelectArgsOptional
  ageClass?: boolean | AgeClassSelectArgsOptional
  resultClassId?: boolean
  attempts?: boolean | FindManyAttemptSelectArgsOptional
}

export type AthleteInclude = {
  event?: boolean | EventIncludeArgsOptional
  weightClass?: boolean | WeightClassIncludeArgsOptional
  ageClass?: boolean | AgeClassIncludeArgsOptional
  attempts?: boolean | FindManyAttemptIncludeArgsOptional
}

type AthleteDefault = {
  id: true
  createdAt: true
  updatedAt: true
  raw: true
  athleteNumber: true
  firstName: true
  lastName: true
  gender: true
  club: true
  birthday: true
  total: true
  norm: true
  lateRegistration: true
  price: true
  bodyWeight: true
  wilks: true
  dots: true
  los: true
  KB1: true
  KB2: true
  KB3: true
  BD1: true
  BD2: true
  BD3: true
  KH1: true
  KH2: true
  KH3: true
  points: true
  place: true
  location: true
  nextAttemptsSortKeys: true
  importId: true
  resultClassId: true
}


export type AthleteGetSelectPayload<S extends boolean | AthleteSelect> = S extends true
  ? Athlete
  : S extends AthleteSelect
  ? {
      [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends AthleteScalars
        ? Athlete[P]
        : P extends 'event'
        ? EventGetSelectPayload<ExtractEventSelectArgs<S[P]>>
        : P extends 'weightClass'
        ? WeightClassGetSelectPayload<ExtractWeightClassSelectArgs<S[P]>>
        : P extends 'ageClass'
        ? AgeClassGetSelectPayload<ExtractAgeClassSelectArgs<S[P]>>
        : P extends 'attempts'
        ? Array<AttemptGetSelectPayload<ExtractFindManyAttemptSelectArgs<S[P]>>>
        : never
    }
   : never

export type AthleteGetIncludePayload<S extends boolean | AthleteInclude> = S extends true
  ? Athlete
  : S extends AthleteInclude
  ? {
      [P in CleanupNever<MergeTruthyValues<AthleteDefault, S>>]: P extends AthleteScalars
        ? Athlete[P]
        : P extends 'event'
        ? EventGetIncludePayload<ExtractEventIncludeArgs<S[P]>>
        : P extends 'weightClass'
        ? WeightClassGetIncludePayload<ExtractWeightClassIncludeArgs<S[P]>>
        : P extends 'ageClass'
        ? AgeClassGetIncludePayload<ExtractAgeClassIncludeArgs<S[P]>>
        : P extends 'attempts'
        ? Array<AttemptGetIncludePayload<ExtractFindManyAttemptIncludeArgs<S[P]>>>
        : never
    }
   : never

export interface AthleteDelegate {
  /**
   * Find zero or one Athlete.
   * @param {FindOneAthleteArgs} args - Arguments to find a Athlete
   * @example
   * // Get one Athlete
   * const athlete = await prisma.athlete.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneAthleteArgs>(
    args: Subset<T, FindOneAthleteArgs>
  ): T extends FindOneAthleteArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneAthleteSelectArgs ? Promise<AthleteGetSelectPayload<ExtractFindOneAthleteSelectArgs<T>> | null>
  : T extends FindOneAthleteIncludeArgs ? Promise<AthleteGetIncludePayload<ExtractFindOneAthleteIncludeArgs<T>> | null> : AthleteClient<Athlete | null>
  /**
   * Find zero or more Athletes.
   * @param {FindManyAthleteArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Athletes
   * const athletes = await prisma.athlete.findMany()
   * 
   * // Get first 10 Athletes
   * const athletes = await prisma.athlete.findMany({ first: 10 })
   * 
   * // Only select the `id`
   * const athleteWithIdOnly = await prisma.athlete.findMany({ select: { id: true } })
   * 
  **/
  findMany<T extends FindManyAthleteArgs>(
    args?: Subset<T, FindManyAthleteArgs>
  ): T extends FindManyAthleteArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyAthleteSelectArgs
  ? Promise<Array<AthleteGetSelectPayload<ExtractFindManyAthleteSelectArgs<T>>>> : T extends FindManyAthleteIncludeArgs
  ? Promise<Array<AthleteGetIncludePayload<ExtractFindManyAthleteIncludeArgs<T>>>> : Promise<Array<Athlete>>
  /**
   * Create a Athlete.
   * @param {AthleteCreateArgs} args - Arguments to create a Athlete.
   * @example
   * // Create one Athlete
   * const user = await prisma.athlete.create({
   *   data: {
   *     // ... data to create a Athlete
   *   }
   * })
   * 
  **/
  create<T extends AthleteCreateArgs>(
    args: Subset<T, AthleteCreateArgs>
  ): T extends AthleteCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends AthleteSelectCreateArgs ? Promise<AthleteGetSelectPayload<ExtractAthleteSelectCreateArgs<T>>>
  : T extends AthleteIncludeCreateArgs ? Promise<AthleteGetIncludePayload<ExtractAthleteIncludeCreateArgs<T>>> : AthleteClient<Athlete>
  /**
   * Delete a Athlete.
   * @param {AthleteDeleteArgs} args - Arguments to delete one Athlete.
   * @example
   * // Delete one Athlete
   * const user = await prisma.athlete.delete({
   *   where: {
   *     // ... filter to delete one Athlete
   *   }
   * })
   * 
  **/
  delete<T extends AthleteDeleteArgs>(
    args: Subset<T, AthleteDeleteArgs>
  ): T extends AthleteDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends AthleteSelectDeleteArgs ? Promise<AthleteGetSelectPayload<ExtractAthleteSelectDeleteArgs<T>>>
  : T extends AthleteIncludeDeleteArgs ? Promise<AthleteGetIncludePayload<ExtractAthleteIncludeDeleteArgs<T>>> : AthleteClient<Athlete>
  /**
   * Update one Athlete.
   * @param {AthleteUpdateArgs} args - Arguments to update one Athlete.
   * @example
   * // Update one Athlete
   * const athlete = await prisma.athlete.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends AthleteUpdateArgs>(
    args: Subset<T, AthleteUpdateArgs>
  ): T extends AthleteUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends AthleteSelectUpdateArgs ? Promise<AthleteGetSelectPayload<ExtractAthleteSelectUpdateArgs<T>>>
  : T extends AthleteIncludeUpdateArgs ? Promise<AthleteGetIncludePayload<ExtractAthleteIncludeUpdateArgs<T>>> : AthleteClient<Athlete>
  /**
   * Delete zero or more Athletes.
   * @param {AthleteDeleteManyArgs} args - Arguments to filter Athletes to delete.
   * @example
   * // Delete a few Athletes
   * const { count } = await prisma.athlete.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends AthleteDeleteManyArgs>(
    args: Subset<T, AthleteDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Athletes.
   * @param {AthleteUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Athletes
   * const athlete = await prisma.athlete.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  updateMany<T extends AthleteUpdateManyArgs>(
    args: Subset<T, AthleteUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one Athlete.
   * @param {AthleteUpsertArgs} args - Arguments to update or create a Athlete.
   * @example
   * // Update or create a Athlete
   * const athlete = await prisma.athlete.upsert({
   *   create: {
   *     // ... data to create a Athlete
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Athlete we want to update
   *   }
   * })
  **/
  upsert<T extends AthleteUpsertArgs>(
    args: Subset<T, AthleteUpsertArgs>
  ): T extends AthleteUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends AthleteSelectUpsertArgs ? Promise<AthleteGetSelectPayload<ExtractAthleteSelectUpsertArgs<T>>>
  : T extends AthleteIncludeUpsertArgs ? Promise<AthleteGetIncludePayload<ExtractAthleteIncludeUpsertArgs<T>>> : AthleteClient<Athlete>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class AthleteClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  private _collectTimestamps?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  event<T extends EventArgs = {}>(args?: Subset<T, EventArgs>): T extends FindOneEventArgsRequired ? 'Please either choose `select` or `include`' : T extends EventSelectArgs ? Promise<EventGetSelectPayload<ExtractEventSelectArgs<T>> | null>
  : T extends EventIncludeArgs ? Promise<EventGetIncludePayload<ExtractEventIncludeArgs<T>> | null> : EventClient<Event | null>;

  weightClass<T extends WeightClassArgs = {}>(args?: Subset<T, WeightClassArgs>): T extends FindOneWeightClassArgsRequired ? 'Please either choose `select` or `include`' : T extends WeightClassSelectArgs ? Promise<WeightClassGetSelectPayload<ExtractWeightClassSelectArgs<T>> | null>
  : T extends WeightClassIncludeArgs ? Promise<WeightClassGetIncludePayload<ExtractWeightClassIncludeArgs<T>> | null> : WeightClassClient<WeightClass | null>;

  ageClass<T extends AgeClassArgs = {}>(args?: Subset<T, AgeClassArgs>): T extends FindOneAgeClassArgsRequired ? 'Please either choose `select` or `include`' : T extends AgeClassSelectArgs ? Promise<AgeClassGetSelectPayload<ExtractAgeClassSelectArgs<T>> | null>
  : T extends AgeClassIncludeArgs ? Promise<AgeClassGetIncludePayload<ExtractAgeClassIncludeArgs<T>> | null> : AgeClassClient<AgeClass | null>;

  attempts<T extends FindManyAttemptArgs = {}>(args?: Subset<T, FindManyAttemptArgs>): T extends FindManyAttemptArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyAttemptSelectArgs
  ? Promise<Array<AttemptGetSelectPayload<ExtractFindManyAttemptSelectArgs<T>>>> : T extends FindManyAttemptIncludeArgs
  ? Promise<Array<AttemptGetIncludePayload<ExtractFindManyAttemptIncludeArgs<T>>>> : Promise<Array<Attempt>>;

  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * Athlete findOne
 */
export type FindOneAthleteArgs = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select?: AthleteSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteInclude | null
  /**
   * Filter, which Athlete to fetch.
  **/
  where: AthleteWhereUniqueInput
}

export type FindOneAthleteArgsRequired = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select: AthleteSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteInclude
  /**
   * Filter, which Athlete to fetch.
  **/
  where: AthleteWhereUniqueInput
}

export type FindOneAthleteSelectArgs = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select: AthleteSelect
  /**
   * Filter, which Athlete to fetch.
  **/
  where: AthleteWhereUniqueInput
}

export type FindOneAthleteSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select?: AthleteSelect | null
  /**
   * Filter, which Athlete to fetch.
  **/
  where: AthleteWhereUniqueInput
}

export type FindOneAthleteIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteInclude
  /**
   * Filter, which Athlete to fetch.
  **/
  where: AthleteWhereUniqueInput
}

export type FindOneAthleteIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteInclude | null
  /**
   * Filter, which Athlete to fetch.
  **/
  where: AthleteWhereUniqueInput
}

export type ExtractFindOneAthleteSelectArgs<S extends undefined | boolean | FindOneAthleteSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneAthleteSelectArgs
  ? S['select']
  : true

export type ExtractFindOneAthleteIncludeArgs<S extends undefined | boolean | FindOneAthleteIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneAthleteIncludeArgs
  ? S['include']
  : true



/**
 * Athlete findMany
 */
export type FindManyAthleteArgs = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select?: AthleteSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteInclude | null
  /**
   * Filter, which Athletes to fetch.
  **/
  where?: AthleteWhereInput | null
  /**
   * Determine the order of the Athletes to fetch.
  **/
  orderBy?: AthleteOrderByInput | null
  /**
   * Skip the first `n` Athletes.
  **/
  skip?: number | null
  /**
   * Get all Athletes that come after the Athlete you provide with the current order.
  **/
  after?: AthleteWhereUniqueInput | null
  /**
   * Get all Athletes that come before the Athlete you provide with the current order.
  **/
  before?: AthleteWhereUniqueInput | null
  /**
   * Get the first `n` Athletes.
  **/
  first?: number | null
  /**
   * Get the last `n` Athletes.
  **/
  last?: number | null
}

export type FindManyAthleteArgsRequired = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select: AthleteSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteInclude
  /**
   * Filter, which Athletes to fetch.
  **/
  where?: AthleteWhereInput | null
  /**
   * Determine the order of the Athletes to fetch.
  **/
  orderBy?: AthleteOrderByInput | null
  /**
   * Skip the first `n` Athletes.
  **/
  skip?: number | null
  /**
   * Get all Athletes that come after the Athlete you provide with the current order.
  **/
  after?: AthleteWhereUniqueInput | null
  /**
   * Get all Athletes that come before the Athlete you provide with the current order.
  **/
  before?: AthleteWhereUniqueInput | null
  /**
   * Get the first `n` Athletes.
  **/
  first?: number | null
  /**
   * Get the last `n` Athletes.
  **/
  last?: number | null
}

export type FindManyAthleteSelectArgs = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select: AthleteSelect
  /**
   * Filter, which Athletes to fetch.
  **/
  where?: AthleteWhereInput | null
  /**
   * Determine the order of the Athletes to fetch.
  **/
  orderBy?: AthleteOrderByInput | null
  /**
   * Skip the first `n` Athletes.
  **/
  skip?: number | null
  /**
   * Get all Athletes that come after the Athlete you provide with the current order.
  **/
  after?: AthleteWhereUniqueInput | null
  /**
   * Get all Athletes that come before the Athlete you provide with the current order.
  **/
  before?: AthleteWhereUniqueInput | null
  /**
   * Get the first `n` Athletes.
  **/
  first?: number | null
  /**
   * Get the last `n` Athletes.
  **/
  last?: number | null
}

export type FindManyAthleteSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select?: AthleteSelect | null
  /**
   * Filter, which Athletes to fetch.
  **/
  where?: AthleteWhereInput | null
  /**
   * Determine the order of the Athletes to fetch.
  **/
  orderBy?: AthleteOrderByInput | null
  /**
   * Skip the first `n` Athletes.
  **/
  skip?: number | null
  /**
   * Get all Athletes that come after the Athlete you provide with the current order.
  **/
  after?: AthleteWhereUniqueInput | null
  /**
   * Get all Athletes that come before the Athlete you provide with the current order.
  **/
  before?: AthleteWhereUniqueInput | null
  /**
   * Get the first `n` Athletes.
  **/
  first?: number | null
  /**
   * Get the last `n` Athletes.
  **/
  last?: number | null
}

export type FindManyAthleteIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteInclude
  /**
   * Filter, which Athletes to fetch.
  **/
  where?: AthleteWhereInput | null
  /**
   * Determine the order of the Athletes to fetch.
  **/
  orderBy?: AthleteOrderByInput | null
  /**
   * Skip the first `n` Athletes.
  **/
  skip?: number | null
  /**
   * Get all Athletes that come after the Athlete you provide with the current order.
  **/
  after?: AthleteWhereUniqueInput | null
  /**
   * Get all Athletes that come before the Athlete you provide with the current order.
  **/
  before?: AthleteWhereUniqueInput | null
  /**
   * Get the first `n` Athletes.
  **/
  first?: number | null
  /**
   * Get the last `n` Athletes.
  **/
  last?: number | null
}

export type FindManyAthleteIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteInclude | null
  /**
   * Filter, which Athletes to fetch.
  **/
  where?: AthleteWhereInput | null
  /**
   * Determine the order of the Athletes to fetch.
  **/
  orderBy?: AthleteOrderByInput | null
  /**
   * Skip the first `n` Athletes.
  **/
  skip?: number | null
  /**
   * Get all Athletes that come after the Athlete you provide with the current order.
  **/
  after?: AthleteWhereUniqueInput | null
  /**
   * Get all Athletes that come before the Athlete you provide with the current order.
  **/
  before?: AthleteWhereUniqueInput | null
  /**
   * Get the first `n` Athletes.
  **/
  first?: number | null
  /**
   * Get the last `n` Athletes.
  **/
  last?: number | null
}

export type ExtractFindManyAthleteSelectArgs<S extends undefined | boolean | FindManyAthleteSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyAthleteSelectArgs
  ? S['select']
  : true

export type ExtractFindManyAthleteIncludeArgs<S extends undefined | boolean | FindManyAthleteIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyAthleteIncludeArgs
  ? S['include']
  : true



/**
 * Athlete create
 */
export type AthleteCreateArgs = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select?: AthleteSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteInclude | null
  /**
   * The data needed to create a Athlete.
  **/
  data: AthleteCreateInput
}

export type AthleteCreateArgsRequired = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select: AthleteSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteInclude
  /**
   * The data needed to create a Athlete.
  **/
  data: AthleteCreateInput
}

export type AthleteSelectCreateArgs = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select: AthleteSelect
  /**
   * The data needed to create a Athlete.
  **/
  data: AthleteCreateInput
}

export type AthleteSelectCreateArgsOptional = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select?: AthleteSelect | null
  /**
   * The data needed to create a Athlete.
  **/
  data: AthleteCreateInput
}

export type AthleteIncludeCreateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteInclude
  /**
   * The data needed to create a Athlete.
  **/
  data: AthleteCreateInput
}

export type AthleteIncludeCreateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteInclude | null
  /**
   * The data needed to create a Athlete.
  **/
  data: AthleteCreateInput
}

export type ExtractAthleteSelectCreateArgs<S extends undefined | boolean | AthleteSelectCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteSelectCreateArgs
  ? S['select']
  : true

export type ExtractAthleteIncludeCreateArgs<S extends undefined | boolean | AthleteIncludeCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteIncludeCreateArgs
  ? S['include']
  : true



/**
 * Athlete update
 */
export type AthleteUpdateArgs = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select?: AthleteSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteInclude | null
  /**
   * The data needed to update a Athlete.
  **/
  data: AthleteUpdateInput
  /**
   * Choose, which Athlete to update.
  **/
  where: AthleteWhereUniqueInput
}

export type AthleteUpdateArgsRequired = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select: AthleteSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteInclude
  /**
   * The data needed to update a Athlete.
  **/
  data: AthleteUpdateInput
  /**
   * Choose, which Athlete to update.
  **/
  where: AthleteWhereUniqueInput
}

export type AthleteSelectUpdateArgs = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select: AthleteSelect
  /**
   * The data needed to update a Athlete.
  **/
  data: AthleteUpdateInput
  /**
   * Choose, which Athlete to update.
  **/
  where: AthleteWhereUniqueInput
}

export type AthleteSelectUpdateArgsOptional = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select?: AthleteSelect | null
  /**
   * The data needed to update a Athlete.
  **/
  data: AthleteUpdateInput
  /**
   * Choose, which Athlete to update.
  **/
  where: AthleteWhereUniqueInput
}

export type AthleteIncludeUpdateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteInclude
  /**
   * The data needed to update a Athlete.
  **/
  data: AthleteUpdateInput
  /**
   * Choose, which Athlete to update.
  **/
  where: AthleteWhereUniqueInput
}

export type AthleteIncludeUpdateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteInclude | null
  /**
   * The data needed to update a Athlete.
  **/
  data: AthleteUpdateInput
  /**
   * Choose, which Athlete to update.
  **/
  where: AthleteWhereUniqueInput
}

export type ExtractAthleteSelectUpdateArgs<S extends undefined | boolean | AthleteSelectUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteSelectUpdateArgs
  ? S['select']
  : true

export type ExtractAthleteIncludeUpdateArgs<S extends undefined | boolean | AthleteIncludeUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteIncludeUpdateArgs
  ? S['include']
  : true



/**
 * Athlete updateMany
 */
export type AthleteUpdateManyArgs = {
  data: AthleteUpdateManyMutationInput
  where?: AthleteWhereInput | null
}


/**
 * Athlete upsert
 */
export type AthleteUpsertArgs = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select?: AthleteSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteInclude | null
  /**
   * The filter to search for the Athlete to update in case it exists.
  **/
  where: AthleteWhereUniqueInput
  /**
   * In case the Athlete found by the `where` argument doesn't exist, create a new Athlete with this data.
  **/
  create: AthleteCreateInput
  /**
   * In case the Athlete was found with the provided `where` argument, update it with this data.
  **/
  update: AthleteUpdateInput
}

export type AthleteUpsertArgsRequired = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select: AthleteSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteInclude
  /**
   * The filter to search for the Athlete to update in case it exists.
  **/
  where: AthleteWhereUniqueInput
  /**
   * In case the Athlete found by the `where` argument doesn't exist, create a new Athlete with this data.
  **/
  create: AthleteCreateInput
  /**
   * In case the Athlete was found with the provided `where` argument, update it with this data.
  **/
  update: AthleteUpdateInput
}

export type AthleteSelectUpsertArgs = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select: AthleteSelect
  /**
   * The filter to search for the Athlete to update in case it exists.
  **/
  where: AthleteWhereUniqueInput
  /**
   * In case the Athlete found by the `where` argument doesn't exist, create a new Athlete with this data.
  **/
  create: AthleteCreateInput
  /**
   * In case the Athlete was found with the provided `where` argument, update it with this data.
  **/
  update: AthleteUpdateInput
}

export type AthleteSelectUpsertArgsOptional = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select?: AthleteSelect | null
  /**
   * The filter to search for the Athlete to update in case it exists.
  **/
  where: AthleteWhereUniqueInput
  /**
   * In case the Athlete found by the `where` argument doesn't exist, create a new Athlete with this data.
  **/
  create: AthleteCreateInput
  /**
   * In case the Athlete was found with the provided `where` argument, update it with this data.
  **/
  update: AthleteUpdateInput
}

export type AthleteIncludeUpsertArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteInclude
  /**
   * The filter to search for the Athlete to update in case it exists.
  **/
  where: AthleteWhereUniqueInput
  /**
   * In case the Athlete found by the `where` argument doesn't exist, create a new Athlete with this data.
  **/
  create: AthleteCreateInput
  /**
   * In case the Athlete was found with the provided `where` argument, update it with this data.
  **/
  update: AthleteUpdateInput
}

export type AthleteIncludeUpsertArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteInclude | null
  /**
   * The filter to search for the Athlete to update in case it exists.
  **/
  where: AthleteWhereUniqueInput
  /**
   * In case the Athlete found by the `where` argument doesn't exist, create a new Athlete with this data.
  **/
  create: AthleteCreateInput
  /**
   * In case the Athlete was found with the provided `where` argument, update it with this data.
  **/
  update: AthleteUpdateInput
}

export type ExtractAthleteSelectUpsertArgs<S extends undefined | boolean | AthleteSelectUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteSelectUpsertArgs
  ? S['select']
  : true

export type ExtractAthleteIncludeUpsertArgs<S extends undefined | boolean | AthleteIncludeUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteIncludeUpsertArgs
  ? S['include']
  : true



/**
 * Athlete delete
 */
export type AthleteDeleteArgs = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select?: AthleteSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteInclude | null
  /**
   * Filter which Athlete to delete.
  **/
  where: AthleteWhereUniqueInput
}

export type AthleteDeleteArgsRequired = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select: AthleteSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteInclude
  /**
   * Filter which Athlete to delete.
  **/
  where: AthleteWhereUniqueInput
}

export type AthleteSelectDeleteArgs = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select: AthleteSelect
  /**
   * Filter which Athlete to delete.
  **/
  where: AthleteWhereUniqueInput
}

export type AthleteSelectDeleteArgsOptional = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select?: AthleteSelect | null
  /**
   * Filter which Athlete to delete.
  **/
  where: AthleteWhereUniqueInput
}

export type AthleteIncludeDeleteArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteInclude
  /**
   * Filter which Athlete to delete.
  **/
  where: AthleteWhereUniqueInput
}

export type AthleteIncludeDeleteArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteInclude | null
  /**
   * Filter which Athlete to delete.
  **/
  where: AthleteWhereUniqueInput
}

export type ExtractAthleteSelectDeleteArgs<S extends undefined | boolean | AthleteSelectDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteSelectDeleteArgs
  ? S['select']
  : true

export type ExtractAthleteIncludeDeleteArgs<S extends undefined | boolean | AthleteIncludeDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteIncludeDeleteArgs
  ? S['include']
  : true



/**
 * Athlete deleteMany
 */
export type AthleteDeleteManyArgs = {
  where?: AthleteWhereInput | null
}


/**
 * Athlete without action
 */
export type AthleteArgs = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select?: AthleteSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteInclude | null
}

export type AthleteArgsRequired = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select: AthleteSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteInclude
}

export type AthleteSelectArgs = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select: AthleteSelect
}

export type AthleteSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Athlete
  **/
  select?: AthleteSelect | null
}

export type AthleteIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteInclude
}

export type AthleteIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteInclude | null
}

export type ExtractAthleteSelectArgs<S extends undefined | boolean | AthleteSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteSelectArgs
  ? S['select']
  : true

export type ExtractAthleteIncludeArgs<S extends undefined | boolean | AthleteIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteIncludeArgs
  ? S['include']
  : true




/**
 * Model Slot
 */

export type Slot = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
}

export type SlotScalars = 'id' | 'createdAt' | 'updatedAt' | 'name'
  

export type SlotSelect = {
  id?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  name?: boolean
  event?: boolean | EventSelectArgsOptional
  athleteGroups?: boolean | FindManyAthleteGroupSelectArgsOptional
  officialSlots?: boolean | FindManyOfficialSlotSelectArgsOptional
}

export type SlotInclude = {
  event?: boolean | EventIncludeArgsOptional
  athleteGroups?: boolean | FindManyAthleteGroupIncludeArgsOptional
  officialSlots?: boolean | FindManyOfficialSlotIncludeArgsOptional
}

type SlotDefault = {
  id: true
  createdAt: true
  updatedAt: true
  name: true
}


export type SlotGetSelectPayload<S extends boolean | SlotSelect> = S extends true
  ? Slot
  : S extends SlotSelect
  ? {
      [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends SlotScalars
        ? Slot[P]
        : P extends 'event'
        ? EventGetSelectPayload<ExtractEventSelectArgs<S[P]>>
        : P extends 'athleteGroups'
        ? Array<AthleteGroupGetSelectPayload<ExtractFindManyAthleteGroupSelectArgs<S[P]>>>
        : P extends 'officialSlots'
        ? Array<OfficialSlotGetSelectPayload<ExtractFindManyOfficialSlotSelectArgs<S[P]>>>
        : never
    }
   : never

export type SlotGetIncludePayload<S extends boolean | SlotInclude> = S extends true
  ? Slot
  : S extends SlotInclude
  ? {
      [P in CleanupNever<MergeTruthyValues<SlotDefault, S>>]: P extends SlotScalars
        ? Slot[P]
        : P extends 'event'
        ? EventGetIncludePayload<ExtractEventIncludeArgs<S[P]>>
        : P extends 'athleteGroups'
        ? Array<AthleteGroupGetIncludePayload<ExtractFindManyAthleteGroupIncludeArgs<S[P]>>>
        : P extends 'officialSlots'
        ? Array<OfficialSlotGetIncludePayload<ExtractFindManyOfficialSlotIncludeArgs<S[P]>>>
        : never
    }
   : never

export interface SlotDelegate {
  /**
   * Find zero or one Slot.
   * @param {FindOneSlotArgs} args - Arguments to find a Slot
   * @example
   * // Get one Slot
   * const slot = await prisma.slot.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneSlotArgs>(
    args: Subset<T, FindOneSlotArgs>
  ): T extends FindOneSlotArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneSlotSelectArgs ? Promise<SlotGetSelectPayload<ExtractFindOneSlotSelectArgs<T>> | null>
  : T extends FindOneSlotIncludeArgs ? Promise<SlotGetIncludePayload<ExtractFindOneSlotIncludeArgs<T>> | null> : SlotClient<Slot | null>
  /**
   * Find zero or more Slots.
   * @param {FindManySlotArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Slots
   * const slots = await prisma.slot.findMany()
   * 
   * // Get first 10 Slots
   * const slots = await prisma.slot.findMany({ first: 10 })
   * 
   * // Only select the `id`
   * const slotWithIdOnly = await prisma.slot.findMany({ select: { id: true } })
   * 
  **/
  findMany<T extends FindManySlotArgs>(
    args?: Subset<T, FindManySlotArgs>
  ): T extends FindManySlotArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManySlotSelectArgs
  ? Promise<Array<SlotGetSelectPayload<ExtractFindManySlotSelectArgs<T>>>> : T extends FindManySlotIncludeArgs
  ? Promise<Array<SlotGetIncludePayload<ExtractFindManySlotIncludeArgs<T>>>> : Promise<Array<Slot>>
  /**
   * Create a Slot.
   * @param {SlotCreateArgs} args - Arguments to create a Slot.
   * @example
   * // Create one Slot
   * const user = await prisma.slot.create({
   *   data: {
   *     // ... data to create a Slot
   *   }
   * })
   * 
  **/
  create<T extends SlotCreateArgs>(
    args: Subset<T, SlotCreateArgs>
  ): T extends SlotCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends SlotSelectCreateArgs ? Promise<SlotGetSelectPayload<ExtractSlotSelectCreateArgs<T>>>
  : T extends SlotIncludeCreateArgs ? Promise<SlotGetIncludePayload<ExtractSlotIncludeCreateArgs<T>>> : SlotClient<Slot>
  /**
   * Delete a Slot.
   * @param {SlotDeleteArgs} args - Arguments to delete one Slot.
   * @example
   * // Delete one Slot
   * const user = await prisma.slot.delete({
   *   where: {
   *     // ... filter to delete one Slot
   *   }
   * })
   * 
  **/
  delete<T extends SlotDeleteArgs>(
    args: Subset<T, SlotDeleteArgs>
  ): T extends SlotDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends SlotSelectDeleteArgs ? Promise<SlotGetSelectPayload<ExtractSlotSelectDeleteArgs<T>>>
  : T extends SlotIncludeDeleteArgs ? Promise<SlotGetIncludePayload<ExtractSlotIncludeDeleteArgs<T>>> : SlotClient<Slot>
  /**
   * Update one Slot.
   * @param {SlotUpdateArgs} args - Arguments to update one Slot.
   * @example
   * // Update one Slot
   * const slot = await prisma.slot.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends SlotUpdateArgs>(
    args: Subset<T, SlotUpdateArgs>
  ): T extends SlotUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends SlotSelectUpdateArgs ? Promise<SlotGetSelectPayload<ExtractSlotSelectUpdateArgs<T>>>
  : T extends SlotIncludeUpdateArgs ? Promise<SlotGetIncludePayload<ExtractSlotIncludeUpdateArgs<T>>> : SlotClient<Slot>
  /**
   * Delete zero or more Slots.
   * @param {SlotDeleteManyArgs} args - Arguments to filter Slots to delete.
   * @example
   * // Delete a few Slots
   * const { count } = await prisma.slot.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends SlotDeleteManyArgs>(
    args: Subset<T, SlotDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Slots.
   * @param {SlotUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Slots
   * const slot = await prisma.slot.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  updateMany<T extends SlotUpdateManyArgs>(
    args: Subset<T, SlotUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one Slot.
   * @param {SlotUpsertArgs} args - Arguments to update or create a Slot.
   * @example
   * // Update or create a Slot
   * const slot = await prisma.slot.upsert({
   *   create: {
   *     // ... data to create a Slot
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Slot we want to update
   *   }
   * })
  **/
  upsert<T extends SlotUpsertArgs>(
    args: Subset<T, SlotUpsertArgs>
  ): T extends SlotUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends SlotSelectUpsertArgs ? Promise<SlotGetSelectPayload<ExtractSlotSelectUpsertArgs<T>>>
  : T extends SlotIncludeUpsertArgs ? Promise<SlotGetIncludePayload<ExtractSlotIncludeUpsertArgs<T>>> : SlotClient<Slot>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class SlotClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  private _collectTimestamps?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  event<T extends EventArgs = {}>(args?: Subset<T, EventArgs>): T extends FindOneEventArgsRequired ? 'Please either choose `select` or `include`' : T extends EventSelectArgs ? Promise<EventGetSelectPayload<ExtractEventSelectArgs<T>> | null>
  : T extends EventIncludeArgs ? Promise<EventGetIncludePayload<ExtractEventIncludeArgs<T>> | null> : EventClient<Event | null>;

  athleteGroups<T extends FindManyAthleteGroupArgs = {}>(args?: Subset<T, FindManyAthleteGroupArgs>): T extends FindManyAthleteGroupArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyAthleteGroupSelectArgs
  ? Promise<Array<AthleteGroupGetSelectPayload<ExtractFindManyAthleteGroupSelectArgs<T>>>> : T extends FindManyAthleteGroupIncludeArgs
  ? Promise<Array<AthleteGroupGetIncludePayload<ExtractFindManyAthleteGroupIncludeArgs<T>>>> : Promise<Array<AthleteGroup>>;

  officialSlots<T extends FindManyOfficialSlotArgs = {}>(args?: Subset<T, FindManyOfficialSlotArgs>): T extends FindManyOfficialSlotArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyOfficialSlotSelectArgs
  ? Promise<Array<OfficialSlotGetSelectPayload<ExtractFindManyOfficialSlotSelectArgs<T>>>> : T extends FindManyOfficialSlotIncludeArgs
  ? Promise<Array<OfficialSlotGetIncludePayload<ExtractFindManyOfficialSlotIncludeArgs<T>>>> : Promise<Array<OfficialSlot>>;

  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * Slot findOne
 */
export type FindOneSlotArgs = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select?: SlotSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: SlotInclude | null
  /**
   * Filter, which Slot to fetch.
  **/
  where: SlotWhereUniqueInput
}

export type FindOneSlotArgsRequired = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select: SlotSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: SlotInclude
  /**
   * Filter, which Slot to fetch.
  **/
  where: SlotWhereUniqueInput
}

export type FindOneSlotSelectArgs = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select: SlotSelect
  /**
   * Filter, which Slot to fetch.
  **/
  where: SlotWhereUniqueInput
}

export type FindOneSlotSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select?: SlotSelect | null
  /**
   * Filter, which Slot to fetch.
  **/
  where: SlotWhereUniqueInput
}

export type FindOneSlotIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: SlotInclude
  /**
   * Filter, which Slot to fetch.
  **/
  where: SlotWhereUniqueInput
}

export type FindOneSlotIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: SlotInclude | null
  /**
   * Filter, which Slot to fetch.
  **/
  where: SlotWhereUniqueInput
}

export type ExtractFindOneSlotSelectArgs<S extends undefined | boolean | FindOneSlotSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneSlotSelectArgs
  ? S['select']
  : true

export type ExtractFindOneSlotIncludeArgs<S extends undefined | boolean | FindOneSlotIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneSlotIncludeArgs
  ? S['include']
  : true



/**
 * Slot findMany
 */
export type FindManySlotArgs = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select?: SlotSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: SlotInclude | null
  /**
   * Filter, which Slots to fetch.
  **/
  where?: SlotWhereInput | null
  /**
   * Determine the order of the Slots to fetch.
  **/
  orderBy?: SlotOrderByInput | null
  /**
   * Skip the first `n` Slots.
  **/
  skip?: number | null
  /**
   * Get all Slots that come after the Slot you provide with the current order.
  **/
  after?: SlotWhereUniqueInput | null
  /**
   * Get all Slots that come before the Slot you provide with the current order.
  **/
  before?: SlotWhereUniqueInput | null
  /**
   * Get the first `n` Slots.
  **/
  first?: number | null
  /**
   * Get the last `n` Slots.
  **/
  last?: number | null
}

export type FindManySlotArgsRequired = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select: SlotSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: SlotInclude
  /**
   * Filter, which Slots to fetch.
  **/
  where?: SlotWhereInput | null
  /**
   * Determine the order of the Slots to fetch.
  **/
  orderBy?: SlotOrderByInput | null
  /**
   * Skip the first `n` Slots.
  **/
  skip?: number | null
  /**
   * Get all Slots that come after the Slot you provide with the current order.
  **/
  after?: SlotWhereUniqueInput | null
  /**
   * Get all Slots that come before the Slot you provide with the current order.
  **/
  before?: SlotWhereUniqueInput | null
  /**
   * Get the first `n` Slots.
  **/
  first?: number | null
  /**
   * Get the last `n` Slots.
  **/
  last?: number | null
}

export type FindManySlotSelectArgs = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select: SlotSelect
  /**
   * Filter, which Slots to fetch.
  **/
  where?: SlotWhereInput | null
  /**
   * Determine the order of the Slots to fetch.
  **/
  orderBy?: SlotOrderByInput | null
  /**
   * Skip the first `n` Slots.
  **/
  skip?: number | null
  /**
   * Get all Slots that come after the Slot you provide with the current order.
  **/
  after?: SlotWhereUniqueInput | null
  /**
   * Get all Slots that come before the Slot you provide with the current order.
  **/
  before?: SlotWhereUniqueInput | null
  /**
   * Get the first `n` Slots.
  **/
  first?: number | null
  /**
   * Get the last `n` Slots.
  **/
  last?: number | null
}

export type FindManySlotSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select?: SlotSelect | null
  /**
   * Filter, which Slots to fetch.
  **/
  where?: SlotWhereInput | null
  /**
   * Determine the order of the Slots to fetch.
  **/
  orderBy?: SlotOrderByInput | null
  /**
   * Skip the first `n` Slots.
  **/
  skip?: number | null
  /**
   * Get all Slots that come after the Slot you provide with the current order.
  **/
  after?: SlotWhereUniqueInput | null
  /**
   * Get all Slots that come before the Slot you provide with the current order.
  **/
  before?: SlotWhereUniqueInput | null
  /**
   * Get the first `n` Slots.
  **/
  first?: number | null
  /**
   * Get the last `n` Slots.
  **/
  last?: number | null
}

export type FindManySlotIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: SlotInclude
  /**
   * Filter, which Slots to fetch.
  **/
  where?: SlotWhereInput | null
  /**
   * Determine the order of the Slots to fetch.
  **/
  orderBy?: SlotOrderByInput | null
  /**
   * Skip the first `n` Slots.
  **/
  skip?: number | null
  /**
   * Get all Slots that come after the Slot you provide with the current order.
  **/
  after?: SlotWhereUniqueInput | null
  /**
   * Get all Slots that come before the Slot you provide with the current order.
  **/
  before?: SlotWhereUniqueInput | null
  /**
   * Get the first `n` Slots.
  **/
  first?: number | null
  /**
   * Get the last `n` Slots.
  **/
  last?: number | null
}

export type FindManySlotIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: SlotInclude | null
  /**
   * Filter, which Slots to fetch.
  **/
  where?: SlotWhereInput | null
  /**
   * Determine the order of the Slots to fetch.
  **/
  orderBy?: SlotOrderByInput | null
  /**
   * Skip the first `n` Slots.
  **/
  skip?: number | null
  /**
   * Get all Slots that come after the Slot you provide with the current order.
  **/
  after?: SlotWhereUniqueInput | null
  /**
   * Get all Slots that come before the Slot you provide with the current order.
  **/
  before?: SlotWhereUniqueInput | null
  /**
   * Get the first `n` Slots.
  **/
  first?: number | null
  /**
   * Get the last `n` Slots.
  **/
  last?: number | null
}

export type ExtractFindManySlotSelectArgs<S extends undefined | boolean | FindManySlotSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManySlotSelectArgs
  ? S['select']
  : true

export type ExtractFindManySlotIncludeArgs<S extends undefined | boolean | FindManySlotIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManySlotIncludeArgs
  ? S['include']
  : true



/**
 * Slot create
 */
export type SlotCreateArgs = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select?: SlotSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: SlotInclude | null
  /**
   * The data needed to create a Slot.
  **/
  data: SlotCreateInput
}

export type SlotCreateArgsRequired = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select: SlotSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: SlotInclude
  /**
   * The data needed to create a Slot.
  **/
  data: SlotCreateInput
}

export type SlotSelectCreateArgs = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select: SlotSelect
  /**
   * The data needed to create a Slot.
  **/
  data: SlotCreateInput
}

export type SlotSelectCreateArgsOptional = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select?: SlotSelect | null
  /**
   * The data needed to create a Slot.
  **/
  data: SlotCreateInput
}

export type SlotIncludeCreateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: SlotInclude
  /**
   * The data needed to create a Slot.
  **/
  data: SlotCreateInput
}

export type SlotIncludeCreateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: SlotInclude | null
  /**
   * The data needed to create a Slot.
  **/
  data: SlotCreateInput
}

export type ExtractSlotSelectCreateArgs<S extends undefined | boolean | SlotSelectCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends SlotSelectCreateArgs
  ? S['select']
  : true

export type ExtractSlotIncludeCreateArgs<S extends undefined | boolean | SlotIncludeCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends SlotIncludeCreateArgs
  ? S['include']
  : true



/**
 * Slot update
 */
export type SlotUpdateArgs = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select?: SlotSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: SlotInclude | null
  /**
   * The data needed to update a Slot.
  **/
  data: SlotUpdateInput
  /**
   * Choose, which Slot to update.
  **/
  where: SlotWhereUniqueInput
}

export type SlotUpdateArgsRequired = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select: SlotSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: SlotInclude
  /**
   * The data needed to update a Slot.
  **/
  data: SlotUpdateInput
  /**
   * Choose, which Slot to update.
  **/
  where: SlotWhereUniqueInput
}

export type SlotSelectUpdateArgs = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select: SlotSelect
  /**
   * The data needed to update a Slot.
  **/
  data: SlotUpdateInput
  /**
   * Choose, which Slot to update.
  **/
  where: SlotWhereUniqueInput
}

export type SlotSelectUpdateArgsOptional = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select?: SlotSelect | null
  /**
   * The data needed to update a Slot.
  **/
  data: SlotUpdateInput
  /**
   * Choose, which Slot to update.
  **/
  where: SlotWhereUniqueInput
}

export type SlotIncludeUpdateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: SlotInclude
  /**
   * The data needed to update a Slot.
  **/
  data: SlotUpdateInput
  /**
   * Choose, which Slot to update.
  **/
  where: SlotWhereUniqueInput
}

export type SlotIncludeUpdateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: SlotInclude | null
  /**
   * The data needed to update a Slot.
  **/
  data: SlotUpdateInput
  /**
   * Choose, which Slot to update.
  **/
  where: SlotWhereUniqueInput
}

export type ExtractSlotSelectUpdateArgs<S extends undefined | boolean | SlotSelectUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends SlotSelectUpdateArgs
  ? S['select']
  : true

export type ExtractSlotIncludeUpdateArgs<S extends undefined | boolean | SlotIncludeUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends SlotIncludeUpdateArgs
  ? S['include']
  : true



/**
 * Slot updateMany
 */
export type SlotUpdateManyArgs = {
  data: SlotUpdateManyMutationInput
  where?: SlotWhereInput | null
}


/**
 * Slot upsert
 */
export type SlotUpsertArgs = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select?: SlotSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: SlotInclude | null
  /**
   * The filter to search for the Slot to update in case it exists.
  **/
  where: SlotWhereUniqueInput
  /**
   * In case the Slot found by the `where` argument doesn't exist, create a new Slot with this data.
  **/
  create: SlotCreateInput
  /**
   * In case the Slot was found with the provided `where` argument, update it with this data.
  **/
  update: SlotUpdateInput
}

export type SlotUpsertArgsRequired = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select: SlotSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: SlotInclude
  /**
   * The filter to search for the Slot to update in case it exists.
  **/
  where: SlotWhereUniqueInput
  /**
   * In case the Slot found by the `where` argument doesn't exist, create a new Slot with this data.
  **/
  create: SlotCreateInput
  /**
   * In case the Slot was found with the provided `where` argument, update it with this data.
  **/
  update: SlotUpdateInput
}

export type SlotSelectUpsertArgs = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select: SlotSelect
  /**
   * The filter to search for the Slot to update in case it exists.
  **/
  where: SlotWhereUniqueInput
  /**
   * In case the Slot found by the `where` argument doesn't exist, create a new Slot with this data.
  **/
  create: SlotCreateInput
  /**
   * In case the Slot was found with the provided `where` argument, update it with this data.
  **/
  update: SlotUpdateInput
}

export type SlotSelectUpsertArgsOptional = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select?: SlotSelect | null
  /**
   * The filter to search for the Slot to update in case it exists.
  **/
  where: SlotWhereUniqueInput
  /**
   * In case the Slot found by the `where` argument doesn't exist, create a new Slot with this data.
  **/
  create: SlotCreateInput
  /**
   * In case the Slot was found with the provided `where` argument, update it with this data.
  **/
  update: SlotUpdateInput
}

export type SlotIncludeUpsertArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: SlotInclude
  /**
   * The filter to search for the Slot to update in case it exists.
  **/
  where: SlotWhereUniqueInput
  /**
   * In case the Slot found by the `where` argument doesn't exist, create a new Slot with this data.
  **/
  create: SlotCreateInput
  /**
   * In case the Slot was found with the provided `where` argument, update it with this data.
  **/
  update: SlotUpdateInput
}

export type SlotIncludeUpsertArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: SlotInclude | null
  /**
   * The filter to search for the Slot to update in case it exists.
  **/
  where: SlotWhereUniqueInput
  /**
   * In case the Slot found by the `where` argument doesn't exist, create a new Slot with this data.
  **/
  create: SlotCreateInput
  /**
   * In case the Slot was found with the provided `where` argument, update it with this data.
  **/
  update: SlotUpdateInput
}

export type ExtractSlotSelectUpsertArgs<S extends undefined | boolean | SlotSelectUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends SlotSelectUpsertArgs
  ? S['select']
  : true

export type ExtractSlotIncludeUpsertArgs<S extends undefined | boolean | SlotIncludeUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends SlotIncludeUpsertArgs
  ? S['include']
  : true



/**
 * Slot delete
 */
export type SlotDeleteArgs = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select?: SlotSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: SlotInclude | null
  /**
   * Filter which Slot to delete.
  **/
  where: SlotWhereUniqueInput
}

export type SlotDeleteArgsRequired = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select: SlotSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: SlotInclude
  /**
   * Filter which Slot to delete.
  **/
  where: SlotWhereUniqueInput
}

export type SlotSelectDeleteArgs = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select: SlotSelect
  /**
   * Filter which Slot to delete.
  **/
  where: SlotWhereUniqueInput
}

export type SlotSelectDeleteArgsOptional = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select?: SlotSelect | null
  /**
   * Filter which Slot to delete.
  **/
  where: SlotWhereUniqueInput
}

export type SlotIncludeDeleteArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: SlotInclude
  /**
   * Filter which Slot to delete.
  **/
  where: SlotWhereUniqueInput
}

export type SlotIncludeDeleteArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: SlotInclude | null
  /**
   * Filter which Slot to delete.
  **/
  where: SlotWhereUniqueInput
}

export type ExtractSlotSelectDeleteArgs<S extends undefined | boolean | SlotSelectDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends SlotSelectDeleteArgs
  ? S['select']
  : true

export type ExtractSlotIncludeDeleteArgs<S extends undefined | boolean | SlotIncludeDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends SlotIncludeDeleteArgs
  ? S['include']
  : true



/**
 * Slot deleteMany
 */
export type SlotDeleteManyArgs = {
  where?: SlotWhereInput | null
}


/**
 * Slot without action
 */
export type SlotArgs = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select?: SlotSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: SlotInclude | null
}

export type SlotArgsRequired = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select: SlotSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: SlotInclude
}

export type SlotSelectArgs = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select: SlotSelect
}

export type SlotSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Slot
  **/
  select?: SlotSelect | null
}

export type SlotIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: SlotInclude
}

export type SlotIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: SlotInclude | null
}

export type ExtractSlotSelectArgs<S extends undefined | boolean | SlotSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends SlotSelectArgs
  ? S['select']
  : true

export type ExtractSlotIncludeArgs<S extends undefined | boolean | SlotIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends SlotIncludeArgs
  ? S['include']
  : true




/**
 * Model AthleteGroup
 */

export type AthleteGroup = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
}

export type AthleteGroupScalars = 'id' | 'createdAt' | 'updatedAt' | 'name'
  

export type AthleteGroupSelect = {
  id?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  name?: boolean
  event?: boolean | EventSelectArgsOptional
  slot?: boolean | SlotSelectArgsOptional
}

export type AthleteGroupInclude = {
  event?: boolean | EventIncludeArgsOptional
  slot?: boolean | SlotIncludeArgsOptional
}

type AthleteGroupDefault = {
  id: true
  createdAt: true
  updatedAt: true
  name: true
}


export type AthleteGroupGetSelectPayload<S extends boolean | AthleteGroupSelect> = S extends true
  ? AthleteGroup
  : S extends AthleteGroupSelect
  ? {
      [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends AthleteGroupScalars
        ? AthleteGroup[P]
        : P extends 'event'
        ? EventGetSelectPayload<ExtractEventSelectArgs<S[P]>>
        : P extends 'slot'
        ? SlotGetSelectPayload<ExtractSlotSelectArgs<S[P]>>
        : never
    }
   : never

export type AthleteGroupGetIncludePayload<S extends boolean | AthleteGroupInclude> = S extends true
  ? AthleteGroup
  : S extends AthleteGroupInclude
  ? {
      [P in CleanupNever<MergeTruthyValues<AthleteGroupDefault, S>>]: P extends AthleteGroupScalars
        ? AthleteGroup[P]
        : P extends 'event'
        ? EventGetIncludePayload<ExtractEventIncludeArgs<S[P]>>
        : P extends 'slot'
        ? SlotGetIncludePayload<ExtractSlotIncludeArgs<S[P]>>
        : never
    }
   : never

export interface AthleteGroupDelegate {
  /**
   * Find zero or one AthleteGroup.
   * @param {FindOneAthleteGroupArgs} args - Arguments to find a AthleteGroup
   * @example
   * // Get one AthleteGroup
   * const athleteGroup = await prisma.athleteGroup.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneAthleteGroupArgs>(
    args: Subset<T, FindOneAthleteGroupArgs>
  ): T extends FindOneAthleteGroupArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneAthleteGroupSelectArgs ? Promise<AthleteGroupGetSelectPayload<ExtractFindOneAthleteGroupSelectArgs<T>> | null>
  : T extends FindOneAthleteGroupIncludeArgs ? Promise<AthleteGroupGetIncludePayload<ExtractFindOneAthleteGroupIncludeArgs<T>> | null> : AthleteGroupClient<AthleteGroup | null>
  /**
   * Find zero or more AthleteGroups.
   * @param {FindManyAthleteGroupArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all AthleteGroups
   * const athleteGroups = await prisma.athleteGroup.findMany()
   * 
   * // Get first 10 AthleteGroups
   * const athleteGroups = await prisma.athleteGroup.findMany({ first: 10 })
   * 
   * // Only select the `id`
   * const athleteGroupWithIdOnly = await prisma.athleteGroup.findMany({ select: { id: true } })
   * 
  **/
  findMany<T extends FindManyAthleteGroupArgs>(
    args?: Subset<T, FindManyAthleteGroupArgs>
  ): T extends FindManyAthleteGroupArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyAthleteGroupSelectArgs
  ? Promise<Array<AthleteGroupGetSelectPayload<ExtractFindManyAthleteGroupSelectArgs<T>>>> : T extends FindManyAthleteGroupIncludeArgs
  ? Promise<Array<AthleteGroupGetIncludePayload<ExtractFindManyAthleteGroupIncludeArgs<T>>>> : Promise<Array<AthleteGroup>>
  /**
   * Create a AthleteGroup.
   * @param {AthleteGroupCreateArgs} args - Arguments to create a AthleteGroup.
   * @example
   * // Create one AthleteGroup
   * const user = await prisma.athleteGroup.create({
   *   data: {
   *     // ... data to create a AthleteGroup
   *   }
   * })
   * 
  **/
  create<T extends AthleteGroupCreateArgs>(
    args: Subset<T, AthleteGroupCreateArgs>
  ): T extends AthleteGroupCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends AthleteGroupSelectCreateArgs ? Promise<AthleteGroupGetSelectPayload<ExtractAthleteGroupSelectCreateArgs<T>>>
  : T extends AthleteGroupIncludeCreateArgs ? Promise<AthleteGroupGetIncludePayload<ExtractAthleteGroupIncludeCreateArgs<T>>> : AthleteGroupClient<AthleteGroup>
  /**
   * Delete a AthleteGroup.
   * @param {AthleteGroupDeleteArgs} args - Arguments to delete one AthleteGroup.
   * @example
   * // Delete one AthleteGroup
   * const user = await prisma.athleteGroup.delete({
   *   where: {
   *     // ... filter to delete one AthleteGroup
   *   }
   * })
   * 
  **/
  delete<T extends AthleteGroupDeleteArgs>(
    args: Subset<T, AthleteGroupDeleteArgs>
  ): T extends AthleteGroupDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends AthleteGroupSelectDeleteArgs ? Promise<AthleteGroupGetSelectPayload<ExtractAthleteGroupSelectDeleteArgs<T>>>
  : T extends AthleteGroupIncludeDeleteArgs ? Promise<AthleteGroupGetIncludePayload<ExtractAthleteGroupIncludeDeleteArgs<T>>> : AthleteGroupClient<AthleteGroup>
  /**
   * Update one AthleteGroup.
   * @param {AthleteGroupUpdateArgs} args - Arguments to update one AthleteGroup.
   * @example
   * // Update one AthleteGroup
   * const athleteGroup = await prisma.athleteGroup.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends AthleteGroupUpdateArgs>(
    args: Subset<T, AthleteGroupUpdateArgs>
  ): T extends AthleteGroupUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends AthleteGroupSelectUpdateArgs ? Promise<AthleteGroupGetSelectPayload<ExtractAthleteGroupSelectUpdateArgs<T>>>
  : T extends AthleteGroupIncludeUpdateArgs ? Promise<AthleteGroupGetIncludePayload<ExtractAthleteGroupIncludeUpdateArgs<T>>> : AthleteGroupClient<AthleteGroup>
  /**
   * Delete zero or more AthleteGroups.
   * @param {AthleteGroupDeleteManyArgs} args - Arguments to filter AthleteGroups to delete.
   * @example
   * // Delete a few AthleteGroups
   * const { count } = await prisma.athleteGroup.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends AthleteGroupDeleteManyArgs>(
    args: Subset<T, AthleteGroupDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more AthleteGroups.
   * @param {AthleteGroupUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many AthleteGroups
   * const athleteGroup = await prisma.athleteGroup.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  updateMany<T extends AthleteGroupUpdateManyArgs>(
    args: Subset<T, AthleteGroupUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one AthleteGroup.
   * @param {AthleteGroupUpsertArgs} args - Arguments to update or create a AthleteGroup.
   * @example
   * // Update or create a AthleteGroup
   * const athleteGroup = await prisma.athleteGroup.upsert({
   *   create: {
   *     // ... data to create a AthleteGroup
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the AthleteGroup we want to update
   *   }
   * })
  **/
  upsert<T extends AthleteGroupUpsertArgs>(
    args: Subset<T, AthleteGroupUpsertArgs>
  ): T extends AthleteGroupUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends AthleteGroupSelectUpsertArgs ? Promise<AthleteGroupGetSelectPayload<ExtractAthleteGroupSelectUpsertArgs<T>>>
  : T extends AthleteGroupIncludeUpsertArgs ? Promise<AthleteGroupGetIncludePayload<ExtractAthleteGroupIncludeUpsertArgs<T>>> : AthleteGroupClient<AthleteGroup>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class AthleteGroupClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  private _collectTimestamps?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  event<T extends EventArgs = {}>(args?: Subset<T, EventArgs>): T extends FindOneEventArgsRequired ? 'Please either choose `select` or `include`' : T extends EventSelectArgs ? Promise<EventGetSelectPayload<ExtractEventSelectArgs<T>> | null>
  : T extends EventIncludeArgs ? Promise<EventGetIncludePayload<ExtractEventIncludeArgs<T>> | null> : EventClient<Event | null>;

  slot<T extends SlotArgs = {}>(args?: Subset<T, SlotArgs>): T extends FindOneSlotArgsRequired ? 'Please either choose `select` or `include`' : T extends SlotSelectArgs ? Promise<SlotGetSelectPayload<ExtractSlotSelectArgs<T>> | null>
  : T extends SlotIncludeArgs ? Promise<SlotGetIncludePayload<ExtractSlotIncludeArgs<T>> | null> : SlotClient<Slot | null>;

  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * AthleteGroup findOne
 */
export type FindOneAthleteGroupArgs = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select?: AthleteGroupSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteGroupInclude | null
  /**
   * Filter, which AthleteGroup to fetch.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type FindOneAthleteGroupArgsRequired = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select: AthleteGroupSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteGroupInclude
  /**
   * Filter, which AthleteGroup to fetch.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type FindOneAthleteGroupSelectArgs = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select: AthleteGroupSelect
  /**
   * Filter, which AthleteGroup to fetch.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type FindOneAthleteGroupSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select?: AthleteGroupSelect | null
  /**
   * Filter, which AthleteGroup to fetch.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type FindOneAthleteGroupIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteGroupInclude
  /**
   * Filter, which AthleteGroup to fetch.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type FindOneAthleteGroupIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteGroupInclude | null
  /**
   * Filter, which AthleteGroup to fetch.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type ExtractFindOneAthleteGroupSelectArgs<S extends undefined | boolean | FindOneAthleteGroupSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneAthleteGroupSelectArgs
  ? S['select']
  : true

export type ExtractFindOneAthleteGroupIncludeArgs<S extends undefined | boolean | FindOneAthleteGroupIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneAthleteGroupIncludeArgs
  ? S['include']
  : true



/**
 * AthleteGroup findMany
 */
export type FindManyAthleteGroupArgs = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select?: AthleteGroupSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteGroupInclude | null
  /**
   * Filter, which AthleteGroups to fetch.
  **/
  where?: AthleteGroupWhereInput | null
  /**
   * Determine the order of the AthleteGroups to fetch.
  **/
  orderBy?: AthleteGroupOrderByInput | null
  /**
   * Skip the first `n` AthleteGroups.
  **/
  skip?: number | null
  /**
   * Get all AthleteGroups that come after the AthleteGroup you provide with the current order.
  **/
  after?: AthleteGroupWhereUniqueInput | null
  /**
   * Get all AthleteGroups that come before the AthleteGroup you provide with the current order.
  **/
  before?: AthleteGroupWhereUniqueInput | null
  /**
   * Get the first `n` AthleteGroups.
  **/
  first?: number | null
  /**
   * Get the last `n` AthleteGroups.
  **/
  last?: number | null
}

export type FindManyAthleteGroupArgsRequired = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select: AthleteGroupSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteGroupInclude
  /**
   * Filter, which AthleteGroups to fetch.
  **/
  where?: AthleteGroupWhereInput | null
  /**
   * Determine the order of the AthleteGroups to fetch.
  **/
  orderBy?: AthleteGroupOrderByInput | null
  /**
   * Skip the first `n` AthleteGroups.
  **/
  skip?: number | null
  /**
   * Get all AthleteGroups that come after the AthleteGroup you provide with the current order.
  **/
  after?: AthleteGroupWhereUniqueInput | null
  /**
   * Get all AthleteGroups that come before the AthleteGroup you provide with the current order.
  **/
  before?: AthleteGroupWhereUniqueInput | null
  /**
   * Get the first `n` AthleteGroups.
  **/
  first?: number | null
  /**
   * Get the last `n` AthleteGroups.
  **/
  last?: number | null
}

export type FindManyAthleteGroupSelectArgs = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select: AthleteGroupSelect
  /**
   * Filter, which AthleteGroups to fetch.
  **/
  where?: AthleteGroupWhereInput | null
  /**
   * Determine the order of the AthleteGroups to fetch.
  **/
  orderBy?: AthleteGroupOrderByInput | null
  /**
   * Skip the first `n` AthleteGroups.
  **/
  skip?: number | null
  /**
   * Get all AthleteGroups that come after the AthleteGroup you provide with the current order.
  **/
  after?: AthleteGroupWhereUniqueInput | null
  /**
   * Get all AthleteGroups that come before the AthleteGroup you provide with the current order.
  **/
  before?: AthleteGroupWhereUniqueInput | null
  /**
   * Get the first `n` AthleteGroups.
  **/
  first?: number | null
  /**
   * Get the last `n` AthleteGroups.
  **/
  last?: number | null
}

export type FindManyAthleteGroupSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select?: AthleteGroupSelect | null
  /**
   * Filter, which AthleteGroups to fetch.
  **/
  where?: AthleteGroupWhereInput | null
  /**
   * Determine the order of the AthleteGroups to fetch.
  **/
  orderBy?: AthleteGroupOrderByInput | null
  /**
   * Skip the first `n` AthleteGroups.
  **/
  skip?: number | null
  /**
   * Get all AthleteGroups that come after the AthleteGroup you provide with the current order.
  **/
  after?: AthleteGroupWhereUniqueInput | null
  /**
   * Get all AthleteGroups that come before the AthleteGroup you provide with the current order.
  **/
  before?: AthleteGroupWhereUniqueInput | null
  /**
   * Get the first `n` AthleteGroups.
  **/
  first?: number | null
  /**
   * Get the last `n` AthleteGroups.
  **/
  last?: number | null
}

export type FindManyAthleteGroupIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteGroupInclude
  /**
   * Filter, which AthleteGroups to fetch.
  **/
  where?: AthleteGroupWhereInput | null
  /**
   * Determine the order of the AthleteGroups to fetch.
  **/
  orderBy?: AthleteGroupOrderByInput | null
  /**
   * Skip the first `n` AthleteGroups.
  **/
  skip?: number | null
  /**
   * Get all AthleteGroups that come after the AthleteGroup you provide with the current order.
  **/
  after?: AthleteGroupWhereUniqueInput | null
  /**
   * Get all AthleteGroups that come before the AthleteGroup you provide with the current order.
  **/
  before?: AthleteGroupWhereUniqueInput | null
  /**
   * Get the first `n` AthleteGroups.
  **/
  first?: number | null
  /**
   * Get the last `n` AthleteGroups.
  **/
  last?: number | null
}

export type FindManyAthleteGroupIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteGroupInclude | null
  /**
   * Filter, which AthleteGroups to fetch.
  **/
  where?: AthleteGroupWhereInput | null
  /**
   * Determine the order of the AthleteGroups to fetch.
  **/
  orderBy?: AthleteGroupOrderByInput | null
  /**
   * Skip the first `n` AthleteGroups.
  **/
  skip?: number | null
  /**
   * Get all AthleteGroups that come after the AthleteGroup you provide with the current order.
  **/
  after?: AthleteGroupWhereUniqueInput | null
  /**
   * Get all AthleteGroups that come before the AthleteGroup you provide with the current order.
  **/
  before?: AthleteGroupWhereUniqueInput | null
  /**
   * Get the first `n` AthleteGroups.
  **/
  first?: number | null
  /**
   * Get the last `n` AthleteGroups.
  **/
  last?: number | null
}

export type ExtractFindManyAthleteGroupSelectArgs<S extends undefined | boolean | FindManyAthleteGroupSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyAthleteGroupSelectArgs
  ? S['select']
  : true

export type ExtractFindManyAthleteGroupIncludeArgs<S extends undefined | boolean | FindManyAthleteGroupIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyAthleteGroupIncludeArgs
  ? S['include']
  : true



/**
 * AthleteGroup create
 */
export type AthleteGroupCreateArgs = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select?: AthleteGroupSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteGroupInclude | null
  /**
   * The data needed to create a AthleteGroup.
  **/
  data: AthleteGroupCreateInput
}

export type AthleteGroupCreateArgsRequired = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select: AthleteGroupSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteGroupInclude
  /**
   * The data needed to create a AthleteGroup.
  **/
  data: AthleteGroupCreateInput
}

export type AthleteGroupSelectCreateArgs = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select: AthleteGroupSelect
  /**
   * The data needed to create a AthleteGroup.
  **/
  data: AthleteGroupCreateInput
}

export type AthleteGroupSelectCreateArgsOptional = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select?: AthleteGroupSelect | null
  /**
   * The data needed to create a AthleteGroup.
  **/
  data: AthleteGroupCreateInput
}

export type AthleteGroupIncludeCreateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteGroupInclude
  /**
   * The data needed to create a AthleteGroup.
  **/
  data: AthleteGroupCreateInput
}

export type AthleteGroupIncludeCreateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteGroupInclude | null
  /**
   * The data needed to create a AthleteGroup.
  **/
  data: AthleteGroupCreateInput
}

export type ExtractAthleteGroupSelectCreateArgs<S extends undefined | boolean | AthleteGroupSelectCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteGroupSelectCreateArgs
  ? S['select']
  : true

export type ExtractAthleteGroupIncludeCreateArgs<S extends undefined | boolean | AthleteGroupIncludeCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteGroupIncludeCreateArgs
  ? S['include']
  : true



/**
 * AthleteGroup update
 */
export type AthleteGroupUpdateArgs = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select?: AthleteGroupSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteGroupInclude | null
  /**
   * The data needed to update a AthleteGroup.
  **/
  data: AthleteGroupUpdateInput
  /**
   * Choose, which AthleteGroup to update.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type AthleteGroupUpdateArgsRequired = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select: AthleteGroupSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteGroupInclude
  /**
   * The data needed to update a AthleteGroup.
  **/
  data: AthleteGroupUpdateInput
  /**
   * Choose, which AthleteGroup to update.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type AthleteGroupSelectUpdateArgs = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select: AthleteGroupSelect
  /**
   * The data needed to update a AthleteGroup.
  **/
  data: AthleteGroupUpdateInput
  /**
   * Choose, which AthleteGroup to update.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type AthleteGroupSelectUpdateArgsOptional = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select?: AthleteGroupSelect | null
  /**
   * The data needed to update a AthleteGroup.
  **/
  data: AthleteGroupUpdateInput
  /**
   * Choose, which AthleteGroup to update.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type AthleteGroupIncludeUpdateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteGroupInclude
  /**
   * The data needed to update a AthleteGroup.
  **/
  data: AthleteGroupUpdateInput
  /**
   * Choose, which AthleteGroup to update.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type AthleteGroupIncludeUpdateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteGroupInclude | null
  /**
   * The data needed to update a AthleteGroup.
  **/
  data: AthleteGroupUpdateInput
  /**
   * Choose, which AthleteGroup to update.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type ExtractAthleteGroupSelectUpdateArgs<S extends undefined | boolean | AthleteGroupSelectUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteGroupSelectUpdateArgs
  ? S['select']
  : true

export type ExtractAthleteGroupIncludeUpdateArgs<S extends undefined | boolean | AthleteGroupIncludeUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteGroupIncludeUpdateArgs
  ? S['include']
  : true



/**
 * AthleteGroup updateMany
 */
export type AthleteGroupUpdateManyArgs = {
  data: AthleteGroupUpdateManyMutationInput
  where?: AthleteGroupWhereInput | null
}


/**
 * AthleteGroup upsert
 */
export type AthleteGroupUpsertArgs = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select?: AthleteGroupSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteGroupInclude | null
  /**
   * The filter to search for the AthleteGroup to update in case it exists.
  **/
  where: AthleteGroupWhereUniqueInput
  /**
   * In case the AthleteGroup found by the `where` argument doesn't exist, create a new AthleteGroup with this data.
  **/
  create: AthleteGroupCreateInput
  /**
   * In case the AthleteGroup was found with the provided `where` argument, update it with this data.
  **/
  update: AthleteGroupUpdateInput
}

export type AthleteGroupUpsertArgsRequired = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select: AthleteGroupSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteGroupInclude
  /**
   * The filter to search for the AthleteGroup to update in case it exists.
  **/
  where: AthleteGroupWhereUniqueInput
  /**
   * In case the AthleteGroup found by the `where` argument doesn't exist, create a new AthleteGroup with this data.
  **/
  create: AthleteGroupCreateInput
  /**
   * In case the AthleteGroup was found with the provided `where` argument, update it with this data.
  **/
  update: AthleteGroupUpdateInput
}

export type AthleteGroupSelectUpsertArgs = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select: AthleteGroupSelect
  /**
   * The filter to search for the AthleteGroup to update in case it exists.
  **/
  where: AthleteGroupWhereUniqueInput
  /**
   * In case the AthleteGroup found by the `where` argument doesn't exist, create a new AthleteGroup with this data.
  **/
  create: AthleteGroupCreateInput
  /**
   * In case the AthleteGroup was found with the provided `where` argument, update it with this data.
  **/
  update: AthleteGroupUpdateInput
}

export type AthleteGroupSelectUpsertArgsOptional = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select?: AthleteGroupSelect | null
  /**
   * The filter to search for the AthleteGroup to update in case it exists.
  **/
  where: AthleteGroupWhereUniqueInput
  /**
   * In case the AthleteGroup found by the `where` argument doesn't exist, create a new AthleteGroup with this data.
  **/
  create: AthleteGroupCreateInput
  /**
   * In case the AthleteGroup was found with the provided `where` argument, update it with this data.
  **/
  update: AthleteGroupUpdateInput
}

export type AthleteGroupIncludeUpsertArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteGroupInclude
  /**
   * The filter to search for the AthleteGroup to update in case it exists.
  **/
  where: AthleteGroupWhereUniqueInput
  /**
   * In case the AthleteGroup found by the `where` argument doesn't exist, create a new AthleteGroup with this data.
  **/
  create: AthleteGroupCreateInput
  /**
   * In case the AthleteGroup was found with the provided `where` argument, update it with this data.
  **/
  update: AthleteGroupUpdateInput
}

export type AthleteGroupIncludeUpsertArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteGroupInclude | null
  /**
   * The filter to search for the AthleteGroup to update in case it exists.
  **/
  where: AthleteGroupWhereUniqueInput
  /**
   * In case the AthleteGroup found by the `where` argument doesn't exist, create a new AthleteGroup with this data.
  **/
  create: AthleteGroupCreateInput
  /**
   * In case the AthleteGroup was found with the provided `where` argument, update it with this data.
  **/
  update: AthleteGroupUpdateInput
}

export type ExtractAthleteGroupSelectUpsertArgs<S extends undefined | boolean | AthleteGroupSelectUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteGroupSelectUpsertArgs
  ? S['select']
  : true

export type ExtractAthleteGroupIncludeUpsertArgs<S extends undefined | boolean | AthleteGroupIncludeUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteGroupIncludeUpsertArgs
  ? S['include']
  : true



/**
 * AthleteGroup delete
 */
export type AthleteGroupDeleteArgs = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select?: AthleteGroupSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteGroupInclude | null
  /**
   * Filter which AthleteGroup to delete.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type AthleteGroupDeleteArgsRequired = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select: AthleteGroupSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteGroupInclude
  /**
   * Filter which AthleteGroup to delete.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type AthleteGroupSelectDeleteArgs = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select: AthleteGroupSelect
  /**
   * Filter which AthleteGroup to delete.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type AthleteGroupSelectDeleteArgsOptional = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select?: AthleteGroupSelect | null
  /**
   * Filter which AthleteGroup to delete.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type AthleteGroupIncludeDeleteArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteGroupInclude
  /**
   * Filter which AthleteGroup to delete.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type AthleteGroupIncludeDeleteArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteGroupInclude | null
  /**
   * Filter which AthleteGroup to delete.
  **/
  where: AthleteGroupWhereUniqueInput
}

export type ExtractAthleteGroupSelectDeleteArgs<S extends undefined | boolean | AthleteGroupSelectDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteGroupSelectDeleteArgs
  ? S['select']
  : true

export type ExtractAthleteGroupIncludeDeleteArgs<S extends undefined | boolean | AthleteGroupIncludeDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteGroupIncludeDeleteArgs
  ? S['include']
  : true



/**
 * AthleteGroup deleteMany
 */
export type AthleteGroupDeleteManyArgs = {
  where?: AthleteGroupWhereInput | null
}


/**
 * AthleteGroup without action
 */
export type AthleteGroupArgs = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select?: AthleteGroupSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteGroupInclude | null
}

export type AthleteGroupArgsRequired = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select: AthleteGroupSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteGroupInclude
}

export type AthleteGroupSelectArgs = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select: AthleteGroupSelect
}

export type AthleteGroupSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the AthleteGroup
  **/
  select?: AthleteGroupSelect | null
}

export type AthleteGroupIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AthleteGroupInclude
}

export type AthleteGroupIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AthleteGroupInclude | null
}

export type ExtractAthleteGroupSelectArgs<S extends undefined | boolean | AthleteGroupSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteGroupSelectArgs
  ? S['select']
  : true

export type ExtractAthleteGroupIncludeArgs<S extends undefined | boolean | AthleteGroupIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AthleteGroupIncludeArgs
  ? S['include']
  : true




/**
 * Model Attempt
 */

export type Attempt = {
  id: string
  createdAt: Date
  updatedAt: Date
  discipline: Discipline
  date: Date
  index: number
  weight: number
  raw: boolean
  valid: boolean
  done: boolean
  resign: boolean
}

export type AttemptScalars = 'id' | 'createdAt' | 'updatedAt' | 'discipline' | 'date' | 'index' | 'weight' | 'raw' | 'valid' | 'done' | 'resign'
  

export type AttemptSelect = {
  id?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  discipline?: boolean
  date?: boolean
  index?: boolean
  weight?: boolean
  raw?: boolean
  valid?: boolean
  done?: boolean
  resign?: boolean
  athlete?: boolean | AthleteSelectArgsOptional
}

export type AttemptInclude = {
  athlete?: boolean | AthleteIncludeArgsOptional
}

type AttemptDefault = {
  id: true
  createdAt: true
  updatedAt: true
  discipline: true
  date: true
  index: true
  weight: true
  raw: true
  valid: true
  done: true
  resign: true
}


export type AttemptGetSelectPayload<S extends boolean | AttemptSelect> = S extends true
  ? Attempt
  : S extends AttemptSelect
  ? {
      [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends AttemptScalars
        ? Attempt[P]
        : P extends 'athlete'
        ? AthleteGetSelectPayload<ExtractAthleteSelectArgs<S[P]>>
        : never
    }
   : never

export type AttemptGetIncludePayload<S extends boolean | AttemptInclude> = S extends true
  ? Attempt
  : S extends AttemptInclude
  ? {
      [P in CleanupNever<MergeTruthyValues<AttemptDefault, S>>]: P extends AttemptScalars
        ? Attempt[P]
        : P extends 'athlete'
        ? AthleteGetIncludePayload<ExtractAthleteIncludeArgs<S[P]>>
        : never
    }
   : never

export interface AttemptDelegate {
  /**
   * Find zero or one Attempt.
   * @param {FindOneAttemptArgs} args - Arguments to find a Attempt
   * @example
   * // Get one Attempt
   * const attempt = await prisma.attempt.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneAttemptArgs>(
    args: Subset<T, FindOneAttemptArgs>
  ): T extends FindOneAttemptArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneAttemptSelectArgs ? Promise<AttemptGetSelectPayload<ExtractFindOneAttemptSelectArgs<T>> | null>
  : T extends FindOneAttemptIncludeArgs ? Promise<AttemptGetIncludePayload<ExtractFindOneAttemptIncludeArgs<T>> | null> : AttemptClient<Attempt | null>
  /**
   * Find zero or more Attempts.
   * @param {FindManyAttemptArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Attempts
   * const attempts = await prisma.attempt.findMany()
   * 
   * // Get first 10 Attempts
   * const attempts = await prisma.attempt.findMany({ first: 10 })
   * 
   * // Only select the `id`
   * const attemptWithIdOnly = await prisma.attempt.findMany({ select: { id: true } })
   * 
  **/
  findMany<T extends FindManyAttemptArgs>(
    args?: Subset<T, FindManyAttemptArgs>
  ): T extends FindManyAttemptArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyAttemptSelectArgs
  ? Promise<Array<AttemptGetSelectPayload<ExtractFindManyAttemptSelectArgs<T>>>> : T extends FindManyAttemptIncludeArgs
  ? Promise<Array<AttemptGetIncludePayload<ExtractFindManyAttemptIncludeArgs<T>>>> : Promise<Array<Attempt>>
  /**
   * Create a Attempt.
   * @param {AttemptCreateArgs} args - Arguments to create a Attempt.
   * @example
   * // Create one Attempt
   * const user = await prisma.attempt.create({
   *   data: {
   *     // ... data to create a Attempt
   *   }
   * })
   * 
  **/
  create<T extends AttemptCreateArgs>(
    args: Subset<T, AttemptCreateArgs>
  ): T extends AttemptCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends AttemptSelectCreateArgs ? Promise<AttemptGetSelectPayload<ExtractAttemptSelectCreateArgs<T>>>
  : T extends AttemptIncludeCreateArgs ? Promise<AttemptGetIncludePayload<ExtractAttemptIncludeCreateArgs<T>>> : AttemptClient<Attempt>
  /**
   * Delete a Attempt.
   * @param {AttemptDeleteArgs} args - Arguments to delete one Attempt.
   * @example
   * // Delete one Attempt
   * const user = await prisma.attempt.delete({
   *   where: {
   *     // ... filter to delete one Attempt
   *   }
   * })
   * 
  **/
  delete<T extends AttemptDeleteArgs>(
    args: Subset<T, AttemptDeleteArgs>
  ): T extends AttemptDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends AttemptSelectDeleteArgs ? Promise<AttemptGetSelectPayload<ExtractAttemptSelectDeleteArgs<T>>>
  : T extends AttemptIncludeDeleteArgs ? Promise<AttemptGetIncludePayload<ExtractAttemptIncludeDeleteArgs<T>>> : AttemptClient<Attempt>
  /**
   * Update one Attempt.
   * @param {AttemptUpdateArgs} args - Arguments to update one Attempt.
   * @example
   * // Update one Attempt
   * const attempt = await prisma.attempt.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends AttemptUpdateArgs>(
    args: Subset<T, AttemptUpdateArgs>
  ): T extends AttemptUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends AttemptSelectUpdateArgs ? Promise<AttemptGetSelectPayload<ExtractAttemptSelectUpdateArgs<T>>>
  : T extends AttemptIncludeUpdateArgs ? Promise<AttemptGetIncludePayload<ExtractAttemptIncludeUpdateArgs<T>>> : AttemptClient<Attempt>
  /**
   * Delete zero or more Attempts.
   * @param {AttemptDeleteManyArgs} args - Arguments to filter Attempts to delete.
   * @example
   * // Delete a few Attempts
   * const { count } = await prisma.attempt.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends AttemptDeleteManyArgs>(
    args: Subset<T, AttemptDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Attempts.
   * @param {AttemptUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Attempts
   * const attempt = await prisma.attempt.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  updateMany<T extends AttemptUpdateManyArgs>(
    args: Subset<T, AttemptUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one Attempt.
   * @param {AttemptUpsertArgs} args - Arguments to update or create a Attempt.
   * @example
   * // Update or create a Attempt
   * const attempt = await prisma.attempt.upsert({
   *   create: {
   *     // ... data to create a Attempt
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Attempt we want to update
   *   }
   * })
  **/
  upsert<T extends AttemptUpsertArgs>(
    args: Subset<T, AttemptUpsertArgs>
  ): T extends AttemptUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends AttemptSelectUpsertArgs ? Promise<AttemptGetSelectPayload<ExtractAttemptSelectUpsertArgs<T>>>
  : T extends AttemptIncludeUpsertArgs ? Promise<AttemptGetIncludePayload<ExtractAttemptIncludeUpsertArgs<T>>> : AttemptClient<Attempt>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class AttemptClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  private _collectTimestamps?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  athlete<T extends AthleteArgs = {}>(args?: Subset<T, AthleteArgs>): T extends FindOneAthleteArgsRequired ? 'Please either choose `select` or `include`' : T extends AthleteSelectArgs ? Promise<AthleteGetSelectPayload<ExtractAthleteSelectArgs<T>> | null>
  : T extends AthleteIncludeArgs ? Promise<AthleteGetIncludePayload<ExtractAthleteIncludeArgs<T>> | null> : AthleteClient<Athlete | null>;

  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * Attempt findOne
 */
export type FindOneAttemptArgs = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select?: AttemptSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AttemptInclude | null
  /**
   * Filter, which Attempt to fetch.
  **/
  where: AttemptWhereUniqueInput
}

export type FindOneAttemptArgsRequired = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select: AttemptSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AttemptInclude
  /**
   * Filter, which Attempt to fetch.
  **/
  where: AttemptWhereUniqueInput
}

export type FindOneAttemptSelectArgs = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select: AttemptSelect
  /**
   * Filter, which Attempt to fetch.
  **/
  where: AttemptWhereUniqueInput
}

export type FindOneAttemptSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select?: AttemptSelect | null
  /**
   * Filter, which Attempt to fetch.
  **/
  where: AttemptWhereUniqueInput
}

export type FindOneAttemptIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AttemptInclude
  /**
   * Filter, which Attempt to fetch.
  **/
  where: AttemptWhereUniqueInput
}

export type FindOneAttemptIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AttemptInclude | null
  /**
   * Filter, which Attempt to fetch.
  **/
  where: AttemptWhereUniqueInput
}

export type ExtractFindOneAttemptSelectArgs<S extends undefined | boolean | FindOneAttemptSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneAttemptSelectArgs
  ? S['select']
  : true

export type ExtractFindOneAttemptIncludeArgs<S extends undefined | boolean | FindOneAttemptIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneAttemptIncludeArgs
  ? S['include']
  : true



/**
 * Attempt findMany
 */
export type FindManyAttemptArgs = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select?: AttemptSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AttemptInclude | null
  /**
   * Filter, which Attempts to fetch.
  **/
  where?: AttemptWhereInput | null
  /**
   * Determine the order of the Attempts to fetch.
  **/
  orderBy?: AttemptOrderByInput | null
  /**
   * Skip the first `n` Attempts.
  **/
  skip?: number | null
  /**
   * Get all Attempts that come after the Attempt you provide with the current order.
  **/
  after?: AttemptWhereUniqueInput | null
  /**
   * Get all Attempts that come before the Attempt you provide with the current order.
  **/
  before?: AttemptWhereUniqueInput | null
  /**
   * Get the first `n` Attempts.
  **/
  first?: number | null
  /**
   * Get the last `n` Attempts.
  **/
  last?: number | null
}

export type FindManyAttemptArgsRequired = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select: AttemptSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AttemptInclude
  /**
   * Filter, which Attempts to fetch.
  **/
  where?: AttemptWhereInput | null
  /**
   * Determine the order of the Attempts to fetch.
  **/
  orderBy?: AttemptOrderByInput | null
  /**
   * Skip the first `n` Attempts.
  **/
  skip?: number | null
  /**
   * Get all Attempts that come after the Attempt you provide with the current order.
  **/
  after?: AttemptWhereUniqueInput | null
  /**
   * Get all Attempts that come before the Attempt you provide with the current order.
  **/
  before?: AttemptWhereUniqueInput | null
  /**
   * Get the first `n` Attempts.
  **/
  first?: number | null
  /**
   * Get the last `n` Attempts.
  **/
  last?: number | null
}

export type FindManyAttemptSelectArgs = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select: AttemptSelect
  /**
   * Filter, which Attempts to fetch.
  **/
  where?: AttemptWhereInput | null
  /**
   * Determine the order of the Attempts to fetch.
  **/
  orderBy?: AttemptOrderByInput | null
  /**
   * Skip the first `n` Attempts.
  **/
  skip?: number | null
  /**
   * Get all Attempts that come after the Attempt you provide with the current order.
  **/
  after?: AttemptWhereUniqueInput | null
  /**
   * Get all Attempts that come before the Attempt you provide with the current order.
  **/
  before?: AttemptWhereUniqueInput | null
  /**
   * Get the first `n` Attempts.
  **/
  first?: number | null
  /**
   * Get the last `n` Attempts.
  **/
  last?: number | null
}

export type FindManyAttemptSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select?: AttemptSelect | null
  /**
   * Filter, which Attempts to fetch.
  **/
  where?: AttemptWhereInput | null
  /**
   * Determine the order of the Attempts to fetch.
  **/
  orderBy?: AttemptOrderByInput | null
  /**
   * Skip the first `n` Attempts.
  **/
  skip?: number | null
  /**
   * Get all Attempts that come after the Attempt you provide with the current order.
  **/
  after?: AttemptWhereUniqueInput | null
  /**
   * Get all Attempts that come before the Attempt you provide with the current order.
  **/
  before?: AttemptWhereUniqueInput | null
  /**
   * Get the first `n` Attempts.
  **/
  first?: number | null
  /**
   * Get the last `n` Attempts.
  **/
  last?: number | null
}

export type FindManyAttemptIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AttemptInclude
  /**
   * Filter, which Attempts to fetch.
  **/
  where?: AttemptWhereInput | null
  /**
   * Determine the order of the Attempts to fetch.
  **/
  orderBy?: AttemptOrderByInput | null
  /**
   * Skip the first `n` Attempts.
  **/
  skip?: number | null
  /**
   * Get all Attempts that come after the Attempt you provide with the current order.
  **/
  after?: AttemptWhereUniqueInput | null
  /**
   * Get all Attempts that come before the Attempt you provide with the current order.
  **/
  before?: AttemptWhereUniqueInput | null
  /**
   * Get the first `n` Attempts.
  **/
  first?: number | null
  /**
   * Get the last `n` Attempts.
  **/
  last?: number | null
}

export type FindManyAttemptIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AttemptInclude | null
  /**
   * Filter, which Attempts to fetch.
  **/
  where?: AttemptWhereInput | null
  /**
   * Determine the order of the Attempts to fetch.
  **/
  orderBy?: AttemptOrderByInput | null
  /**
   * Skip the first `n` Attempts.
  **/
  skip?: number | null
  /**
   * Get all Attempts that come after the Attempt you provide with the current order.
  **/
  after?: AttemptWhereUniqueInput | null
  /**
   * Get all Attempts that come before the Attempt you provide with the current order.
  **/
  before?: AttemptWhereUniqueInput | null
  /**
   * Get the first `n` Attempts.
  **/
  first?: number | null
  /**
   * Get the last `n` Attempts.
  **/
  last?: number | null
}

export type ExtractFindManyAttemptSelectArgs<S extends undefined | boolean | FindManyAttemptSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyAttemptSelectArgs
  ? S['select']
  : true

export type ExtractFindManyAttemptIncludeArgs<S extends undefined | boolean | FindManyAttemptIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyAttemptIncludeArgs
  ? S['include']
  : true



/**
 * Attempt create
 */
export type AttemptCreateArgs = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select?: AttemptSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AttemptInclude | null
  /**
   * The data needed to create a Attempt.
  **/
  data: AttemptCreateInput
}

export type AttemptCreateArgsRequired = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select: AttemptSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AttemptInclude
  /**
   * The data needed to create a Attempt.
  **/
  data: AttemptCreateInput
}

export type AttemptSelectCreateArgs = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select: AttemptSelect
  /**
   * The data needed to create a Attempt.
  **/
  data: AttemptCreateInput
}

export type AttemptSelectCreateArgsOptional = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select?: AttemptSelect | null
  /**
   * The data needed to create a Attempt.
  **/
  data: AttemptCreateInput
}

export type AttemptIncludeCreateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AttemptInclude
  /**
   * The data needed to create a Attempt.
  **/
  data: AttemptCreateInput
}

export type AttemptIncludeCreateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AttemptInclude | null
  /**
   * The data needed to create a Attempt.
  **/
  data: AttemptCreateInput
}

export type ExtractAttemptSelectCreateArgs<S extends undefined | boolean | AttemptSelectCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AttemptSelectCreateArgs
  ? S['select']
  : true

export type ExtractAttemptIncludeCreateArgs<S extends undefined | boolean | AttemptIncludeCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AttemptIncludeCreateArgs
  ? S['include']
  : true



/**
 * Attempt update
 */
export type AttemptUpdateArgs = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select?: AttemptSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AttemptInclude | null
  /**
   * The data needed to update a Attempt.
  **/
  data: AttemptUpdateInput
  /**
   * Choose, which Attempt to update.
  **/
  where: AttemptWhereUniqueInput
}

export type AttemptUpdateArgsRequired = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select: AttemptSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AttemptInclude
  /**
   * The data needed to update a Attempt.
  **/
  data: AttemptUpdateInput
  /**
   * Choose, which Attempt to update.
  **/
  where: AttemptWhereUniqueInput
}

export type AttemptSelectUpdateArgs = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select: AttemptSelect
  /**
   * The data needed to update a Attempt.
  **/
  data: AttemptUpdateInput
  /**
   * Choose, which Attempt to update.
  **/
  where: AttemptWhereUniqueInput
}

export type AttemptSelectUpdateArgsOptional = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select?: AttemptSelect | null
  /**
   * The data needed to update a Attempt.
  **/
  data: AttemptUpdateInput
  /**
   * Choose, which Attempt to update.
  **/
  where: AttemptWhereUniqueInput
}

export type AttemptIncludeUpdateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AttemptInclude
  /**
   * The data needed to update a Attempt.
  **/
  data: AttemptUpdateInput
  /**
   * Choose, which Attempt to update.
  **/
  where: AttemptWhereUniqueInput
}

export type AttemptIncludeUpdateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AttemptInclude | null
  /**
   * The data needed to update a Attempt.
  **/
  data: AttemptUpdateInput
  /**
   * Choose, which Attempt to update.
  **/
  where: AttemptWhereUniqueInput
}

export type ExtractAttemptSelectUpdateArgs<S extends undefined | boolean | AttemptSelectUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AttemptSelectUpdateArgs
  ? S['select']
  : true

export type ExtractAttemptIncludeUpdateArgs<S extends undefined | boolean | AttemptIncludeUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AttemptIncludeUpdateArgs
  ? S['include']
  : true



/**
 * Attempt updateMany
 */
export type AttemptUpdateManyArgs = {
  data: AttemptUpdateManyMutationInput
  where?: AttemptWhereInput | null
}


/**
 * Attempt upsert
 */
export type AttemptUpsertArgs = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select?: AttemptSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AttemptInclude | null
  /**
   * The filter to search for the Attempt to update in case it exists.
  **/
  where: AttemptWhereUniqueInput
  /**
   * In case the Attempt found by the `where` argument doesn't exist, create a new Attempt with this data.
  **/
  create: AttemptCreateInput
  /**
   * In case the Attempt was found with the provided `where` argument, update it with this data.
  **/
  update: AttemptUpdateInput
}

export type AttemptUpsertArgsRequired = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select: AttemptSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AttemptInclude
  /**
   * The filter to search for the Attempt to update in case it exists.
  **/
  where: AttemptWhereUniqueInput
  /**
   * In case the Attempt found by the `where` argument doesn't exist, create a new Attempt with this data.
  **/
  create: AttemptCreateInput
  /**
   * In case the Attempt was found with the provided `where` argument, update it with this data.
  **/
  update: AttemptUpdateInput
}

export type AttemptSelectUpsertArgs = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select: AttemptSelect
  /**
   * The filter to search for the Attempt to update in case it exists.
  **/
  where: AttemptWhereUniqueInput
  /**
   * In case the Attempt found by the `where` argument doesn't exist, create a new Attempt with this data.
  **/
  create: AttemptCreateInput
  /**
   * In case the Attempt was found with the provided `where` argument, update it with this data.
  **/
  update: AttemptUpdateInput
}

export type AttemptSelectUpsertArgsOptional = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select?: AttemptSelect | null
  /**
   * The filter to search for the Attempt to update in case it exists.
  **/
  where: AttemptWhereUniqueInput
  /**
   * In case the Attempt found by the `where` argument doesn't exist, create a new Attempt with this data.
  **/
  create: AttemptCreateInput
  /**
   * In case the Attempt was found with the provided `where` argument, update it with this data.
  **/
  update: AttemptUpdateInput
}

export type AttemptIncludeUpsertArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AttemptInclude
  /**
   * The filter to search for the Attempt to update in case it exists.
  **/
  where: AttemptWhereUniqueInput
  /**
   * In case the Attempt found by the `where` argument doesn't exist, create a new Attempt with this data.
  **/
  create: AttemptCreateInput
  /**
   * In case the Attempt was found with the provided `where` argument, update it with this data.
  **/
  update: AttemptUpdateInput
}

export type AttemptIncludeUpsertArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AttemptInclude | null
  /**
   * The filter to search for the Attempt to update in case it exists.
  **/
  where: AttemptWhereUniqueInput
  /**
   * In case the Attempt found by the `where` argument doesn't exist, create a new Attempt with this data.
  **/
  create: AttemptCreateInput
  /**
   * In case the Attempt was found with the provided `where` argument, update it with this data.
  **/
  update: AttemptUpdateInput
}

export type ExtractAttemptSelectUpsertArgs<S extends undefined | boolean | AttemptSelectUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AttemptSelectUpsertArgs
  ? S['select']
  : true

export type ExtractAttemptIncludeUpsertArgs<S extends undefined | boolean | AttemptIncludeUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AttemptIncludeUpsertArgs
  ? S['include']
  : true



/**
 * Attempt delete
 */
export type AttemptDeleteArgs = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select?: AttemptSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AttemptInclude | null
  /**
   * Filter which Attempt to delete.
  **/
  where: AttemptWhereUniqueInput
}

export type AttemptDeleteArgsRequired = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select: AttemptSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AttemptInclude
  /**
   * Filter which Attempt to delete.
  **/
  where: AttemptWhereUniqueInput
}

export type AttemptSelectDeleteArgs = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select: AttemptSelect
  /**
   * Filter which Attempt to delete.
  **/
  where: AttemptWhereUniqueInput
}

export type AttemptSelectDeleteArgsOptional = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select?: AttemptSelect | null
  /**
   * Filter which Attempt to delete.
  **/
  where: AttemptWhereUniqueInput
}

export type AttemptIncludeDeleteArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AttemptInclude
  /**
   * Filter which Attempt to delete.
  **/
  where: AttemptWhereUniqueInput
}

export type AttemptIncludeDeleteArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AttemptInclude | null
  /**
   * Filter which Attempt to delete.
  **/
  where: AttemptWhereUniqueInput
}

export type ExtractAttemptSelectDeleteArgs<S extends undefined | boolean | AttemptSelectDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AttemptSelectDeleteArgs
  ? S['select']
  : true

export type ExtractAttemptIncludeDeleteArgs<S extends undefined | boolean | AttemptIncludeDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AttemptIncludeDeleteArgs
  ? S['include']
  : true



/**
 * Attempt deleteMany
 */
export type AttemptDeleteManyArgs = {
  where?: AttemptWhereInput | null
}


/**
 * Attempt without action
 */
export type AttemptArgs = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select?: AttemptSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AttemptInclude | null
}

export type AttemptArgsRequired = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select: AttemptSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AttemptInclude
}

export type AttemptSelectArgs = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select: AttemptSelect
}

export type AttemptSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Attempt
  **/
  select?: AttemptSelect | null
}

export type AttemptIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AttemptInclude
}

export type AttemptIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AttemptInclude | null
}

export type ExtractAttemptSelectArgs<S extends undefined | boolean | AttemptSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AttemptSelectArgs
  ? S['select']
  : true

export type ExtractAttemptIncludeArgs<S extends undefined | boolean | AttemptIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AttemptIncludeArgs
  ? S['include']
  : true




/**
 * Model WeightClass
 */

export type WeightClass = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  gender: Gender
  min: number
  max: number
}

export type WeightClassScalars = 'id' | 'createdAt' | 'updatedAt' | 'name' | 'gender' | 'min' | 'max'
  

export type WeightClassSelect = {
  id?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  name?: boolean
  gender?: boolean
  min?: boolean
  max?: boolean
  athletes?: boolean | FindManyAthleteSelectArgsOptional
}

export type WeightClassInclude = {
  athletes?: boolean | FindManyAthleteIncludeArgsOptional
}

type WeightClassDefault = {
  id: true
  createdAt: true
  updatedAt: true
  name: true
  gender: true
  min: true
  max: true
}


export type WeightClassGetSelectPayload<S extends boolean | WeightClassSelect> = S extends true
  ? WeightClass
  : S extends WeightClassSelect
  ? {
      [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends WeightClassScalars
        ? WeightClass[P]
        : P extends 'athletes'
        ? Array<AthleteGetSelectPayload<ExtractFindManyAthleteSelectArgs<S[P]>>>
        : never
    }
   : never

export type WeightClassGetIncludePayload<S extends boolean | WeightClassInclude> = S extends true
  ? WeightClass
  : S extends WeightClassInclude
  ? {
      [P in CleanupNever<MergeTruthyValues<WeightClassDefault, S>>]: P extends WeightClassScalars
        ? WeightClass[P]
        : P extends 'athletes'
        ? Array<AthleteGetIncludePayload<ExtractFindManyAthleteIncludeArgs<S[P]>>>
        : never
    }
   : never

export interface WeightClassDelegate {
  /**
   * Find zero or one WeightClass.
   * @param {FindOneWeightClassArgs} args - Arguments to find a WeightClass
   * @example
   * // Get one WeightClass
   * const weightClass = await prisma.weightClass.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneWeightClassArgs>(
    args: Subset<T, FindOneWeightClassArgs>
  ): T extends FindOneWeightClassArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneWeightClassSelectArgs ? Promise<WeightClassGetSelectPayload<ExtractFindOneWeightClassSelectArgs<T>> | null>
  : T extends FindOneWeightClassIncludeArgs ? Promise<WeightClassGetIncludePayload<ExtractFindOneWeightClassIncludeArgs<T>> | null> : WeightClassClient<WeightClass | null>
  /**
   * Find zero or more WeightClasses.
   * @param {FindManyWeightClassArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all WeightClasses
   * const weightClasses = await prisma.weightClass.findMany()
   * 
   * // Get first 10 WeightClasses
   * const weightClasses = await prisma.weightClass.findMany({ first: 10 })
   * 
   * // Only select the `id`
   * const weightClassWithIdOnly = await prisma.weightClass.findMany({ select: { id: true } })
   * 
  **/
  findMany<T extends FindManyWeightClassArgs>(
    args?: Subset<T, FindManyWeightClassArgs>
  ): T extends FindManyWeightClassArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyWeightClassSelectArgs
  ? Promise<Array<WeightClassGetSelectPayload<ExtractFindManyWeightClassSelectArgs<T>>>> : T extends FindManyWeightClassIncludeArgs
  ? Promise<Array<WeightClassGetIncludePayload<ExtractFindManyWeightClassIncludeArgs<T>>>> : Promise<Array<WeightClass>>
  /**
   * Create a WeightClass.
   * @param {WeightClassCreateArgs} args - Arguments to create a WeightClass.
   * @example
   * // Create one WeightClass
   * const user = await prisma.weightClass.create({
   *   data: {
   *     // ... data to create a WeightClass
   *   }
   * })
   * 
  **/
  create<T extends WeightClassCreateArgs>(
    args: Subset<T, WeightClassCreateArgs>
  ): T extends WeightClassCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends WeightClassSelectCreateArgs ? Promise<WeightClassGetSelectPayload<ExtractWeightClassSelectCreateArgs<T>>>
  : T extends WeightClassIncludeCreateArgs ? Promise<WeightClassGetIncludePayload<ExtractWeightClassIncludeCreateArgs<T>>> : WeightClassClient<WeightClass>
  /**
   * Delete a WeightClass.
   * @param {WeightClassDeleteArgs} args - Arguments to delete one WeightClass.
   * @example
   * // Delete one WeightClass
   * const user = await prisma.weightClass.delete({
   *   where: {
   *     // ... filter to delete one WeightClass
   *   }
   * })
   * 
  **/
  delete<T extends WeightClassDeleteArgs>(
    args: Subset<T, WeightClassDeleteArgs>
  ): T extends WeightClassDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends WeightClassSelectDeleteArgs ? Promise<WeightClassGetSelectPayload<ExtractWeightClassSelectDeleteArgs<T>>>
  : T extends WeightClassIncludeDeleteArgs ? Promise<WeightClassGetIncludePayload<ExtractWeightClassIncludeDeleteArgs<T>>> : WeightClassClient<WeightClass>
  /**
   * Update one WeightClass.
   * @param {WeightClassUpdateArgs} args - Arguments to update one WeightClass.
   * @example
   * // Update one WeightClass
   * const weightClass = await prisma.weightClass.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends WeightClassUpdateArgs>(
    args: Subset<T, WeightClassUpdateArgs>
  ): T extends WeightClassUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends WeightClassSelectUpdateArgs ? Promise<WeightClassGetSelectPayload<ExtractWeightClassSelectUpdateArgs<T>>>
  : T extends WeightClassIncludeUpdateArgs ? Promise<WeightClassGetIncludePayload<ExtractWeightClassIncludeUpdateArgs<T>>> : WeightClassClient<WeightClass>
  /**
   * Delete zero or more WeightClasses.
   * @param {WeightClassDeleteManyArgs} args - Arguments to filter WeightClasses to delete.
   * @example
   * // Delete a few WeightClasses
   * const { count } = await prisma.weightClass.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends WeightClassDeleteManyArgs>(
    args: Subset<T, WeightClassDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more WeightClasses.
   * @param {WeightClassUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many WeightClasses
   * const weightClass = await prisma.weightClass.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  updateMany<T extends WeightClassUpdateManyArgs>(
    args: Subset<T, WeightClassUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one WeightClass.
   * @param {WeightClassUpsertArgs} args - Arguments to update or create a WeightClass.
   * @example
   * // Update or create a WeightClass
   * const weightClass = await prisma.weightClass.upsert({
   *   create: {
   *     // ... data to create a WeightClass
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the WeightClass we want to update
   *   }
   * })
  **/
  upsert<T extends WeightClassUpsertArgs>(
    args: Subset<T, WeightClassUpsertArgs>
  ): T extends WeightClassUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends WeightClassSelectUpsertArgs ? Promise<WeightClassGetSelectPayload<ExtractWeightClassSelectUpsertArgs<T>>>
  : T extends WeightClassIncludeUpsertArgs ? Promise<WeightClassGetIncludePayload<ExtractWeightClassIncludeUpsertArgs<T>>> : WeightClassClient<WeightClass>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class WeightClassClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  private _collectTimestamps?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  athletes<T extends FindManyAthleteArgs = {}>(args?: Subset<T, FindManyAthleteArgs>): T extends FindManyAthleteArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyAthleteSelectArgs
  ? Promise<Array<AthleteGetSelectPayload<ExtractFindManyAthleteSelectArgs<T>>>> : T extends FindManyAthleteIncludeArgs
  ? Promise<Array<AthleteGetIncludePayload<ExtractFindManyAthleteIncludeArgs<T>>>> : Promise<Array<Athlete>>;

  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * WeightClass findOne
 */
export type FindOneWeightClassArgs = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select?: WeightClassSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: WeightClassInclude | null
  /**
   * Filter, which WeightClass to fetch.
  **/
  where: WeightClassWhereUniqueInput
}

export type FindOneWeightClassArgsRequired = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select: WeightClassSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: WeightClassInclude
  /**
   * Filter, which WeightClass to fetch.
  **/
  where: WeightClassWhereUniqueInput
}

export type FindOneWeightClassSelectArgs = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select: WeightClassSelect
  /**
   * Filter, which WeightClass to fetch.
  **/
  where: WeightClassWhereUniqueInput
}

export type FindOneWeightClassSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select?: WeightClassSelect | null
  /**
   * Filter, which WeightClass to fetch.
  **/
  where: WeightClassWhereUniqueInput
}

export type FindOneWeightClassIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: WeightClassInclude
  /**
   * Filter, which WeightClass to fetch.
  **/
  where: WeightClassWhereUniqueInput
}

export type FindOneWeightClassIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: WeightClassInclude | null
  /**
   * Filter, which WeightClass to fetch.
  **/
  where: WeightClassWhereUniqueInput
}

export type ExtractFindOneWeightClassSelectArgs<S extends undefined | boolean | FindOneWeightClassSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneWeightClassSelectArgs
  ? S['select']
  : true

export type ExtractFindOneWeightClassIncludeArgs<S extends undefined | boolean | FindOneWeightClassIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneWeightClassIncludeArgs
  ? S['include']
  : true



/**
 * WeightClass findMany
 */
export type FindManyWeightClassArgs = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select?: WeightClassSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: WeightClassInclude | null
  /**
   * Filter, which WeightClasses to fetch.
  **/
  where?: WeightClassWhereInput | null
  /**
   * Determine the order of the WeightClasses to fetch.
  **/
  orderBy?: WeightClassOrderByInput | null
  /**
   * Skip the first `n` WeightClasses.
  **/
  skip?: number | null
  /**
   * Get all WeightClasses that come after the WeightClass you provide with the current order.
  **/
  after?: WeightClassWhereUniqueInput | null
  /**
   * Get all WeightClasses that come before the WeightClass you provide with the current order.
  **/
  before?: WeightClassWhereUniqueInput | null
  /**
   * Get the first `n` WeightClasses.
  **/
  first?: number | null
  /**
   * Get the last `n` WeightClasses.
  **/
  last?: number | null
}

export type FindManyWeightClassArgsRequired = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select: WeightClassSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: WeightClassInclude
  /**
   * Filter, which WeightClasses to fetch.
  **/
  where?: WeightClassWhereInput | null
  /**
   * Determine the order of the WeightClasses to fetch.
  **/
  orderBy?: WeightClassOrderByInput | null
  /**
   * Skip the first `n` WeightClasses.
  **/
  skip?: number | null
  /**
   * Get all WeightClasses that come after the WeightClass you provide with the current order.
  **/
  after?: WeightClassWhereUniqueInput | null
  /**
   * Get all WeightClasses that come before the WeightClass you provide with the current order.
  **/
  before?: WeightClassWhereUniqueInput | null
  /**
   * Get the first `n` WeightClasses.
  **/
  first?: number | null
  /**
   * Get the last `n` WeightClasses.
  **/
  last?: number | null
}

export type FindManyWeightClassSelectArgs = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select: WeightClassSelect
  /**
   * Filter, which WeightClasses to fetch.
  **/
  where?: WeightClassWhereInput | null
  /**
   * Determine the order of the WeightClasses to fetch.
  **/
  orderBy?: WeightClassOrderByInput | null
  /**
   * Skip the first `n` WeightClasses.
  **/
  skip?: number | null
  /**
   * Get all WeightClasses that come after the WeightClass you provide with the current order.
  **/
  after?: WeightClassWhereUniqueInput | null
  /**
   * Get all WeightClasses that come before the WeightClass you provide with the current order.
  **/
  before?: WeightClassWhereUniqueInput | null
  /**
   * Get the first `n` WeightClasses.
  **/
  first?: number | null
  /**
   * Get the last `n` WeightClasses.
  **/
  last?: number | null
}

export type FindManyWeightClassSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select?: WeightClassSelect | null
  /**
   * Filter, which WeightClasses to fetch.
  **/
  where?: WeightClassWhereInput | null
  /**
   * Determine the order of the WeightClasses to fetch.
  **/
  orderBy?: WeightClassOrderByInput | null
  /**
   * Skip the first `n` WeightClasses.
  **/
  skip?: number | null
  /**
   * Get all WeightClasses that come after the WeightClass you provide with the current order.
  **/
  after?: WeightClassWhereUniqueInput | null
  /**
   * Get all WeightClasses that come before the WeightClass you provide with the current order.
  **/
  before?: WeightClassWhereUniqueInput | null
  /**
   * Get the first `n` WeightClasses.
  **/
  first?: number | null
  /**
   * Get the last `n` WeightClasses.
  **/
  last?: number | null
}

export type FindManyWeightClassIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: WeightClassInclude
  /**
   * Filter, which WeightClasses to fetch.
  **/
  where?: WeightClassWhereInput | null
  /**
   * Determine the order of the WeightClasses to fetch.
  **/
  orderBy?: WeightClassOrderByInput | null
  /**
   * Skip the first `n` WeightClasses.
  **/
  skip?: number | null
  /**
   * Get all WeightClasses that come after the WeightClass you provide with the current order.
  **/
  after?: WeightClassWhereUniqueInput | null
  /**
   * Get all WeightClasses that come before the WeightClass you provide with the current order.
  **/
  before?: WeightClassWhereUniqueInput | null
  /**
   * Get the first `n` WeightClasses.
  **/
  first?: number | null
  /**
   * Get the last `n` WeightClasses.
  **/
  last?: number | null
}

export type FindManyWeightClassIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: WeightClassInclude | null
  /**
   * Filter, which WeightClasses to fetch.
  **/
  where?: WeightClassWhereInput | null
  /**
   * Determine the order of the WeightClasses to fetch.
  **/
  orderBy?: WeightClassOrderByInput | null
  /**
   * Skip the first `n` WeightClasses.
  **/
  skip?: number | null
  /**
   * Get all WeightClasses that come after the WeightClass you provide with the current order.
  **/
  after?: WeightClassWhereUniqueInput | null
  /**
   * Get all WeightClasses that come before the WeightClass you provide with the current order.
  **/
  before?: WeightClassWhereUniqueInput | null
  /**
   * Get the first `n` WeightClasses.
  **/
  first?: number | null
  /**
   * Get the last `n` WeightClasses.
  **/
  last?: number | null
}

export type ExtractFindManyWeightClassSelectArgs<S extends undefined | boolean | FindManyWeightClassSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyWeightClassSelectArgs
  ? S['select']
  : true

export type ExtractFindManyWeightClassIncludeArgs<S extends undefined | boolean | FindManyWeightClassIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyWeightClassIncludeArgs
  ? S['include']
  : true



/**
 * WeightClass create
 */
export type WeightClassCreateArgs = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select?: WeightClassSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: WeightClassInclude | null
  /**
   * The data needed to create a WeightClass.
  **/
  data: WeightClassCreateInput
}

export type WeightClassCreateArgsRequired = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select: WeightClassSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: WeightClassInclude
  /**
   * The data needed to create a WeightClass.
  **/
  data: WeightClassCreateInput
}

export type WeightClassSelectCreateArgs = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select: WeightClassSelect
  /**
   * The data needed to create a WeightClass.
  **/
  data: WeightClassCreateInput
}

export type WeightClassSelectCreateArgsOptional = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select?: WeightClassSelect | null
  /**
   * The data needed to create a WeightClass.
  **/
  data: WeightClassCreateInput
}

export type WeightClassIncludeCreateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: WeightClassInclude
  /**
   * The data needed to create a WeightClass.
  **/
  data: WeightClassCreateInput
}

export type WeightClassIncludeCreateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: WeightClassInclude | null
  /**
   * The data needed to create a WeightClass.
  **/
  data: WeightClassCreateInput
}

export type ExtractWeightClassSelectCreateArgs<S extends undefined | boolean | WeightClassSelectCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends WeightClassSelectCreateArgs
  ? S['select']
  : true

export type ExtractWeightClassIncludeCreateArgs<S extends undefined | boolean | WeightClassIncludeCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends WeightClassIncludeCreateArgs
  ? S['include']
  : true



/**
 * WeightClass update
 */
export type WeightClassUpdateArgs = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select?: WeightClassSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: WeightClassInclude | null
  /**
   * The data needed to update a WeightClass.
  **/
  data: WeightClassUpdateInput
  /**
   * Choose, which WeightClass to update.
  **/
  where: WeightClassWhereUniqueInput
}

export type WeightClassUpdateArgsRequired = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select: WeightClassSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: WeightClassInclude
  /**
   * The data needed to update a WeightClass.
  **/
  data: WeightClassUpdateInput
  /**
   * Choose, which WeightClass to update.
  **/
  where: WeightClassWhereUniqueInput
}

export type WeightClassSelectUpdateArgs = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select: WeightClassSelect
  /**
   * The data needed to update a WeightClass.
  **/
  data: WeightClassUpdateInput
  /**
   * Choose, which WeightClass to update.
  **/
  where: WeightClassWhereUniqueInput
}

export type WeightClassSelectUpdateArgsOptional = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select?: WeightClassSelect | null
  /**
   * The data needed to update a WeightClass.
  **/
  data: WeightClassUpdateInput
  /**
   * Choose, which WeightClass to update.
  **/
  where: WeightClassWhereUniqueInput
}

export type WeightClassIncludeUpdateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: WeightClassInclude
  /**
   * The data needed to update a WeightClass.
  **/
  data: WeightClassUpdateInput
  /**
   * Choose, which WeightClass to update.
  **/
  where: WeightClassWhereUniqueInput
}

export type WeightClassIncludeUpdateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: WeightClassInclude | null
  /**
   * The data needed to update a WeightClass.
  **/
  data: WeightClassUpdateInput
  /**
   * Choose, which WeightClass to update.
  **/
  where: WeightClassWhereUniqueInput
}

export type ExtractWeightClassSelectUpdateArgs<S extends undefined | boolean | WeightClassSelectUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends WeightClassSelectUpdateArgs
  ? S['select']
  : true

export type ExtractWeightClassIncludeUpdateArgs<S extends undefined | boolean | WeightClassIncludeUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends WeightClassIncludeUpdateArgs
  ? S['include']
  : true



/**
 * WeightClass updateMany
 */
export type WeightClassUpdateManyArgs = {
  data: WeightClassUpdateManyMutationInput
  where?: WeightClassWhereInput | null
}


/**
 * WeightClass upsert
 */
export type WeightClassUpsertArgs = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select?: WeightClassSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: WeightClassInclude | null
  /**
   * The filter to search for the WeightClass to update in case it exists.
  **/
  where: WeightClassWhereUniqueInput
  /**
   * In case the WeightClass found by the `where` argument doesn't exist, create a new WeightClass with this data.
  **/
  create: WeightClassCreateInput
  /**
   * In case the WeightClass was found with the provided `where` argument, update it with this data.
  **/
  update: WeightClassUpdateInput
}

export type WeightClassUpsertArgsRequired = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select: WeightClassSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: WeightClassInclude
  /**
   * The filter to search for the WeightClass to update in case it exists.
  **/
  where: WeightClassWhereUniqueInput
  /**
   * In case the WeightClass found by the `where` argument doesn't exist, create a new WeightClass with this data.
  **/
  create: WeightClassCreateInput
  /**
   * In case the WeightClass was found with the provided `where` argument, update it with this data.
  **/
  update: WeightClassUpdateInput
}

export type WeightClassSelectUpsertArgs = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select: WeightClassSelect
  /**
   * The filter to search for the WeightClass to update in case it exists.
  **/
  where: WeightClassWhereUniqueInput
  /**
   * In case the WeightClass found by the `where` argument doesn't exist, create a new WeightClass with this data.
  **/
  create: WeightClassCreateInput
  /**
   * In case the WeightClass was found with the provided `where` argument, update it with this data.
  **/
  update: WeightClassUpdateInput
}

export type WeightClassSelectUpsertArgsOptional = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select?: WeightClassSelect | null
  /**
   * The filter to search for the WeightClass to update in case it exists.
  **/
  where: WeightClassWhereUniqueInput
  /**
   * In case the WeightClass found by the `where` argument doesn't exist, create a new WeightClass with this data.
  **/
  create: WeightClassCreateInput
  /**
   * In case the WeightClass was found with the provided `where` argument, update it with this data.
  **/
  update: WeightClassUpdateInput
}

export type WeightClassIncludeUpsertArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: WeightClassInclude
  /**
   * The filter to search for the WeightClass to update in case it exists.
  **/
  where: WeightClassWhereUniqueInput
  /**
   * In case the WeightClass found by the `where` argument doesn't exist, create a new WeightClass with this data.
  **/
  create: WeightClassCreateInput
  /**
   * In case the WeightClass was found with the provided `where` argument, update it with this data.
  **/
  update: WeightClassUpdateInput
}

export type WeightClassIncludeUpsertArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: WeightClassInclude | null
  /**
   * The filter to search for the WeightClass to update in case it exists.
  **/
  where: WeightClassWhereUniqueInput
  /**
   * In case the WeightClass found by the `where` argument doesn't exist, create a new WeightClass with this data.
  **/
  create: WeightClassCreateInput
  /**
   * In case the WeightClass was found with the provided `where` argument, update it with this data.
  **/
  update: WeightClassUpdateInput
}

export type ExtractWeightClassSelectUpsertArgs<S extends undefined | boolean | WeightClassSelectUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends WeightClassSelectUpsertArgs
  ? S['select']
  : true

export type ExtractWeightClassIncludeUpsertArgs<S extends undefined | boolean | WeightClassIncludeUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends WeightClassIncludeUpsertArgs
  ? S['include']
  : true



/**
 * WeightClass delete
 */
export type WeightClassDeleteArgs = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select?: WeightClassSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: WeightClassInclude | null
  /**
   * Filter which WeightClass to delete.
  **/
  where: WeightClassWhereUniqueInput
}

export type WeightClassDeleteArgsRequired = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select: WeightClassSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: WeightClassInclude
  /**
   * Filter which WeightClass to delete.
  **/
  where: WeightClassWhereUniqueInput
}

export type WeightClassSelectDeleteArgs = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select: WeightClassSelect
  /**
   * Filter which WeightClass to delete.
  **/
  where: WeightClassWhereUniqueInput
}

export type WeightClassSelectDeleteArgsOptional = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select?: WeightClassSelect | null
  /**
   * Filter which WeightClass to delete.
  **/
  where: WeightClassWhereUniqueInput
}

export type WeightClassIncludeDeleteArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: WeightClassInclude
  /**
   * Filter which WeightClass to delete.
  **/
  where: WeightClassWhereUniqueInput
}

export type WeightClassIncludeDeleteArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: WeightClassInclude | null
  /**
   * Filter which WeightClass to delete.
  **/
  where: WeightClassWhereUniqueInput
}

export type ExtractWeightClassSelectDeleteArgs<S extends undefined | boolean | WeightClassSelectDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends WeightClassSelectDeleteArgs
  ? S['select']
  : true

export type ExtractWeightClassIncludeDeleteArgs<S extends undefined | boolean | WeightClassIncludeDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends WeightClassIncludeDeleteArgs
  ? S['include']
  : true



/**
 * WeightClass deleteMany
 */
export type WeightClassDeleteManyArgs = {
  where?: WeightClassWhereInput | null
}


/**
 * WeightClass without action
 */
export type WeightClassArgs = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select?: WeightClassSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: WeightClassInclude | null
}

export type WeightClassArgsRequired = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select: WeightClassSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: WeightClassInclude
}

export type WeightClassSelectArgs = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select: WeightClassSelect
}

export type WeightClassSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the WeightClass
  **/
  select?: WeightClassSelect | null
}

export type WeightClassIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: WeightClassInclude
}

export type WeightClassIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: WeightClassInclude | null
}

export type ExtractWeightClassSelectArgs<S extends undefined | boolean | WeightClassSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends WeightClassSelectArgs
  ? S['select']
  : true

export type ExtractWeightClassIncludeArgs<S extends undefined | boolean | WeightClassIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends WeightClassIncludeArgs
  ? S['include']
  : true




/**
 * Model AgeClass
 */

export type AgeClass = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  sortId: number
}

export type AgeClassScalars = 'id' | 'createdAt' | 'updatedAt' | 'name' | 'sortId'
  

export type AgeClassSelect = {
  id?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  name?: boolean
  sortId?: boolean
  athletes?: boolean | FindManyAthleteSelectArgsOptional
}

export type AgeClassInclude = {
  athletes?: boolean | FindManyAthleteIncludeArgsOptional
}

type AgeClassDefault = {
  id: true
  createdAt: true
  updatedAt: true
  name: true
  sortId: true
}


export type AgeClassGetSelectPayload<S extends boolean | AgeClassSelect> = S extends true
  ? AgeClass
  : S extends AgeClassSelect
  ? {
      [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends AgeClassScalars
        ? AgeClass[P]
        : P extends 'athletes'
        ? Array<AthleteGetSelectPayload<ExtractFindManyAthleteSelectArgs<S[P]>>>
        : never
    }
   : never

export type AgeClassGetIncludePayload<S extends boolean | AgeClassInclude> = S extends true
  ? AgeClass
  : S extends AgeClassInclude
  ? {
      [P in CleanupNever<MergeTruthyValues<AgeClassDefault, S>>]: P extends AgeClassScalars
        ? AgeClass[P]
        : P extends 'athletes'
        ? Array<AthleteGetIncludePayload<ExtractFindManyAthleteIncludeArgs<S[P]>>>
        : never
    }
   : never

export interface AgeClassDelegate {
  /**
   * Find zero or one AgeClass.
   * @param {FindOneAgeClassArgs} args - Arguments to find a AgeClass
   * @example
   * // Get one AgeClass
   * const ageClass = await prisma.ageClass.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneAgeClassArgs>(
    args: Subset<T, FindOneAgeClassArgs>
  ): T extends FindOneAgeClassArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneAgeClassSelectArgs ? Promise<AgeClassGetSelectPayload<ExtractFindOneAgeClassSelectArgs<T>> | null>
  : T extends FindOneAgeClassIncludeArgs ? Promise<AgeClassGetIncludePayload<ExtractFindOneAgeClassIncludeArgs<T>> | null> : AgeClassClient<AgeClass | null>
  /**
   * Find zero or more AgeClasses.
   * @param {FindManyAgeClassArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all AgeClasses
   * const ageClasses = await prisma.ageClass.findMany()
   * 
   * // Get first 10 AgeClasses
   * const ageClasses = await prisma.ageClass.findMany({ first: 10 })
   * 
   * // Only select the `id`
   * const ageClassWithIdOnly = await prisma.ageClass.findMany({ select: { id: true } })
   * 
  **/
  findMany<T extends FindManyAgeClassArgs>(
    args?: Subset<T, FindManyAgeClassArgs>
  ): T extends FindManyAgeClassArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyAgeClassSelectArgs
  ? Promise<Array<AgeClassGetSelectPayload<ExtractFindManyAgeClassSelectArgs<T>>>> : T extends FindManyAgeClassIncludeArgs
  ? Promise<Array<AgeClassGetIncludePayload<ExtractFindManyAgeClassIncludeArgs<T>>>> : Promise<Array<AgeClass>>
  /**
   * Create a AgeClass.
   * @param {AgeClassCreateArgs} args - Arguments to create a AgeClass.
   * @example
   * // Create one AgeClass
   * const user = await prisma.ageClass.create({
   *   data: {
   *     // ... data to create a AgeClass
   *   }
   * })
   * 
  **/
  create<T extends AgeClassCreateArgs>(
    args: Subset<T, AgeClassCreateArgs>
  ): T extends AgeClassCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends AgeClassSelectCreateArgs ? Promise<AgeClassGetSelectPayload<ExtractAgeClassSelectCreateArgs<T>>>
  : T extends AgeClassIncludeCreateArgs ? Promise<AgeClassGetIncludePayload<ExtractAgeClassIncludeCreateArgs<T>>> : AgeClassClient<AgeClass>
  /**
   * Delete a AgeClass.
   * @param {AgeClassDeleteArgs} args - Arguments to delete one AgeClass.
   * @example
   * // Delete one AgeClass
   * const user = await prisma.ageClass.delete({
   *   where: {
   *     // ... filter to delete one AgeClass
   *   }
   * })
   * 
  **/
  delete<T extends AgeClassDeleteArgs>(
    args: Subset<T, AgeClassDeleteArgs>
  ): T extends AgeClassDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends AgeClassSelectDeleteArgs ? Promise<AgeClassGetSelectPayload<ExtractAgeClassSelectDeleteArgs<T>>>
  : T extends AgeClassIncludeDeleteArgs ? Promise<AgeClassGetIncludePayload<ExtractAgeClassIncludeDeleteArgs<T>>> : AgeClassClient<AgeClass>
  /**
   * Update one AgeClass.
   * @param {AgeClassUpdateArgs} args - Arguments to update one AgeClass.
   * @example
   * // Update one AgeClass
   * const ageClass = await prisma.ageClass.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends AgeClassUpdateArgs>(
    args: Subset<T, AgeClassUpdateArgs>
  ): T extends AgeClassUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends AgeClassSelectUpdateArgs ? Promise<AgeClassGetSelectPayload<ExtractAgeClassSelectUpdateArgs<T>>>
  : T extends AgeClassIncludeUpdateArgs ? Promise<AgeClassGetIncludePayload<ExtractAgeClassIncludeUpdateArgs<T>>> : AgeClassClient<AgeClass>
  /**
   * Delete zero or more AgeClasses.
   * @param {AgeClassDeleteManyArgs} args - Arguments to filter AgeClasses to delete.
   * @example
   * // Delete a few AgeClasses
   * const { count } = await prisma.ageClass.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends AgeClassDeleteManyArgs>(
    args: Subset<T, AgeClassDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more AgeClasses.
   * @param {AgeClassUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many AgeClasses
   * const ageClass = await prisma.ageClass.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  updateMany<T extends AgeClassUpdateManyArgs>(
    args: Subset<T, AgeClassUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one AgeClass.
   * @param {AgeClassUpsertArgs} args - Arguments to update or create a AgeClass.
   * @example
   * // Update or create a AgeClass
   * const ageClass = await prisma.ageClass.upsert({
   *   create: {
   *     // ... data to create a AgeClass
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the AgeClass we want to update
   *   }
   * })
  **/
  upsert<T extends AgeClassUpsertArgs>(
    args: Subset<T, AgeClassUpsertArgs>
  ): T extends AgeClassUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends AgeClassSelectUpsertArgs ? Promise<AgeClassGetSelectPayload<ExtractAgeClassSelectUpsertArgs<T>>>
  : T extends AgeClassIncludeUpsertArgs ? Promise<AgeClassGetIncludePayload<ExtractAgeClassIncludeUpsertArgs<T>>> : AgeClassClient<AgeClass>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class AgeClassClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  private _collectTimestamps?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  athletes<T extends FindManyAthleteArgs = {}>(args?: Subset<T, FindManyAthleteArgs>): T extends FindManyAthleteArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyAthleteSelectArgs
  ? Promise<Array<AthleteGetSelectPayload<ExtractFindManyAthleteSelectArgs<T>>>> : T extends FindManyAthleteIncludeArgs
  ? Promise<Array<AthleteGetIncludePayload<ExtractFindManyAthleteIncludeArgs<T>>>> : Promise<Array<Athlete>>;

  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * AgeClass findOne
 */
export type FindOneAgeClassArgs = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select?: AgeClassSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AgeClassInclude | null
  /**
   * Filter, which AgeClass to fetch.
  **/
  where: AgeClassWhereUniqueInput
}

export type FindOneAgeClassArgsRequired = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select: AgeClassSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AgeClassInclude
  /**
   * Filter, which AgeClass to fetch.
  **/
  where: AgeClassWhereUniqueInput
}

export type FindOneAgeClassSelectArgs = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select: AgeClassSelect
  /**
   * Filter, which AgeClass to fetch.
  **/
  where: AgeClassWhereUniqueInput
}

export type FindOneAgeClassSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select?: AgeClassSelect | null
  /**
   * Filter, which AgeClass to fetch.
  **/
  where: AgeClassWhereUniqueInput
}

export type FindOneAgeClassIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AgeClassInclude
  /**
   * Filter, which AgeClass to fetch.
  **/
  where: AgeClassWhereUniqueInput
}

export type FindOneAgeClassIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AgeClassInclude | null
  /**
   * Filter, which AgeClass to fetch.
  **/
  where: AgeClassWhereUniqueInput
}

export type ExtractFindOneAgeClassSelectArgs<S extends undefined | boolean | FindOneAgeClassSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneAgeClassSelectArgs
  ? S['select']
  : true

export type ExtractFindOneAgeClassIncludeArgs<S extends undefined | boolean | FindOneAgeClassIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneAgeClassIncludeArgs
  ? S['include']
  : true



/**
 * AgeClass findMany
 */
export type FindManyAgeClassArgs = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select?: AgeClassSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AgeClassInclude | null
  /**
   * Filter, which AgeClasses to fetch.
  **/
  where?: AgeClassWhereInput | null
  /**
   * Determine the order of the AgeClasses to fetch.
  **/
  orderBy?: AgeClassOrderByInput | null
  /**
   * Skip the first `n` AgeClasses.
  **/
  skip?: number | null
  /**
   * Get all AgeClasses that come after the AgeClass you provide with the current order.
  **/
  after?: AgeClassWhereUniqueInput | null
  /**
   * Get all AgeClasses that come before the AgeClass you provide with the current order.
  **/
  before?: AgeClassWhereUniqueInput | null
  /**
   * Get the first `n` AgeClasses.
  **/
  first?: number | null
  /**
   * Get the last `n` AgeClasses.
  **/
  last?: number | null
}

export type FindManyAgeClassArgsRequired = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select: AgeClassSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AgeClassInclude
  /**
   * Filter, which AgeClasses to fetch.
  **/
  where?: AgeClassWhereInput | null
  /**
   * Determine the order of the AgeClasses to fetch.
  **/
  orderBy?: AgeClassOrderByInput | null
  /**
   * Skip the first `n` AgeClasses.
  **/
  skip?: number | null
  /**
   * Get all AgeClasses that come after the AgeClass you provide with the current order.
  **/
  after?: AgeClassWhereUniqueInput | null
  /**
   * Get all AgeClasses that come before the AgeClass you provide with the current order.
  **/
  before?: AgeClassWhereUniqueInput | null
  /**
   * Get the first `n` AgeClasses.
  **/
  first?: number | null
  /**
   * Get the last `n` AgeClasses.
  **/
  last?: number | null
}

export type FindManyAgeClassSelectArgs = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select: AgeClassSelect
  /**
   * Filter, which AgeClasses to fetch.
  **/
  where?: AgeClassWhereInput | null
  /**
   * Determine the order of the AgeClasses to fetch.
  **/
  orderBy?: AgeClassOrderByInput | null
  /**
   * Skip the first `n` AgeClasses.
  **/
  skip?: number | null
  /**
   * Get all AgeClasses that come after the AgeClass you provide with the current order.
  **/
  after?: AgeClassWhereUniqueInput | null
  /**
   * Get all AgeClasses that come before the AgeClass you provide with the current order.
  **/
  before?: AgeClassWhereUniqueInput | null
  /**
   * Get the first `n` AgeClasses.
  **/
  first?: number | null
  /**
   * Get the last `n` AgeClasses.
  **/
  last?: number | null
}

export type FindManyAgeClassSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select?: AgeClassSelect | null
  /**
   * Filter, which AgeClasses to fetch.
  **/
  where?: AgeClassWhereInput | null
  /**
   * Determine the order of the AgeClasses to fetch.
  **/
  orderBy?: AgeClassOrderByInput | null
  /**
   * Skip the first `n` AgeClasses.
  **/
  skip?: number | null
  /**
   * Get all AgeClasses that come after the AgeClass you provide with the current order.
  **/
  after?: AgeClassWhereUniqueInput | null
  /**
   * Get all AgeClasses that come before the AgeClass you provide with the current order.
  **/
  before?: AgeClassWhereUniqueInput | null
  /**
   * Get the first `n` AgeClasses.
  **/
  first?: number | null
  /**
   * Get the last `n` AgeClasses.
  **/
  last?: number | null
}

export type FindManyAgeClassIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AgeClassInclude
  /**
   * Filter, which AgeClasses to fetch.
  **/
  where?: AgeClassWhereInput | null
  /**
   * Determine the order of the AgeClasses to fetch.
  **/
  orderBy?: AgeClassOrderByInput | null
  /**
   * Skip the first `n` AgeClasses.
  **/
  skip?: number | null
  /**
   * Get all AgeClasses that come after the AgeClass you provide with the current order.
  **/
  after?: AgeClassWhereUniqueInput | null
  /**
   * Get all AgeClasses that come before the AgeClass you provide with the current order.
  **/
  before?: AgeClassWhereUniqueInput | null
  /**
   * Get the first `n` AgeClasses.
  **/
  first?: number | null
  /**
   * Get the last `n` AgeClasses.
  **/
  last?: number | null
}

export type FindManyAgeClassIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AgeClassInclude | null
  /**
   * Filter, which AgeClasses to fetch.
  **/
  where?: AgeClassWhereInput | null
  /**
   * Determine the order of the AgeClasses to fetch.
  **/
  orderBy?: AgeClassOrderByInput | null
  /**
   * Skip the first `n` AgeClasses.
  **/
  skip?: number | null
  /**
   * Get all AgeClasses that come after the AgeClass you provide with the current order.
  **/
  after?: AgeClassWhereUniqueInput | null
  /**
   * Get all AgeClasses that come before the AgeClass you provide with the current order.
  **/
  before?: AgeClassWhereUniqueInput | null
  /**
   * Get the first `n` AgeClasses.
  **/
  first?: number | null
  /**
   * Get the last `n` AgeClasses.
  **/
  last?: number | null
}

export type ExtractFindManyAgeClassSelectArgs<S extends undefined | boolean | FindManyAgeClassSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyAgeClassSelectArgs
  ? S['select']
  : true

export type ExtractFindManyAgeClassIncludeArgs<S extends undefined | boolean | FindManyAgeClassIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyAgeClassIncludeArgs
  ? S['include']
  : true



/**
 * AgeClass create
 */
export type AgeClassCreateArgs = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select?: AgeClassSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AgeClassInclude | null
  /**
   * The data needed to create a AgeClass.
  **/
  data: AgeClassCreateInput
}

export type AgeClassCreateArgsRequired = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select: AgeClassSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AgeClassInclude
  /**
   * The data needed to create a AgeClass.
  **/
  data: AgeClassCreateInput
}

export type AgeClassSelectCreateArgs = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select: AgeClassSelect
  /**
   * The data needed to create a AgeClass.
  **/
  data: AgeClassCreateInput
}

export type AgeClassSelectCreateArgsOptional = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select?: AgeClassSelect | null
  /**
   * The data needed to create a AgeClass.
  **/
  data: AgeClassCreateInput
}

export type AgeClassIncludeCreateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AgeClassInclude
  /**
   * The data needed to create a AgeClass.
  **/
  data: AgeClassCreateInput
}

export type AgeClassIncludeCreateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AgeClassInclude | null
  /**
   * The data needed to create a AgeClass.
  **/
  data: AgeClassCreateInput
}

export type ExtractAgeClassSelectCreateArgs<S extends undefined | boolean | AgeClassSelectCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AgeClassSelectCreateArgs
  ? S['select']
  : true

export type ExtractAgeClassIncludeCreateArgs<S extends undefined | boolean | AgeClassIncludeCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AgeClassIncludeCreateArgs
  ? S['include']
  : true



/**
 * AgeClass update
 */
export type AgeClassUpdateArgs = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select?: AgeClassSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AgeClassInclude | null
  /**
   * The data needed to update a AgeClass.
  **/
  data: AgeClassUpdateInput
  /**
   * Choose, which AgeClass to update.
  **/
  where: AgeClassWhereUniqueInput
}

export type AgeClassUpdateArgsRequired = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select: AgeClassSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AgeClassInclude
  /**
   * The data needed to update a AgeClass.
  **/
  data: AgeClassUpdateInput
  /**
   * Choose, which AgeClass to update.
  **/
  where: AgeClassWhereUniqueInput
}

export type AgeClassSelectUpdateArgs = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select: AgeClassSelect
  /**
   * The data needed to update a AgeClass.
  **/
  data: AgeClassUpdateInput
  /**
   * Choose, which AgeClass to update.
  **/
  where: AgeClassWhereUniqueInput
}

export type AgeClassSelectUpdateArgsOptional = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select?: AgeClassSelect | null
  /**
   * The data needed to update a AgeClass.
  **/
  data: AgeClassUpdateInput
  /**
   * Choose, which AgeClass to update.
  **/
  where: AgeClassWhereUniqueInput
}

export type AgeClassIncludeUpdateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AgeClassInclude
  /**
   * The data needed to update a AgeClass.
  **/
  data: AgeClassUpdateInput
  /**
   * Choose, which AgeClass to update.
  **/
  where: AgeClassWhereUniqueInput
}

export type AgeClassIncludeUpdateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AgeClassInclude | null
  /**
   * The data needed to update a AgeClass.
  **/
  data: AgeClassUpdateInput
  /**
   * Choose, which AgeClass to update.
  **/
  where: AgeClassWhereUniqueInput
}

export type ExtractAgeClassSelectUpdateArgs<S extends undefined | boolean | AgeClassSelectUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AgeClassSelectUpdateArgs
  ? S['select']
  : true

export type ExtractAgeClassIncludeUpdateArgs<S extends undefined | boolean | AgeClassIncludeUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AgeClassIncludeUpdateArgs
  ? S['include']
  : true



/**
 * AgeClass updateMany
 */
export type AgeClassUpdateManyArgs = {
  data: AgeClassUpdateManyMutationInput
  where?: AgeClassWhereInput | null
}


/**
 * AgeClass upsert
 */
export type AgeClassUpsertArgs = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select?: AgeClassSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AgeClassInclude | null
  /**
   * The filter to search for the AgeClass to update in case it exists.
  **/
  where: AgeClassWhereUniqueInput
  /**
   * In case the AgeClass found by the `where` argument doesn't exist, create a new AgeClass with this data.
  **/
  create: AgeClassCreateInput
  /**
   * In case the AgeClass was found with the provided `where` argument, update it with this data.
  **/
  update: AgeClassUpdateInput
}

export type AgeClassUpsertArgsRequired = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select: AgeClassSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AgeClassInclude
  /**
   * The filter to search for the AgeClass to update in case it exists.
  **/
  where: AgeClassWhereUniqueInput
  /**
   * In case the AgeClass found by the `where` argument doesn't exist, create a new AgeClass with this data.
  **/
  create: AgeClassCreateInput
  /**
   * In case the AgeClass was found with the provided `where` argument, update it with this data.
  **/
  update: AgeClassUpdateInput
}

export type AgeClassSelectUpsertArgs = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select: AgeClassSelect
  /**
   * The filter to search for the AgeClass to update in case it exists.
  **/
  where: AgeClassWhereUniqueInput
  /**
   * In case the AgeClass found by the `where` argument doesn't exist, create a new AgeClass with this data.
  **/
  create: AgeClassCreateInput
  /**
   * In case the AgeClass was found with the provided `where` argument, update it with this data.
  **/
  update: AgeClassUpdateInput
}

export type AgeClassSelectUpsertArgsOptional = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select?: AgeClassSelect | null
  /**
   * The filter to search for the AgeClass to update in case it exists.
  **/
  where: AgeClassWhereUniqueInput
  /**
   * In case the AgeClass found by the `where` argument doesn't exist, create a new AgeClass with this data.
  **/
  create: AgeClassCreateInput
  /**
   * In case the AgeClass was found with the provided `where` argument, update it with this data.
  **/
  update: AgeClassUpdateInput
}

export type AgeClassIncludeUpsertArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AgeClassInclude
  /**
   * The filter to search for the AgeClass to update in case it exists.
  **/
  where: AgeClassWhereUniqueInput
  /**
   * In case the AgeClass found by the `where` argument doesn't exist, create a new AgeClass with this data.
  **/
  create: AgeClassCreateInput
  /**
   * In case the AgeClass was found with the provided `where` argument, update it with this data.
  **/
  update: AgeClassUpdateInput
}

export type AgeClassIncludeUpsertArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AgeClassInclude | null
  /**
   * The filter to search for the AgeClass to update in case it exists.
  **/
  where: AgeClassWhereUniqueInput
  /**
   * In case the AgeClass found by the `where` argument doesn't exist, create a new AgeClass with this data.
  **/
  create: AgeClassCreateInput
  /**
   * In case the AgeClass was found with the provided `where` argument, update it with this data.
  **/
  update: AgeClassUpdateInput
}

export type ExtractAgeClassSelectUpsertArgs<S extends undefined | boolean | AgeClassSelectUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AgeClassSelectUpsertArgs
  ? S['select']
  : true

export type ExtractAgeClassIncludeUpsertArgs<S extends undefined | boolean | AgeClassIncludeUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AgeClassIncludeUpsertArgs
  ? S['include']
  : true



/**
 * AgeClass delete
 */
export type AgeClassDeleteArgs = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select?: AgeClassSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AgeClassInclude | null
  /**
   * Filter which AgeClass to delete.
  **/
  where: AgeClassWhereUniqueInput
}

export type AgeClassDeleteArgsRequired = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select: AgeClassSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AgeClassInclude
  /**
   * Filter which AgeClass to delete.
  **/
  where: AgeClassWhereUniqueInput
}

export type AgeClassSelectDeleteArgs = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select: AgeClassSelect
  /**
   * Filter which AgeClass to delete.
  **/
  where: AgeClassWhereUniqueInput
}

export type AgeClassSelectDeleteArgsOptional = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select?: AgeClassSelect | null
  /**
   * Filter which AgeClass to delete.
  **/
  where: AgeClassWhereUniqueInput
}

export type AgeClassIncludeDeleteArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AgeClassInclude
  /**
   * Filter which AgeClass to delete.
  **/
  where: AgeClassWhereUniqueInput
}

export type AgeClassIncludeDeleteArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AgeClassInclude | null
  /**
   * Filter which AgeClass to delete.
  **/
  where: AgeClassWhereUniqueInput
}

export type ExtractAgeClassSelectDeleteArgs<S extends undefined | boolean | AgeClassSelectDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AgeClassSelectDeleteArgs
  ? S['select']
  : true

export type ExtractAgeClassIncludeDeleteArgs<S extends undefined | boolean | AgeClassIncludeDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AgeClassIncludeDeleteArgs
  ? S['include']
  : true



/**
 * AgeClass deleteMany
 */
export type AgeClassDeleteManyArgs = {
  where?: AgeClassWhereInput | null
}


/**
 * AgeClass without action
 */
export type AgeClassArgs = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select?: AgeClassSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AgeClassInclude | null
}

export type AgeClassArgsRequired = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select: AgeClassSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AgeClassInclude
}

export type AgeClassSelectArgs = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select: AgeClassSelect
}

export type AgeClassSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the AgeClass
  **/
  select?: AgeClassSelect | null
}

export type AgeClassIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: AgeClassInclude
}

export type AgeClassIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: AgeClassInclude | null
}

export type ExtractAgeClassSelectArgs<S extends undefined | boolean | AgeClassSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AgeClassSelectArgs
  ? S['select']
  : true

export type ExtractAgeClassIncludeArgs<S extends undefined | boolean | AgeClassIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends AgeClassIncludeArgs
  ? S['include']
  : true




/**
 * Model Official
 */

export type Official = {
  id: string
  createdAt: Date
  updatedAt: Date
  officalNumber: number
  lastName: string
  firstName: string
  club: string
  license: string
  position: string
  location: string
  importId: number
}

export type OfficialScalars = 'id' | 'createdAt' | 'updatedAt' | 'officalNumber' | 'lastName' | 'firstName' | 'club' | 'license' | 'position' | 'location' | 'importId'
  

export type OfficialSelect = {
  id?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  officalNumber?: boolean
  lastName?: boolean
  firstName?: boolean
  club?: boolean
  license?: boolean
  position?: boolean
  location?: boolean
  importId?: boolean
  event?: boolean | EventSelectArgsOptional
  officialSlots?: boolean | FindManyOfficialSlotSelectArgsOptional
}

export type OfficialInclude = {
  event?: boolean | EventIncludeArgsOptional
  officialSlots?: boolean | FindManyOfficialSlotIncludeArgsOptional
}

type OfficialDefault = {
  id: true
  createdAt: true
  updatedAt: true
  officalNumber: true
  lastName: true
  firstName: true
  club: true
  license: true
  position: true
  location: true
  importId: true
}


export type OfficialGetSelectPayload<S extends boolean | OfficialSelect> = S extends true
  ? Official
  : S extends OfficialSelect
  ? {
      [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends OfficialScalars
        ? Official[P]
        : P extends 'event'
        ? EventGetSelectPayload<ExtractEventSelectArgs<S[P]>>
        : P extends 'officialSlots'
        ? Array<OfficialSlotGetSelectPayload<ExtractFindManyOfficialSlotSelectArgs<S[P]>>>
        : never
    }
   : never

export type OfficialGetIncludePayload<S extends boolean | OfficialInclude> = S extends true
  ? Official
  : S extends OfficialInclude
  ? {
      [P in CleanupNever<MergeTruthyValues<OfficialDefault, S>>]: P extends OfficialScalars
        ? Official[P]
        : P extends 'event'
        ? EventGetIncludePayload<ExtractEventIncludeArgs<S[P]>>
        : P extends 'officialSlots'
        ? Array<OfficialSlotGetIncludePayload<ExtractFindManyOfficialSlotIncludeArgs<S[P]>>>
        : never
    }
   : never

export interface OfficialDelegate {
  /**
   * Find zero or one Official.
   * @param {FindOneOfficialArgs} args - Arguments to find a Official
   * @example
   * // Get one Official
   * const official = await prisma.official.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneOfficialArgs>(
    args: Subset<T, FindOneOfficialArgs>
  ): T extends FindOneOfficialArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneOfficialSelectArgs ? Promise<OfficialGetSelectPayload<ExtractFindOneOfficialSelectArgs<T>> | null>
  : T extends FindOneOfficialIncludeArgs ? Promise<OfficialGetIncludePayload<ExtractFindOneOfficialIncludeArgs<T>> | null> : OfficialClient<Official | null>
  /**
   * Find zero or more Officials.
   * @param {FindManyOfficialArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Officials
   * const officials = await prisma.official.findMany()
   * 
   * // Get first 10 Officials
   * const officials = await prisma.official.findMany({ first: 10 })
   * 
   * // Only select the `id`
   * const officialWithIdOnly = await prisma.official.findMany({ select: { id: true } })
   * 
  **/
  findMany<T extends FindManyOfficialArgs>(
    args?: Subset<T, FindManyOfficialArgs>
  ): T extends FindManyOfficialArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyOfficialSelectArgs
  ? Promise<Array<OfficialGetSelectPayload<ExtractFindManyOfficialSelectArgs<T>>>> : T extends FindManyOfficialIncludeArgs
  ? Promise<Array<OfficialGetIncludePayload<ExtractFindManyOfficialIncludeArgs<T>>>> : Promise<Array<Official>>
  /**
   * Create a Official.
   * @param {OfficialCreateArgs} args - Arguments to create a Official.
   * @example
   * // Create one Official
   * const user = await prisma.official.create({
   *   data: {
   *     // ... data to create a Official
   *   }
   * })
   * 
  **/
  create<T extends OfficialCreateArgs>(
    args: Subset<T, OfficialCreateArgs>
  ): T extends OfficialCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends OfficialSelectCreateArgs ? Promise<OfficialGetSelectPayload<ExtractOfficialSelectCreateArgs<T>>>
  : T extends OfficialIncludeCreateArgs ? Promise<OfficialGetIncludePayload<ExtractOfficialIncludeCreateArgs<T>>> : OfficialClient<Official>
  /**
   * Delete a Official.
   * @param {OfficialDeleteArgs} args - Arguments to delete one Official.
   * @example
   * // Delete one Official
   * const user = await prisma.official.delete({
   *   where: {
   *     // ... filter to delete one Official
   *   }
   * })
   * 
  **/
  delete<T extends OfficialDeleteArgs>(
    args: Subset<T, OfficialDeleteArgs>
  ): T extends OfficialDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends OfficialSelectDeleteArgs ? Promise<OfficialGetSelectPayload<ExtractOfficialSelectDeleteArgs<T>>>
  : T extends OfficialIncludeDeleteArgs ? Promise<OfficialGetIncludePayload<ExtractOfficialIncludeDeleteArgs<T>>> : OfficialClient<Official>
  /**
   * Update one Official.
   * @param {OfficialUpdateArgs} args - Arguments to update one Official.
   * @example
   * // Update one Official
   * const official = await prisma.official.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends OfficialUpdateArgs>(
    args: Subset<T, OfficialUpdateArgs>
  ): T extends OfficialUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends OfficialSelectUpdateArgs ? Promise<OfficialGetSelectPayload<ExtractOfficialSelectUpdateArgs<T>>>
  : T extends OfficialIncludeUpdateArgs ? Promise<OfficialGetIncludePayload<ExtractOfficialIncludeUpdateArgs<T>>> : OfficialClient<Official>
  /**
   * Delete zero or more Officials.
   * @param {OfficialDeleteManyArgs} args - Arguments to filter Officials to delete.
   * @example
   * // Delete a few Officials
   * const { count } = await prisma.official.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends OfficialDeleteManyArgs>(
    args: Subset<T, OfficialDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Officials.
   * @param {OfficialUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Officials
   * const official = await prisma.official.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  updateMany<T extends OfficialUpdateManyArgs>(
    args: Subset<T, OfficialUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one Official.
   * @param {OfficialUpsertArgs} args - Arguments to update or create a Official.
   * @example
   * // Update or create a Official
   * const official = await prisma.official.upsert({
   *   create: {
   *     // ... data to create a Official
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Official we want to update
   *   }
   * })
  **/
  upsert<T extends OfficialUpsertArgs>(
    args: Subset<T, OfficialUpsertArgs>
  ): T extends OfficialUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends OfficialSelectUpsertArgs ? Promise<OfficialGetSelectPayload<ExtractOfficialSelectUpsertArgs<T>>>
  : T extends OfficialIncludeUpsertArgs ? Promise<OfficialGetIncludePayload<ExtractOfficialIncludeUpsertArgs<T>>> : OfficialClient<Official>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class OfficialClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  private _collectTimestamps?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  event<T extends EventArgs = {}>(args?: Subset<T, EventArgs>): T extends FindOneEventArgsRequired ? 'Please either choose `select` or `include`' : T extends EventSelectArgs ? Promise<EventGetSelectPayload<ExtractEventSelectArgs<T>> | null>
  : T extends EventIncludeArgs ? Promise<EventGetIncludePayload<ExtractEventIncludeArgs<T>> | null> : EventClient<Event | null>;

  officialSlots<T extends FindManyOfficialSlotArgs = {}>(args?: Subset<T, FindManyOfficialSlotArgs>): T extends FindManyOfficialSlotArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyOfficialSlotSelectArgs
  ? Promise<Array<OfficialSlotGetSelectPayload<ExtractFindManyOfficialSlotSelectArgs<T>>>> : T extends FindManyOfficialSlotIncludeArgs
  ? Promise<Array<OfficialSlotGetIncludePayload<ExtractFindManyOfficialSlotIncludeArgs<T>>>> : Promise<Array<OfficialSlot>>;

  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * Official findOne
 */
export type FindOneOfficialArgs = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select?: OfficialSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialInclude | null
  /**
   * Filter, which Official to fetch.
  **/
  where: OfficialWhereUniqueInput
}

export type FindOneOfficialArgsRequired = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select: OfficialSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialInclude
  /**
   * Filter, which Official to fetch.
  **/
  where: OfficialWhereUniqueInput
}

export type FindOneOfficialSelectArgs = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select: OfficialSelect
  /**
   * Filter, which Official to fetch.
  **/
  where: OfficialWhereUniqueInput
}

export type FindOneOfficialSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select?: OfficialSelect | null
  /**
   * Filter, which Official to fetch.
  **/
  where: OfficialWhereUniqueInput
}

export type FindOneOfficialIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialInclude
  /**
   * Filter, which Official to fetch.
  **/
  where: OfficialWhereUniqueInput
}

export type FindOneOfficialIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialInclude | null
  /**
   * Filter, which Official to fetch.
  **/
  where: OfficialWhereUniqueInput
}

export type ExtractFindOneOfficialSelectArgs<S extends undefined | boolean | FindOneOfficialSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneOfficialSelectArgs
  ? S['select']
  : true

export type ExtractFindOneOfficialIncludeArgs<S extends undefined | boolean | FindOneOfficialIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneOfficialIncludeArgs
  ? S['include']
  : true



/**
 * Official findMany
 */
export type FindManyOfficialArgs = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select?: OfficialSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialInclude | null
  /**
   * Filter, which Officials to fetch.
  **/
  where?: OfficialWhereInput | null
  /**
   * Determine the order of the Officials to fetch.
  **/
  orderBy?: OfficialOrderByInput | null
  /**
   * Skip the first `n` Officials.
  **/
  skip?: number | null
  /**
   * Get all Officials that come after the Official you provide with the current order.
  **/
  after?: OfficialWhereUniqueInput | null
  /**
   * Get all Officials that come before the Official you provide with the current order.
  **/
  before?: OfficialWhereUniqueInput | null
  /**
   * Get the first `n` Officials.
  **/
  first?: number | null
  /**
   * Get the last `n` Officials.
  **/
  last?: number | null
}

export type FindManyOfficialArgsRequired = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select: OfficialSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialInclude
  /**
   * Filter, which Officials to fetch.
  **/
  where?: OfficialWhereInput | null
  /**
   * Determine the order of the Officials to fetch.
  **/
  orderBy?: OfficialOrderByInput | null
  /**
   * Skip the first `n` Officials.
  **/
  skip?: number | null
  /**
   * Get all Officials that come after the Official you provide with the current order.
  **/
  after?: OfficialWhereUniqueInput | null
  /**
   * Get all Officials that come before the Official you provide with the current order.
  **/
  before?: OfficialWhereUniqueInput | null
  /**
   * Get the first `n` Officials.
  **/
  first?: number | null
  /**
   * Get the last `n` Officials.
  **/
  last?: number | null
}

export type FindManyOfficialSelectArgs = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select: OfficialSelect
  /**
   * Filter, which Officials to fetch.
  **/
  where?: OfficialWhereInput | null
  /**
   * Determine the order of the Officials to fetch.
  **/
  orderBy?: OfficialOrderByInput | null
  /**
   * Skip the first `n` Officials.
  **/
  skip?: number | null
  /**
   * Get all Officials that come after the Official you provide with the current order.
  **/
  after?: OfficialWhereUniqueInput | null
  /**
   * Get all Officials that come before the Official you provide with the current order.
  **/
  before?: OfficialWhereUniqueInput | null
  /**
   * Get the first `n` Officials.
  **/
  first?: number | null
  /**
   * Get the last `n` Officials.
  **/
  last?: number | null
}

export type FindManyOfficialSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select?: OfficialSelect | null
  /**
   * Filter, which Officials to fetch.
  **/
  where?: OfficialWhereInput | null
  /**
   * Determine the order of the Officials to fetch.
  **/
  orderBy?: OfficialOrderByInput | null
  /**
   * Skip the first `n` Officials.
  **/
  skip?: number | null
  /**
   * Get all Officials that come after the Official you provide with the current order.
  **/
  after?: OfficialWhereUniqueInput | null
  /**
   * Get all Officials that come before the Official you provide with the current order.
  **/
  before?: OfficialWhereUniqueInput | null
  /**
   * Get the first `n` Officials.
  **/
  first?: number | null
  /**
   * Get the last `n` Officials.
  **/
  last?: number | null
}

export type FindManyOfficialIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialInclude
  /**
   * Filter, which Officials to fetch.
  **/
  where?: OfficialWhereInput | null
  /**
   * Determine the order of the Officials to fetch.
  **/
  orderBy?: OfficialOrderByInput | null
  /**
   * Skip the first `n` Officials.
  **/
  skip?: number | null
  /**
   * Get all Officials that come after the Official you provide with the current order.
  **/
  after?: OfficialWhereUniqueInput | null
  /**
   * Get all Officials that come before the Official you provide with the current order.
  **/
  before?: OfficialWhereUniqueInput | null
  /**
   * Get the first `n` Officials.
  **/
  first?: number | null
  /**
   * Get the last `n` Officials.
  **/
  last?: number | null
}

export type FindManyOfficialIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialInclude | null
  /**
   * Filter, which Officials to fetch.
  **/
  where?: OfficialWhereInput | null
  /**
   * Determine the order of the Officials to fetch.
  **/
  orderBy?: OfficialOrderByInput | null
  /**
   * Skip the first `n` Officials.
  **/
  skip?: number | null
  /**
   * Get all Officials that come after the Official you provide with the current order.
  **/
  after?: OfficialWhereUniqueInput | null
  /**
   * Get all Officials that come before the Official you provide with the current order.
  **/
  before?: OfficialWhereUniqueInput | null
  /**
   * Get the first `n` Officials.
  **/
  first?: number | null
  /**
   * Get the last `n` Officials.
  **/
  last?: number | null
}

export type ExtractFindManyOfficialSelectArgs<S extends undefined | boolean | FindManyOfficialSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyOfficialSelectArgs
  ? S['select']
  : true

export type ExtractFindManyOfficialIncludeArgs<S extends undefined | boolean | FindManyOfficialIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyOfficialIncludeArgs
  ? S['include']
  : true



/**
 * Official create
 */
export type OfficialCreateArgs = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select?: OfficialSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialInclude | null
  /**
   * The data needed to create a Official.
  **/
  data: OfficialCreateInput
}

export type OfficialCreateArgsRequired = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select: OfficialSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialInclude
  /**
   * The data needed to create a Official.
  **/
  data: OfficialCreateInput
}

export type OfficialSelectCreateArgs = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select: OfficialSelect
  /**
   * The data needed to create a Official.
  **/
  data: OfficialCreateInput
}

export type OfficialSelectCreateArgsOptional = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select?: OfficialSelect | null
  /**
   * The data needed to create a Official.
  **/
  data: OfficialCreateInput
}

export type OfficialIncludeCreateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialInclude
  /**
   * The data needed to create a Official.
  **/
  data: OfficialCreateInput
}

export type OfficialIncludeCreateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialInclude | null
  /**
   * The data needed to create a Official.
  **/
  data: OfficialCreateInput
}

export type ExtractOfficialSelectCreateArgs<S extends undefined | boolean | OfficialSelectCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialSelectCreateArgs
  ? S['select']
  : true

export type ExtractOfficialIncludeCreateArgs<S extends undefined | boolean | OfficialIncludeCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialIncludeCreateArgs
  ? S['include']
  : true



/**
 * Official update
 */
export type OfficialUpdateArgs = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select?: OfficialSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialInclude | null
  /**
   * The data needed to update a Official.
  **/
  data: OfficialUpdateInput
  /**
   * Choose, which Official to update.
  **/
  where: OfficialWhereUniqueInput
}

export type OfficialUpdateArgsRequired = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select: OfficialSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialInclude
  /**
   * The data needed to update a Official.
  **/
  data: OfficialUpdateInput
  /**
   * Choose, which Official to update.
  **/
  where: OfficialWhereUniqueInput
}

export type OfficialSelectUpdateArgs = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select: OfficialSelect
  /**
   * The data needed to update a Official.
  **/
  data: OfficialUpdateInput
  /**
   * Choose, which Official to update.
  **/
  where: OfficialWhereUniqueInput
}

export type OfficialSelectUpdateArgsOptional = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select?: OfficialSelect | null
  /**
   * The data needed to update a Official.
  **/
  data: OfficialUpdateInput
  /**
   * Choose, which Official to update.
  **/
  where: OfficialWhereUniqueInput
}

export type OfficialIncludeUpdateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialInclude
  /**
   * The data needed to update a Official.
  **/
  data: OfficialUpdateInput
  /**
   * Choose, which Official to update.
  **/
  where: OfficialWhereUniqueInput
}

export type OfficialIncludeUpdateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialInclude | null
  /**
   * The data needed to update a Official.
  **/
  data: OfficialUpdateInput
  /**
   * Choose, which Official to update.
  **/
  where: OfficialWhereUniqueInput
}

export type ExtractOfficialSelectUpdateArgs<S extends undefined | boolean | OfficialSelectUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialSelectUpdateArgs
  ? S['select']
  : true

export type ExtractOfficialIncludeUpdateArgs<S extends undefined | boolean | OfficialIncludeUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialIncludeUpdateArgs
  ? S['include']
  : true



/**
 * Official updateMany
 */
export type OfficialUpdateManyArgs = {
  data: OfficialUpdateManyMutationInput
  where?: OfficialWhereInput | null
}


/**
 * Official upsert
 */
export type OfficialUpsertArgs = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select?: OfficialSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialInclude | null
  /**
   * The filter to search for the Official to update in case it exists.
  **/
  where: OfficialWhereUniqueInput
  /**
   * In case the Official found by the `where` argument doesn't exist, create a new Official with this data.
  **/
  create: OfficialCreateInput
  /**
   * In case the Official was found with the provided `where` argument, update it with this data.
  **/
  update: OfficialUpdateInput
}

export type OfficialUpsertArgsRequired = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select: OfficialSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialInclude
  /**
   * The filter to search for the Official to update in case it exists.
  **/
  where: OfficialWhereUniqueInput
  /**
   * In case the Official found by the `where` argument doesn't exist, create a new Official with this data.
  **/
  create: OfficialCreateInput
  /**
   * In case the Official was found with the provided `where` argument, update it with this data.
  **/
  update: OfficialUpdateInput
}

export type OfficialSelectUpsertArgs = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select: OfficialSelect
  /**
   * The filter to search for the Official to update in case it exists.
  **/
  where: OfficialWhereUniqueInput
  /**
   * In case the Official found by the `where` argument doesn't exist, create a new Official with this data.
  **/
  create: OfficialCreateInput
  /**
   * In case the Official was found with the provided `where` argument, update it with this data.
  **/
  update: OfficialUpdateInput
}

export type OfficialSelectUpsertArgsOptional = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select?: OfficialSelect | null
  /**
   * The filter to search for the Official to update in case it exists.
  **/
  where: OfficialWhereUniqueInput
  /**
   * In case the Official found by the `where` argument doesn't exist, create a new Official with this data.
  **/
  create: OfficialCreateInput
  /**
   * In case the Official was found with the provided `where` argument, update it with this data.
  **/
  update: OfficialUpdateInput
}

export type OfficialIncludeUpsertArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialInclude
  /**
   * The filter to search for the Official to update in case it exists.
  **/
  where: OfficialWhereUniqueInput
  /**
   * In case the Official found by the `where` argument doesn't exist, create a new Official with this data.
  **/
  create: OfficialCreateInput
  /**
   * In case the Official was found with the provided `where` argument, update it with this data.
  **/
  update: OfficialUpdateInput
}

export type OfficialIncludeUpsertArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialInclude | null
  /**
   * The filter to search for the Official to update in case it exists.
  **/
  where: OfficialWhereUniqueInput
  /**
   * In case the Official found by the `where` argument doesn't exist, create a new Official with this data.
  **/
  create: OfficialCreateInput
  /**
   * In case the Official was found with the provided `where` argument, update it with this data.
  **/
  update: OfficialUpdateInput
}

export type ExtractOfficialSelectUpsertArgs<S extends undefined | boolean | OfficialSelectUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialSelectUpsertArgs
  ? S['select']
  : true

export type ExtractOfficialIncludeUpsertArgs<S extends undefined | boolean | OfficialIncludeUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialIncludeUpsertArgs
  ? S['include']
  : true



/**
 * Official delete
 */
export type OfficialDeleteArgs = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select?: OfficialSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialInclude | null
  /**
   * Filter which Official to delete.
  **/
  where: OfficialWhereUniqueInput
}

export type OfficialDeleteArgsRequired = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select: OfficialSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialInclude
  /**
   * Filter which Official to delete.
  **/
  where: OfficialWhereUniqueInput
}

export type OfficialSelectDeleteArgs = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select: OfficialSelect
  /**
   * Filter which Official to delete.
  **/
  where: OfficialWhereUniqueInput
}

export type OfficialSelectDeleteArgsOptional = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select?: OfficialSelect | null
  /**
   * Filter which Official to delete.
  **/
  where: OfficialWhereUniqueInput
}

export type OfficialIncludeDeleteArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialInclude
  /**
   * Filter which Official to delete.
  **/
  where: OfficialWhereUniqueInput
}

export type OfficialIncludeDeleteArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialInclude | null
  /**
   * Filter which Official to delete.
  **/
  where: OfficialWhereUniqueInput
}

export type ExtractOfficialSelectDeleteArgs<S extends undefined | boolean | OfficialSelectDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialSelectDeleteArgs
  ? S['select']
  : true

export type ExtractOfficialIncludeDeleteArgs<S extends undefined | boolean | OfficialIncludeDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialIncludeDeleteArgs
  ? S['include']
  : true



/**
 * Official deleteMany
 */
export type OfficialDeleteManyArgs = {
  where?: OfficialWhereInput | null
}


/**
 * Official without action
 */
export type OfficialArgs = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select?: OfficialSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialInclude | null
}

export type OfficialArgsRequired = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select: OfficialSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialInclude
}

export type OfficialSelectArgs = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select: OfficialSelect
}

export type OfficialSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Official
  **/
  select?: OfficialSelect | null
}

export type OfficialIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialInclude
}

export type OfficialIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialInclude | null
}

export type ExtractOfficialSelectArgs<S extends undefined | boolean | OfficialSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialSelectArgs
  ? S['select']
  : true

export type ExtractOfficialIncludeArgs<S extends undefined | boolean | OfficialIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialIncludeArgs
  ? S['include']
  : true




/**
 * Model OfficialSlot
 */

export type OfficialSlot = {
  id: string
  createdAt: Date
  updatedAt: Date
  position: Position
}

export type OfficialSlotScalars = 'id' | 'createdAt' | 'updatedAt' | 'position'
  

export type OfficialSlotSelect = {
  id?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  position?: boolean
  official?: boolean | OfficialSelectArgsOptional
  slot?: boolean | SlotSelectArgsOptional
}

export type OfficialSlotInclude = {
  official?: boolean | OfficialIncludeArgsOptional
  slot?: boolean | SlotIncludeArgsOptional
}

type OfficialSlotDefault = {
  id: true
  createdAt: true
  updatedAt: true
  position: true
}


export type OfficialSlotGetSelectPayload<S extends boolean | OfficialSlotSelect> = S extends true
  ? OfficialSlot
  : S extends OfficialSlotSelect
  ? {
      [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends OfficialSlotScalars
        ? OfficialSlot[P]
        : P extends 'official'
        ? OfficialGetSelectPayload<ExtractOfficialSelectArgs<S[P]>>
        : P extends 'slot'
        ? SlotGetSelectPayload<ExtractSlotSelectArgs<S[P]>>
        : never
    }
   : never

export type OfficialSlotGetIncludePayload<S extends boolean | OfficialSlotInclude> = S extends true
  ? OfficialSlot
  : S extends OfficialSlotInclude
  ? {
      [P in CleanupNever<MergeTruthyValues<OfficialSlotDefault, S>>]: P extends OfficialSlotScalars
        ? OfficialSlot[P]
        : P extends 'official'
        ? OfficialGetIncludePayload<ExtractOfficialIncludeArgs<S[P]>>
        : P extends 'slot'
        ? SlotGetIncludePayload<ExtractSlotIncludeArgs<S[P]>>
        : never
    }
   : never

export interface OfficialSlotDelegate {
  /**
   * Find zero or one OfficialSlot.
   * @param {FindOneOfficialSlotArgs} args - Arguments to find a OfficialSlot
   * @example
   * // Get one OfficialSlot
   * const officialSlot = await prisma.officialSlot.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneOfficialSlotArgs>(
    args: Subset<T, FindOneOfficialSlotArgs>
  ): T extends FindOneOfficialSlotArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneOfficialSlotSelectArgs ? Promise<OfficialSlotGetSelectPayload<ExtractFindOneOfficialSlotSelectArgs<T>> | null>
  : T extends FindOneOfficialSlotIncludeArgs ? Promise<OfficialSlotGetIncludePayload<ExtractFindOneOfficialSlotIncludeArgs<T>> | null> : OfficialSlotClient<OfficialSlot | null>
  /**
   * Find zero or more OfficialSlots.
   * @param {FindManyOfficialSlotArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all OfficialSlots
   * const officialSlots = await prisma.officialSlot.findMany()
   * 
   * // Get first 10 OfficialSlots
   * const officialSlots = await prisma.officialSlot.findMany({ first: 10 })
   * 
   * // Only select the `id`
   * const officialSlotWithIdOnly = await prisma.officialSlot.findMany({ select: { id: true } })
   * 
  **/
  findMany<T extends FindManyOfficialSlotArgs>(
    args?: Subset<T, FindManyOfficialSlotArgs>
  ): T extends FindManyOfficialSlotArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyOfficialSlotSelectArgs
  ? Promise<Array<OfficialSlotGetSelectPayload<ExtractFindManyOfficialSlotSelectArgs<T>>>> : T extends FindManyOfficialSlotIncludeArgs
  ? Promise<Array<OfficialSlotGetIncludePayload<ExtractFindManyOfficialSlotIncludeArgs<T>>>> : Promise<Array<OfficialSlot>>
  /**
   * Create a OfficialSlot.
   * @param {OfficialSlotCreateArgs} args - Arguments to create a OfficialSlot.
   * @example
   * // Create one OfficialSlot
   * const user = await prisma.officialSlot.create({
   *   data: {
   *     // ... data to create a OfficialSlot
   *   }
   * })
   * 
  **/
  create<T extends OfficialSlotCreateArgs>(
    args: Subset<T, OfficialSlotCreateArgs>
  ): T extends OfficialSlotCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends OfficialSlotSelectCreateArgs ? Promise<OfficialSlotGetSelectPayload<ExtractOfficialSlotSelectCreateArgs<T>>>
  : T extends OfficialSlotIncludeCreateArgs ? Promise<OfficialSlotGetIncludePayload<ExtractOfficialSlotIncludeCreateArgs<T>>> : OfficialSlotClient<OfficialSlot>
  /**
   * Delete a OfficialSlot.
   * @param {OfficialSlotDeleteArgs} args - Arguments to delete one OfficialSlot.
   * @example
   * // Delete one OfficialSlot
   * const user = await prisma.officialSlot.delete({
   *   where: {
   *     // ... filter to delete one OfficialSlot
   *   }
   * })
   * 
  **/
  delete<T extends OfficialSlotDeleteArgs>(
    args: Subset<T, OfficialSlotDeleteArgs>
  ): T extends OfficialSlotDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends OfficialSlotSelectDeleteArgs ? Promise<OfficialSlotGetSelectPayload<ExtractOfficialSlotSelectDeleteArgs<T>>>
  : T extends OfficialSlotIncludeDeleteArgs ? Promise<OfficialSlotGetIncludePayload<ExtractOfficialSlotIncludeDeleteArgs<T>>> : OfficialSlotClient<OfficialSlot>
  /**
   * Update one OfficialSlot.
   * @param {OfficialSlotUpdateArgs} args - Arguments to update one OfficialSlot.
   * @example
   * // Update one OfficialSlot
   * const officialSlot = await prisma.officialSlot.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends OfficialSlotUpdateArgs>(
    args: Subset<T, OfficialSlotUpdateArgs>
  ): T extends OfficialSlotUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends OfficialSlotSelectUpdateArgs ? Promise<OfficialSlotGetSelectPayload<ExtractOfficialSlotSelectUpdateArgs<T>>>
  : T extends OfficialSlotIncludeUpdateArgs ? Promise<OfficialSlotGetIncludePayload<ExtractOfficialSlotIncludeUpdateArgs<T>>> : OfficialSlotClient<OfficialSlot>
  /**
   * Delete zero or more OfficialSlots.
   * @param {OfficialSlotDeleteManyArgs} args - Arguments to filter OfficialSlots to delete.
   * @example
   * // Delete a few OfficialSlots
   * const { count } = await prisma.officialSlot.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends OfficialSlotDeleteManyArgs>(
    args: Subset<T, OfficialSlotDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more OfficialSlots.
   * @param {OfficialSlotUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many OfficialSlots
   * const officialSlot = await prisma.officialSlot.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  updateMany<T extends OfficialSlotUpdateManyArgs>(
    args: Subset<T, OfficialSlotUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one OfficialSlot.
   * @param {OfficialSlotUpsertArgs} args - Arguments to update or create a OfficialSlot.
   * @example
   * // Update or create a OfficialSlot
   * const officialSlot = await prisma.officialSlot.upsert({
   *   create: {
   *     // ... data to create a OfficialSlot
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the OfficialSlot we want to update
   *   }
   * })
  **/
  upsert<T extends OfficialSlotUpsertArgs>(
    args: Subset<T, OfficialSlotUpsertArgs>
  ): T extends OfficialSlotUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends OfficialSlotSelectUpsertArgs ? Promise<OfficialSlotGetSelectPayload<ExtractOfficialSlotSelectUpsertArgs<T>>>
  : T extends OfficialSlotIncludeUpsertArgs ? Promise<OfficialSlotGetIncludePayload<ExtractOfficialSlotIncludeUpsertArgs<T>>> : OfficialSlotClient<OfficialSlot>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class OfficialSlotClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  private _collectTimestamps?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  official<T extends OfficialArgs = {}>(args?: Subset<T, OfficialArgs>): T extends FindOneOfficialArgsRequired ? 'Please either choose `select` or `include`' : T extends OfficialSelectArgs ? Promise<OfficialGetSelectPayload<ExtractOfficialSelectArgs<T>> | null>
  : T extends OfficialIncludeArgs ? Promise<OfficialGetIncludePayload<ExtractOfficialIncludeArgs<T>> | null> : OfficialClient<Official | null>;

  slot<T extends SlotArgs = {}>(args?: Subset<T, SlotArgs>): T extends FindOneSlotArgsRequired ? 'Please either choose `select` or `include`' : T extends SlotSelectArgs ? Promise<SlotGetSelectPayload<ExtractSlotSelectArgs<T>> | null>
  : T extends SlotIncludeArgs ? Promise<SlotGetIncludePayload<ExtractSlotIncludeArgs<T>> | null> : SlotClient<Slot | null>;

  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * OfficialSlot findOne
 */
export type FindOneOfficialSlotArgs = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select?: OfficialSlotSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialSlotInclude | null
  /**
   * Filter, which OfficialSlot to fetch.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type FindOneOfficialSlotArgsRequired = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select: OfficialSlotSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialSlotInclude
  /**
   * Filter, which OfficialSlot to fetch.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type FindOneOfficialSlotSelectArgs = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select: OfficialSlotSelect
  /**
   * Filter, which OfficialSlot to fetch.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type FindOneOfficialSlotSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select?: OfficialSlotSelect | null
  /**
   * Filter, which OfficialSlot to fetch.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type FindOneOfficialSlotIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialSlotInclude
  /**
   * Filter, which OfficialSlot to fetch.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type FindOneOfficialSlotIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialSlotInclude | null
  /**
   * Filter, which OfficialSlot to fetch.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type ExtractFindOneOfficialSlotSelectArgs<S extends undefined | boolean | FindOneOfficialSlotSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneOfficialSlotSelectArgs
  ? S['select']
  : true

export type ExtractFindOneOfficialSlotIncludeArgs<S extends undefined | boolean | FindOneOfficialSlotIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneOfficialSlotIncludeArgs
  ? S['include']
  : true



/**
 * OfficialSlot findMany
 */
export type FindManyOfficialSlotArgs = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select?: OfficialSlotSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialSlotInclude | null
  /**
   * Filter, which OfficialSlots to fetch.
  **/
  where?: OfficialSlotWhereInput | null
  /**
   * Determine the order of the OfficialSlots to fetch.
  **/
  orderBy?: OfficialSlotOrderByInput | null
  /**
   * Skip the first `n` OfficialSlots.
  **/
  skip?: number | null
  /**
   * Get all OfficialSlots that come after the OfficialSlot you provide with the current order.
  **/
  after?: OfficialSlotWhereUniqueInput | null
  /**
   * Get all OfficialSlots that come before the OfficialSlot you provide with the current order.
  **/
  before?: OfficialSlotWhereUniqueInput | null
  /**
   * Get the first `n` OfficialSlots.
  **/
  first?: number | null
  /**
   * Get the last `n` OfficialSlots.
  **/
  last?: number | null
}

export type FindManyOfficialSlotArgsRequired = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select: OfficialSlotSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialSlotInclude
  /**
   * Filter, which OfficialSlots to fetch.
  **/
  where?: OfficialSlotWhereInput | null
  /**
   * Determine the order of the OfficialSlots to fetch.
  **/
  orderBy?: OfficialSlotOrderByInput | null
  /**
   * Skip the first `n` OfficialSlots.
  **/
  skip?: number | null
  /**
   * Get all OfficialSlots that come after the OfficialSlot you provide with the current order.
  **/
  after?: OfficialSlotWhereUniqueInput | null
  /**
   * Get all OfficialSlots that come before the OfficialSlot you provide with the current order.
  **/
  before?: OfficialSlotWhereUniqueInput | null
  /**
   * Get the first `n` OfficialSlots.
  **/
  first?: number | null
  /**
   * Get the last `n` OfficialSlots.
  **/
  last?: number | null
}

export type FindManyOfficialSlotSelectArgs = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select: OfficialSlotSelect
  /**
   * Filter, which OfficialSlots to fetch.
  **/
  where?: OfficialSlotWhereInput | null
  /**
   * Determine the order of the OfficialSlots to fetch.
  **/
  orderBy?: OfficialSlotOrderByInput | null
  /**
   * Skip the first `n` OfficialSlots.
  **/
  skip?: number | null
  /**
   * Get all OfficialSlots that come after the OfficialSlot you provide with the current order.
  **/
  after?: OfficialSlotWhereUniqueInput | null
  /**
   * Get all OfficialSlots that come before the OfficialSlot you provide with the current order.
  **/
  before?: OfficialSlotWhereUniqueInput | null
  /**
   * Get the first `n` OfficialSlots.
  **/
  first?: number | null
  /**
   * Get the last `n` OfficialSlots.
  **/
  last?: number | null
}

export type FindManyOfficialSlotSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select?: OfficialSlotSelect | null
  /**
   * Filter, which OfficialSlots to fetch.
  **/
  where?: OfficialSlotWhereInput | null
  /**
   * Determine the order of the OfficialSlots to fetch.
  **/
  orderBy?: OfficialSlotOrderByInput | null
  /**
   * Skip the first `n` OfficialSlots.
  **/
  skip?: number | null
  /**
   * Get all OfficialSlots that come after the OfficialSlot you provide with the current order.
  **/
  after?: OfficialSlotWhereUniqueInput | null
  /**
   * Get all OfficialSlots that come before the OfficialSlot you provide with the current order.
  **/
  before?: OfficialSlotWhereUniqueInput | null
  /**
   * Get the first `n` OfficialSlots.
  **/
  first?: number | null
  /**
   * Get the last `n` OfficialSlots.
  **/
  last?: number | null
}

export type FindManyOfficialSlotIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialSlotInclude
  /**
   * Filter, which OfficialSlots to fetch.
  **/
  where?: OfficialSlotWhereInput | null
  /**
   * Determine the order of the OfficialSlots to fetch.
  **/
  orderBy?: OfficialSlotOrderByInput | null
  /**
   * Skip the first `n` OfficialSlots.
  **/
  skip?: number | null
  /**
   * Get all OfficialSlots that come after the OfficialSlot you provide with the current order.
  **/
  after?: OfficialSlotWhereUniqueInput | null
  /**
   * Get all OfficialSlots that come before the OfficialSlot you provide with the current order.
  **/
  before?: OfficialSlotWhereUniqueInput | null
  /**
   * Get the first `n` OfficialSlots.
  **/
  first?: number | null
  /**
   * Get the last `n` OfficialSlots.
  **/
  last?: number | null
}

export type FindManyOfficialSlotIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialSlotInclude | null
  /**
   * Filter, which OfficialSlots to fetch.
  **/
  where?: OfficialSlotWhereInput | null
  /**
   * Determine the order of the OfficialSlots to fetch.
  **/
  orderBy?: OfficialSlotOrderByInput | null
  /**
   * Skip the first `n` OfficialSlots.
  **/
  skip?: number | null
  /**
   * Get all OfficialSlots that come after the OfficialSlot you provide with the current order.
  **/
  after?: OfficialSlotWhereUniqueInput | null
  /**
   * Get all OfficialSlots that come before the OfficialSlot you provide with the current order.
  **/
  before?: OfficialSlotWhereUniqueInput | null
  /**
   * Get the first `n` OfficialSlots.
  **/
  first?: number | null
  /**
   * Get the last `n` OfficialSlots.
  **/
  last?: number | null
}

export type ExtractFindManyOfficialSlotSelectArgs<S extends undefined | boolean | FindManyOfficialSlotSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyOfficialSlotSelectArgs
  ? S['select']
  : true

export type ExtractFindManyOfficialSlotIncludeArgs<S extends undefined | boolean | FindManyOfficialSlotIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyOfficialSlotIncludeArgs
  ? S['include']
  : true



/**
 * OfficialSlot create
 */
export type OfficialSlotCreateArgs = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select?: OfficialSlotSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialSlotInclude | null
  /**
   * The data needed to create a OfficialSlot.
  **/
  data: OfficialSlotCreateInput
}

export type OfficialSlotCreateArgsRequired = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select: OfficialSlotSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialSlotInclude
  /**
   * The data needed to create a OfficialSlot.
  **/
  data: OfficialSlotCreateInput
}

export type OfficialSlotSelectCreateArgs = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select: OfficialSlotSelect
  /**
   * The data needed to create a OfficialSlot.
  **/
  data: OfficialSlotCreateInput
}

export type OfficialSlotSelectCreateArgsOptional = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select?: OfficialSlotSelect | null
  /**
   * The data needed to create a OfficialSlot.
  **/
  data: OfficialSlotCreateInput
}

export type OfficialSlotIncludeCreateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialSlotInclude
  /**
   * The data needed to create a OfficialSlot.
  **/
  data: OfficialSlotCreateInput
}

export type OfficialSlotIncludeCreateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialSlotInclude | null
  /**
   * The data needed to create a OfficialSlot.
  **/
  data: OfficialSlotCreateInput
}

export type ExtractOfficialSlotSelectCreateArgs<S extends undefined | boolean | OfficialSlotSelectCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialSlotSelectCreateArgs
  ? S['select']
  : true

export type ExtractOfficialSlotIncludeCreateArgs<S extends undefined | boolean | OfficialSlotIncludeCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialSlotIncludeCreateArgs
  ? S['include']
  : true



/**
 * OfficialSlot update
 */
export type OfficialSlotUpdateArgs = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select?: OfficialSlotSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialSlotInclude | null
  /**
   * The data needed to update a OfficialSlot.
  **/
  data: OfficialSlotUpdateInput
  /**
   * Choose, which OfficialSlot to update.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type OfficialSlotUpdateArgsRequired = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select: OfficialSlotSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialSlotInclude
  /**
   * The data needed to update a OfficialSlot.
  **/
  data: OfficialSlotUpdateInput
  /**
   * Choose, which OfficialSlot to update.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type OfficialSlotSelectUpdateArgs = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select: OfficialSlotSelect
  /**
   * The data needed to update a OfficialSlot.
  **/
  data: OfficialSlotUpdateInput
  /**
   * Choose, which OfficialSlot to update.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type OfficialSlotSelectUpdateArgsOptional = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select?: OfficialSlotSelect | null
  /**
   * The data needed to update a OfficialSlot.
  **/
  data: OfficialSlotUpdateInput
  /**
   * Choose, which OfficialSlot to update.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type OfficialSlotIncludeUpdateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialSlotInclude
  /**
   * The data needed to update a OfficialSlot.
  **/
  data: OfficialSlotUpdateInput
  /**
   * Choose, which OfficialSlot to update.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type OfficialSlotIncludeUpdateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialSlotInclude | null
  /**
   * The data needed to update a OfficialSlot.
  **/
  data: OfficialSlotUpdateInput
  /**
   * Choose, which OfficialSlot to update.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type ExtractOfficialSlotSelectUpdateArgs<S extends undefined | boolean | OfficialSlotSelectUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialSlotSelectUpdateArgs
  ? S['select']
  : true

export type ExtractOfficialSlotIncludeUpdateArgs<S extends undefined | boolean | OfficialSlotIncludeUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialSlotIncludeUpdateArgs
  ? S['include']
  : true



/**
 * OfficialSlot updateMany
 */
export type OfficialSlotUpdateManyArgs = {
  data: OfficialSlotUpdateManyMutationInput
  where?: OfficialSlotWhereInput | null
}


/**
 * OfficialSlot upsert
 */
export type OfficialSlotUpsertArgs = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select?: OfficialSlotSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialSlotInclude | null
  /**
   * The filter to search for the OfficialSlot to update in case it exists.
  **/
  where: OfficialSlotWhereUniqueInput
  /**
   * In case the OfficialSlot found by the `where` argument doesn't exist, create a new OfficialSlot with this data.
  **/
  create: OfficialSlotCreateInput
  /**
   * In case the OfficialSlot was found with the provided `where` argument, update it with this data.
  **/
  update: OfficialSlotUpdateInput
}

export type OfficialSlotUpsertArgsRequired = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select: OfficialSlotSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialSlotInclude
  /**
   * The filter to search for the OfficialSlot to update in case it exists.
  **/
  where: OfficialSlotWhereUniqueInput
  /**
   * In case the OfficialSlot found by the `where` argument doesn't exist, create a new OfficialSlot with this data.
  **/
  create: OfficialSlotCreateInput
  /**
   * In case the OfficialSlot was found with the provided `where` argument, update it with this data.
  **/
  update: OfficialSlotUpdateInput
}

export type OfficialSlotSelectUpsertArgs = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select: OfficialSlotSelect
  /**
   * The filter to search for the OfficialSlot to update in case it exists.
  **/
  where: OfficialSlotWhereUniqueInput
  /**
   * In case the OfficialSlot found by the `where` argument doesn't exist, create a new OfficialSlot with this data.
  **/
  create: OfficialSlotCreateInput
  /**
   * In case the OfficialSlot was found with the provided `where` argument, update it with this data.
  **/
  update: OfficialSlotUpdateInput
}

export type OfficialSlotSelectUpsertArgsOptional = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select?: OfficialSlotSelect | null
  /**
   * The filter to search for the OfficialSlot to update in case it exists.
  **/
  where: OfficialSlotWhereUniqueInput
  /**
   * In case the OfficialSlot found by the `where` argument doesn't exist, create a new OfficialSlot with this data.
  **/
  create: OfficialSlotCreateInput
  /**
   * In case the OfficialSlot was found with the provided `where` argument, update it with this data.
  **/
  update: OfficialSlotUpdateInput
}

export type OfficialSlotIncludeUpsertArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialSlotInclude
  /**
   * The filter to search for the OfficialSlot to update in case it exists.
  **/
  where: OfficialSlotWhereUniqueInput
  /**
   * In case the OfficialSlot found by the `where` argument doesn't exist, create a new OfficialSlot with this data.
  **/
  create: OfficialSlotCreateInput
  /**
   * In case the OfficialSlot was found with the provided `where` argument, update it with this data.
  **/
  update: OfficialSlotUpdateInput
}

export type OfficialSlotIncludeUpsertArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialSlotInclude | null
  /**
   * The filter to search for the OfficialSlot to update in case it exists.
  **/
  where: OfficialSlotWhereUniqueInput
  /**
   * In case the OfficialSlot found by the `where` argument doesn't exist, create a new OfficialSlot with this data.
  **/
  create: OfficialSlotCreateInput
  /**
   * In case the OfficialSlot was found with the provided `where` argument, update it with this data.
  **/
  update: OfficialSlotUpdateInput
}

export type ExtractOfficialSlotSelectUpsertArgs<S extends undefined | boolean | OfficialSlotSelectUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialSlotSelectUpsertArgs
  ? S['select']
  : true

export type ExtractOfficialSlotIncludeUpsertArgs<S extends undefined | boolean | OfficialSlotIncludeUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialSlotIncludeUpsertArgs
  ? S['include']
  : true



/**
 * OfficialSlot delete
 */
export type OfficialSlotDeleteArgs = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select?: OfficialSlotSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialSlotInclude | null
  /**
   * Filter which OfficialSlot to delete.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type OfficialSlotDeleteArgsRequired = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select: OfficialSlotSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialSlotInclude
  /**
   * Filter which OfficialSlot to delete.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type OfficialSlotSelectDeleteArgs = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select: OfficialSlotSelect
  /**
   * Filter which OfficialSlot to delete.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type OfficialSlotSelectDeleteArgsOptional = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select?: OfficialSlotSelect | null
  /**
   * Filter which OfficialSlot to delete.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type OfficialSlotIncludeDeleteArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialSlotInclude
  /**
   * Filter which OfficialSlot to delete.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type OfficialSlotIncludeDeleteArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialSlotInclude | null
  /**
   * Filter which OfficialSlot to delete.
  **/
  where: OfficialSlotWhereUniqueInput
}

export type ExtractOfficialSlotSelectDeleteArgs<S extends undefined | boolean | OfficialSlotSelectDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialSlotSelectDeleteArgs
  ? S['select']
  : true

export type ExtractOfficialSlotIncludeDeleteArgs<S extends undefined | boolean | OfficialSlotIncludeDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialSlotIncludeDeleteArgs
  ? S['include']
  : true



/**
 * OfficialSlot deleteMany
 */
export type OfficialSlotDeleteManyArgs = {
  where?: OfficialSlotWhereInput | null
}


/**
 * OfficialSlot without action
 */
export type OfficialSlotArgs = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select?: OfficialSlotSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialSlotInclude | null
}

export type OfficialSlotArgsRequired = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select: OfficialSlotSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialSlotInclude
}

export type OfficialSlotSelectArgs = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select: OfficialSlotSelect
}

export type OfficialSlotSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the OfficialSlot
  **/
  select?: OfficialSlotSelect | null
}

export type OfficialSlotIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: OfficialSlotInclude
}

export type OfficialSlotIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: OfficialSlotInclude | null
}

export type ExtractOfficialSlotSelectArgs<S extends undefined | boolean | OfficialSlotSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialSlotSelectArgs
  ? S['select']
  : true

export type ExtractOfficialSlotIncludeArgs<S extends undefined | boolean | OfficialSlotIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends OfficialSlotIncludeArgs
  ? S['include']
  : true




/**
 * Model User
 */

export type User = {
  id: string
  createdAt: Date
  updatedAt: Date
  role: Role
  username: string
  passwordHash: string
  salt: string
}

export type UserScalars = 'id' | 'createdAt' | 'updatedAt' | 'role' | 'username' | 'passwordHash' | 'salt'
  

export type UserSelect = {
  id?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  role?: boolean
  username?: boolean
  passwordHash?: boolean
  salt?: boolean
}

export type UserInclude = {

}

type UserDefault = {
  id: true
  createdAt: true
  updatedAt: true
  role: true
  username: true
  passwordHash: true
  salt: true
}


export type UserGetSelectPayload<S extends boolean | UserSelect> = S extends true
  ? User
  : S extends UserSelect
  ? {
      [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends UserScalars
        ? User[P]
        : never
    }
   : never

export type UserGetIncludePayload<S extends boolean | UserInclude> = S extends true
  ? User
  : S extends UserInclude
  ? {
      [P in CleanupNever<MergeTruthyValues<UserDefault, S>>]: P extends UserScalars
        ? User[P]
        : never
    }
   : never

export interface UserDelegate {
  /**
   * Find zero or one User.
   * @param {FindOneUserArgs} args - Arguments to find a User
   * @example
   * // Get one User
   * const user = await prisma.user.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneUserArgs>(
    args: Subset<T, FindOneUserArgs>
  ): T extends FindOneUserArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneUserSelectArgs ? Promise<UserGetSelectPayload<ExtractFindOneUserSelectArgs<T>> | null>
  : T extends FindOneUserIncludeArgs ? Promise<UserGetIncludePayload<ExtractFindOneUserIncludeArgs<T>> | null> : UserClient<User | null>
  /**
   * Find zero or more Users.
   * @param {FindManyUserArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Users
   * const users = await prisma.user.findMany()
   * 
   * // Get first 10 Users
   * const users = await prisma.user.findMany({ first: 10 })
   * 
   * // Only select the `id`
   * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
   * 
  **/
  findMany<T extends FindManyUserArgs>(
    args?: Subset<T, FindManyUserArgs>
  ): T extends FindManyUserArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyUserSelectArgs
  ? Promise<Array<UserGetSelectPayload<ExtractFindManyUserSelectArgs<T>>>> : T extends FindManyUserIncludeArgs
  ? Promise<Array<UserGetIncludePayload<ExtractFindManyUserIncludeArgs<T>>>> : Promise<Array<User>>
  /**
   * Create a User.
   * @param {UserCreateArgs} args - Arguments to create a User.
   * @example
   * // Create one User
   * const user = await prisma.user.create({
   *   data: {
   *     // ... data to create a User
   *   }
   * })
   * 
  **/
  create<T extends UserCreateArgs>(
    args: Subset<T, UserCreateArgs>
  ): T extends UserCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectCreateArgs ? Promise<UserGetSelectPayload<ExtractUserSelectCreateArgs<T>>>
  : T extends UserIncludeCreateArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeCreateArgs<T>>> : UserClient<User>
  /**
   * Delete a User.
   * @param {UserDeleteArgs} args - Arguments to delete one User.
   * @example
   * // Delete one User
   * const user = await prisma.user.delete({
   *   where: {
   *     // ... filter to delete one User
   *   }
   * })
   * 
  **/
  delete<T extends UserDeleteArgs>(
    args: Subset<T, UserDeleteArgs>
  ): T extends UserDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectDeleteArgs ? Promise<UserGetSelectPayload<ExtractUserSelectDeleteArgs<T>>>
  : T extends UserIncludeDeleteArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeDeleteArgs<T>>> : UserClient<User>
  /**
   * Update one User.
   * @param {UserUpdateArgs} args - Arguments to update one User.
   * @example
   * // Update one User
   * const user = await prisma.user.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends UserUpdateArgs>(
    args: Subset<T, UserUpdateArgs>
  ): T extends UserUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectUpdateArgs ? Promise<UserGetSelectPayload<ExtractUserSelectUpdateArgs<T>>>
  : T extends UserIncludeUpdateArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeUpdateArgs<T>>> : UserClient<User>
  /**
   * Delete zero or more Users.
   * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
   * @example
   * // Delete a few Users
   * const { count } = await prisma.user.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends UserDeleteManyArgs>(
    args: Subset<T, UserDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Users.
   * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Users
   * const user = await prisma.user.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  updateMany<T extends UserUpdateManyArgs>(
    args: Subset<T, UserUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one User.
   * @param {UserUpsertArgs} args - Arguments to update or create a User.
   * @example
   * // Update or create a User
   * const user = await prisma.user.upsert({
   *   create: {
   *     // ... data to create a User
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the User we want to update
   *   }
   * })
  **/
  upsert<T extends UserUpsertArgs>(
    args: Subset<T, UserUpsertArgs>
  ): T extends UserUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectUpsertArgs ? Promise<UserGetSelectPayload<ExtractUserSelectUpsertArgs<T>>>
  : T extends UserIncludeUpsertArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeUpsertArgs<T>>> : UserClient<User>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class UserClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  private _collectTimestamps?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';


  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * User findOne
 */
export type FindOneUserArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * Filter, which User to fetch.
  **/
  where: UserWhereUniqueInput
}

export type FindOneUserArgsRequired = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * Filter, which User to fetch.
  **/
  where: UserWhereUniqueInput
}

export type FindOneUserSelectArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Filter, which User to fetch.
  **/
  where: UserWhereUniqueInput
}

export type FindOneUserSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Filter, which User to fetch.
  **/
  where: UserWhereUniqueInput
}

export type FindOneUserIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * Filter, which User to fetch.
  **/
  where: UserWhereUniqueInput
}

export type FindOneUserIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * Filter, which User to fetch.
  **/
  where: UserWhereUniqueInput
}

export type ExtractFindOneUserSelectArgs<S extends undefined | boolean | FindOneUserSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneUserSelectArgs
  ? S['select']
  : true

export type ExtractFindOneUserIncludeArgs<S extends undefined | boolean | FindOneUserIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneUserIncludeArgs
  ? S['include']
  : true



/**
 * User findMany
 */
export type FindManyUserArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * Filter, which Users to fetch.
  **/
  where?: UserWhereInput | null
  /**
   * Determine the order of the Users to fetch.
  **/
  orderBy?: UserOrderByInput | null
  /**
   * Skip the first `n` Users.
  **/
  skip?: number | null
  /**
   * Get all Users that come after the User you provide with the current order.
  **/
  after?: UserWhereUniqueInput | null
  /**
   * Get all Users that come before the User you provide with the current order.
  **/
  before?: UserWhereUniqueInput | null
  /**
   * Get the first `n` Users.
  **/
  first?: number | null
  /**
   * Get the last `n` Users.
  **/
  last?: number | null
}

export type FindManyUserArgsRequired = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * Filter, which Users to fetch.
  **/
  where?: UserWhereInput | null
  /**
   * Determine the order of the Users to fetch.
  **/
  orderBy?: UserOrderByInput | null
  /**
   * Skip the first `n` Users.
  **/
  skip?: number | null
  /**
   * Get all Users that come after the User you provide with the current order.
  **/
  after?: UserWhereUniqueInput | null
  /**
   * Get all Users that come before the User you provide with the current order.
  **/
  before?: UserWhereUniqueInput | null
  /**
   * Get the first `n` Users.
  **/
  first?: number | null
  /**
   * Get the last `n` Users.
  **/
  last?: number | null
}

export type FindManyUserSelectArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Filter, which Users to fetch.
  **/
  where?: UserWhereInput | null
  /**
   * Determine the order of the Users to fetch.
  **/
  orderBy?: UserOrderByInput | null
  /**
   * Skip the first `n` Users.
  **/
  skip?: number | null
  /**
   * Get all Users that come after the User you provide with the current order.
  **/
  after?: UserWhereUniqueInput | null
  /**
   * Get all Users that come before the User you provide with the current order.
  **/
  before?: UserWhereUniqueInput | null
  /**
   * Get the first `n` Users.
  **/
  first?: number | null
  /**
   * Get the last `n` Users.
  **/
  last?: number | null
}

export type FindManyUserSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Filter, which Users to fetch.
  **/
  where?: UserWhereInput | null
  /**
   * Determine the order of the Users to fetch.
  **/
  orderBy?: UserOrderByInput | null
  /**
   * Skip the first `n` Users.
  **/
  skip?: number | null
  /**
   * Get all Users that come after the User you provide with the current order.
  **/
  after?: UserWhereUniqueInput | null
  /**
   * Get all Users that come before the User you provide with the current order.
  **/
  before?: UserWhereUniqueInput | null
  /**
   * Get the first `n` Users.
  **/
  first?: number | null
  /**
   * Get the last `n` Users.
  **/
  last?: number | null
}

export type FindManyUserIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * Filter, which Users to fetch.
  **/
  where?: UserWhereInput | null
  /**
   * Determine the order of the Users to fetch.
  **/
  orderBy?: UserOrderByInput | null
  /**
   * Skip the first `n` Users.
  **/
  skip?: number | null
  /**
   * Get all Users that come after the User you provide with the current order.
  **/
  after?: UserWhereUniqueInput | null
  /**
   * Get all Users that come before the User you provide with the current order.
  **/
  before?: UserWhereUniqueInput | null
  /**
   * Get the first `n` Users.
  **/
  first?: number | null
  /**
   * Get the last `n` Users.
  **/
  last?: number | null
}

export type FindManyUserIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * Filter, which Users to fetch.
  **/
  where?: UserWhereInput | null
  /**
   * Determine the order of the Users to fetch.
  **/
  orderBy?: UserOrderByInput | null
  /**
   * Skip the first `n` Users.
  **/
  skip?: number | null
  /**
   * Get all Users that come after the User you provide with the current order.
  **/
  after?: UserWhereUniqueInput | null
  /**
   * Get all Users that come before the User you provide with the current order.
  **/
  before?: UserWhereUniqueInput | null
  /**
   * Get the first `n` Users.
  **/
  first?: number | null
  /**
   * Get the last `n` Users.
  **/
  last?: number | null
}

export type ExtractFindManyUserSelectArgs<S extends undefined | boolean | FindManyUserSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyUserSelectArgs
  ? S['select']
  : true

export type ExtractFindManyUserIncludeArgs<S extends undefined | boolean | FindManyUserIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyUserIncludeArgs
  ? S['include']
  : true



/**
 * User create
 */
export type UserCreateArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * The data needed to create a User.
  **/
  data: UserCreateInput
}

export type UserCreateArgsRequired = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * The data needed to create a User.
  **/
  data: UserCreateInput
}

export type UserSelectCreateArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * The data needed to create a User.
  **/
  data: UserCreateInput
}

export type UserSelectCreateArgsOptional = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * The data needed to create a User.
  **/
  data: UserCreateInput
}

export type UserIncludeCreateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * The data needed to create a User.
  **/
  data: UserCreateInput
}

export type UserIncludeCreateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * The data needed to create a User.
  **/
  data: UserCreateInput
}

export type ExtractUserSelectCreateArgs<S extends undefined | boolean | UserSelectCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserSelectCreateArgs
  ? S['select']
  : true

export type ExtractUserIncludeCreateArgs<S extends undefined | boolean | UserIncludeCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserIncludeCreateArgs
  ? S['include']
  : true



/**
 * User update
 */
export type UserUpdateArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * The data needed to update a User.
  **/
  data: UserUpdateInput
  /**
   * Choose, which User to update.
  **/
  where: UserWhereUniqueInput
}

export type UserUpdateArgsRequired = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * The data needed to update a User.
  **/
  data: UserUpdateInput
  /**
   * Choose, which User to update.
  **/
  where: UserWhereUniqueInput
}

export type UserSelectUpdateArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * The data needed to update a User.
  **/
  data: UserUpdateInput
  /**
   * Choose, which User to update.
  **/
  where: UserWhereUniqueInput
}

export type UserSelectUpdateArgsOptional = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * The data needed to update a User.
  **/
  data: UserUpdateInput
  /**
   * Choose, which User to update.
  **/
  where: UserWhereUniqueInput
}

export type UserIncludeUpdateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * The data needed to update a User.
  **/
  data: UserUpdateInput
  /**
   * Choose, which User to update.
  **/
  where: UserWhereUniqueInput
}

export type UserIncludeUpdateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * The data needed to update a User.
  **/
  data: UserUpdateInput
  /**
   * Choose, which User to update.
  **/
  where: UserWhereUniqueInput
}

export type ExtractUserSelectUpdateArgs<S extends undefined | boolean | UserSelectUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserSelectUpdateArgs
  ? S['select']
  : true

export type ExtractUserIncludeUpdateArgs<S extends undefined | boolean | UserIncludeUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserIncludeUpdateArgs
  ? S['include']
  : true



/**
 * User updateMany
 */
export type UserUpdateManyArgs = {
  data: UserUpdateManyMutationInput
  where?: UserWhereInput | null
}


/**
 * User upsert
 */
export type UserUpsertArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * The filter to search for the User to update in case it exists.
  **/
  where: UserWhereUniqueInput
  /**
   * In case the User found by the `where` argument doesn't exist, create a new User with this data.
  **/
  create: UserCreateInput
  /**
   * In case the User was found with the provided `where` argument, update it with this data.
  **/
  update: UserUpdateInput
}

export type UserUpsertArgsRequired = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * The filter to search for the User to update in case it exists.
  **/
  where: UserWhereUniqueInput
  /**
   * In case the User found by the `where` argument doesn't exist, create a new User with this data.
  **/
  create: UserCreateInput
  /**
   * In case the User was found with the provided `where` argument, update it with this data.
  **/
  update: UserUpdateInput
}

export type UserSelectUpsertArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * The filter to search for the User to update in case it exists.
  **/
  where: UserWhereUniqueInput
  /**
   * In case the User found by the `where` argument doesn't exist, create a new User with this data.
  **/
  create: UserCreateInput
  /**
   * In case the User was found with the provided `where` argument, update it with this data.
  **/
  update: UserUpdateInput
}

export type UserSelectUpsertArgsOptional = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * The filter to search for the User to update in case it exists.
  **/
  where: UserWhereUniqueInput
  /**
   * In case the User found by the `where` argument doesn't exist, create a new User with this data.
  **/
  create: UserCreateInput
  /**
   * In case the User was found with the provided `where` argument, update it with this data.
  **/
  update: UserUpdateInput
}

export type UserIncludeUpsertArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * The filter to search for the User to update in case it exists.
  **/
  where: UserWhereUniqueInput
  /**
   * In case the User found by the `where` argument doesn't exist, create a new User with this data.
  **/
  create: UserCreateInput
  /**
   * In case the User was found with the provided `where` argument, update it with this data.
  **/
  update: UserUpdateInput
}

export type UserIncludeUpsertArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * The filter to search for the User to update in case it exists.
  **/
  where: UserWhereUniqueInput
  /**
   * In case the User found by the `where` argument doesn't exist, create a new User with this data.
  **/
  create: UserCreateInput
  /**
   * In case the User was found with the provided `where` argument, update it with this data.
  **/
  update: UserUpdateInput
}

export type ExtractUserSelectUpsertArgs<S extends undefined | boolean | UserSelectUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserSelectUpsertArgs
  ? S['select']
  : true

export type ExtractUserIncludeUpsertArgs<S extends undefined | boolean | UserIncludeUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserIncludeUpsertArgs
  ? S['include']
  : true



/**
 * User delete
 */
export type UserDeleteArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * Filter which User to delete.
  **/
  where: UserWhereUniqueInput
}

export type UserDeleteArgsRequired = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * Filter which User to delete.
  **/
  where: UserWhereUniqueInput
}

export type UserSelectDeleteArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Filter which User to delete.
  **/
  where: UserWhereUniqueInput
}

export type UserSelectDeleteArgsOptional = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Filter which User to delete.
  **/
  where: UserWhereUniqueInput
}

export type UserIncludeDeleteArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * Filter which User to delete.
  **/
  where: UserWhereUniqueInput
}

export type UserIncludeDeleteArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * Filter which User to delete.
  **/
  where: UserWhereUniqueInput
}

export type ExtractUserSelectDeleteArgs<S extends undefined | boolean | UserSelectDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserSelectDeleteArgs
  ? S['select']
  : true

export type ExtractUserIncludeDeleteArgs<S extends undefined | boolean | UserIncludeDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserIncludeDeleteArgs
  ? S['include']
  : true



/**
 * User deleteMany
 */
export type UserDeleteManyArgs = {
  where?: UserWhereInput | null
}


/**
 * User without action
 */
export type UserArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
}

export type UserArgsRequired = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
}

export type UserSelectArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
}

export type UserSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
}

export type UserIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
}

export type UserIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
}

export type ExtractUserSelectArgs<S extends undefined | boolean | UserSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserSelectArgs
  ? S['select']
  : true

export type ExtractUserIncludeArgs<S extends undefined | boolean | UserIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserIncludeArgs
  ? S['include']
  : true




/**
 * Deep Input Types
 */


export type WeightClassWhereInput = {
  id?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  name?: string | StringFilter | null
  gender?: Gender | GenderFilter | null
  min?: number | FloatFilter | null
  max?: number | IntFilter | null
  athletes?: AthleteFilter | null
  AND?: Enumerable<WeightClassWhereInput> | null
  OR?: Enumerable<WeightClassWhereInput> | null
  NOT?: Enumerable<WeightClassWhereInput> | null
}

export type AgeClassWhereInput = {
  id?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  name?: string | StringFilter | null
  sortId?: number | IntFilter | null
  athletes?: AthleteFilter | null
  AND?: Enumerable<AgeClassWhereInput> | null
  OR?: Enumerable<AgeClassWhereInput> | null
  NOT?: Enumerable<AgeClassWhereInput> | null
}

export type AttemptWhereInput = {
  id?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  discipline?: Discipline | DisciplineFilter | null
  date?: Date | string | DateTimeFilter | null
  index?: number | IntFilter | null
  weight?: number | IntFilter | null
  raw?: boolean | BooleanFilter | null
  valid?: boolean | BooleanFilter | null
  done?: boolean | BooleanFilter | null
  resign?: boolean | BooleanFilter | null
  AND?: Enumerable<AttemptWhereInput> | null
  OR?: Enumerable<AttemptWhereInput> | null
  NOT?: Enumerable<AttemptWhereInput> | null
  athlete?: AthleteWhereInput | null
}

export type AthleteWhereInput = {
  id?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  raw?: boolean | BooleanFilter | null
  athleteNumber?: number | IntFilter | null
  firstName?: string | StringFilter | null
  lastName?: string | StringFilter | null
  gender?: Gender | GenderFilter | null
  club?: string | StringFilter | null
  birthday?: Date | string | DateTimeFilter | null
  total?: number | FloatFilter | null
  norm?: boolean | BooleanFilter | null
  lateRegistration?: boolean | BooleanFilter | null
  price?: number | FloatFilter | null
  bodyWeight?: number | FloatFilter | null
  wilks?: number | FloatFilter | null
  dots?: number | FloatFilter | null
  los?: number | IntFilter | null
  KB1?: number | FloatFilter | null
  KB2?: number | FloatFilter | null
  KB3?: number | FloatFilter | null
  BD1?: number | FloatFilter | null
  BD2?: number | FloatFilter | null
  BD3?: number | FloatFilter | null
  KH1?: number | FloatFilter | null
  KH2?: number | FloatFilter | null
  KH3?: number | FloatFilter | null
  points?: number | FloatFilter | null
  place?: number | IntFilter | null
  location?: string | StringFilter | null
  nextAttemptsSortKeys?: string | StringFilter | null
  importId?: number | IntFilter | null
  resultClassId?: string | StringFilter | null
  attempts?: AttemptFilter | null
  AND?: Enumerable<AthleteWhereInput> | null
  OR?: Enumerable<AthleteWhereInput> | null
  NOT?: Enumerable<AthleteWhereInput> | null
  event?: EventWhereInput | null
  weightClass?: WeightClassWhereInput | null
  ageClass?: AgeClassWhereInput | null
}

export type AthleteGroupWhereInput = {
  id?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  name?: string | StringFilter | null
  AND?: Enumerable<AthleteGroupWhereInput> | null
  OR?: Enumerable<AthleteGroupWhereInput> | null
  NOT?: Enumerable<AthleteGroupWhereInput> | null
  event?: EventWhereInput | null
  slot?: SlotWhereInput | null
}

export type OfficialWhereInput = {
  id?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  officalNumber?: number | IntFilter | null
  lastName?: string | StringFilter | null
  firstName?: string | StringFilter | null
  club?: string | StringFilter | null
  license?: string | StringFilter | null
  position?: string | StringFilter | null
  location?: string | StringFilter | null
  importId?: number | IntFilter | null
  officialSlots?: OfficialSlotFilter | null
  AND?: Enumerable<OfficialWhereInput> | null
  OR?: Enumerable<OfficialWhereInput> | null
  NOT?: Enumerable<OfficialWhereInput> | null
  event?: EventWhereInput | null
}

export type OfficialSlotWhereInput = {
  id?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  position?: Position | PositionFilter | null
  AND?: Enumerable<OfficialSlotWhereInput> | null
  OR?: Enumerable<OfficialSlotWhereInput> | null
  NOT?: Enumerable<OfficialSlotWhereInput> | null
  official?: OfficialWhereInput | null
  slot?: SlotWhereInput | null
}

export type SlotWhereInput = {
  id?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  name?: string | StringFilter | null
  athleteGroups?: AthleteGroupFilter | null
  officialSlots?: OfficialSlotFilter | null
  AND?: Enumerable<SlotWhereInput> | null
  OR?: Enumerable<SlotWhereInput> | null
  NOT?: Enumerable<SlotWhereInput> | null
  event?: EventWhereInput | null
}

export type EventWhereInput = {
  id?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  name?: string | StringFilter | null
  discipline?: Discipline | DisciplineFilter | null
  contestType?: ContestType | ContestTypeFilter | null
  athletes?: AthleteFilter | null
  slots?: SlotFilter | null
  athleteGroups?: AthleteGroupFilter | null
  officials?: OfficialFilter | null
  AND?: Enumerable<EventWhereInput> | null
  OR?: Enumerable<EventWhereInput> | null
  NOT?: Enumerable<EventWhereInput> | null
}

export type EventWhereUniqueInput = {
  id?: string | null
}

export type AthleteWhereUniqueInput = {
  id?: string | null
}

export type AttemptWhereUniqueInput = {
  id?: string | null
}

export type SlotWhereUniqueInput = {
  id?: string | null
}

export type AthleteGroupWhereUniqueInput = {
  id?: string | null
}

export type OfficialSlotWhereUniqueInput = {
  id?: string | null
}

export type OfficialWhereUniqueInput = {
  id?: string | null
}

export type WeightClassWhereUniqueInput = {
  id?: string | null
}

export type AgeClassWhereUniqueInput = {
  id?: string | null
}

export type UserWhereInput = {
  id?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  role?: Role | RoleFilter | null
  username?: string | StringFilter | null
  passwordHash?: string | StringFilter | null
  salt?: string | StringFilter | null
  AND?: Enumerable<UserWhereInput> | null
  OR?: Enumerable<UserWhereInput> | null
  NOT?: Enumerable<UserWhereInput> | null
}

export type UserWhereUniqueInput = {
  id?: string | null
}

export type WeightClassCreateWithoutAthletesInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name: string
  gender: Gender
  min: number
  max: number
}

export type WeightClassCreateOneWithoutAthletesInput = {
  create?: WeightClassCreateWithoutAthletesInput | null
  connect?: WeightClassWhereUniqueInput | null
}

export type AgeClassCreateWithoutAthletesInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name: string
  sortId: number
}

export type AgeClassCreateOneWithoutAthletesInput = {
  create?: AgeClassCreateWithoutAthletesInput | null
  connect?: AgeClassWhereUniqueInput | null
}

export type AttemptCreateWithoutAthleteInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  discipline: Discipline
  date: Date | string
  index: number
  weight: number
  raw: boolean
  valid: boolean
  done: boolean
  resign: boolean
}

export type AttemptCreateManyWithoutAthleteInput = {
  create?: Enumerable<AttemptCreateWithoutAthleteInput> | null
  connect?: Enumerable<AttemptWhereUniqueInput> | null
}

export type AthleteCreateWithoutEventInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  raw: boolean
  athleteNumber: number
  firstName: string
  lastName: string
  gender: Gender
  club: string
  birthday: Date | string
  total: number
  norm: boolean
  lateRegistration: boolean
  price: number
  bodyWeight: number
  wilks: number
  dots: number
  los: number
  KB1: number
  KB2: number
  KB3: number
  BD1: number
  BD2: number
  BD3: number
  KH1: number
  KH2: number
  KH3: number
  points: number
  place: number
  location: string
  nextAttemptsSortKeys: string
  importId: number
  resultClassId: string
  weightClass: WeightClassCreateOneWithoutAthletesInput
  ageClass: AgeClassCreateOneWithoutAthletesInput
  attempts?: AttemptCreateManyWithoutAthleteInput | null
}

export type AthleteCreateManyWithoutEventInput = {
  create?: Enumerable<AthleteCreateWithoutEventInput> | null
  connect?: Enumerable<AthleteWhereUniqueInput> | null
}

export type EventCreateWithoutOfficialsInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name: string
  discipline: Discipline
  contestType: ContestType
  athletes?: AthleteCreateManyWithoutEventInput | null
  slots?: SlotCreateManyWithoutEventInput | null
  athleteGroups?: AthleteGroupCreateManyWithoutEventInput | null
}

export type EventCreateOneWithoutOfficialsInput = {
  create?: EventCreateWithoutOfficialsInput | null
  connect?: EventWhereUniqueInput | null
}

export type OfficialCreateWithoutOfficialSlotsInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  officalNumber: number
  lastName: string
  firstName: string
  club: string
  license: string
  position: string
  location: string
  importId: number
  event: EventCreateOneWithoutOfficialsInput
}

export type OfficialCreateOneWithoutOfficialSlotsInput = {
  create?: OfficialCreateWithoutOfficialSlotsInput | null
  connect?: OfficialWhereUniqueInput | null
}

export type OfficialSlotCreateWithoutSlotInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  position: Position
  official: OfficialCreateOneWithoutOfficialSlotsInput
}

export type OfficialSlotCreateManyWithoutSlotInput = {
  create?: Enumerable<OfficialSlotCreateWithoutSlotInput> | null
  connect?: Enumerable<OfficialSlotWhereUniqueInput> | null
}

export type SlotCreateWithoutAthleteGroupsInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name: string
  event: EventCreateOneWithoutSlotsInput
  officialSlots?: OfficialSlotCreateManyWithoutSlotInput | null
}

export type SlotCreateOneWithoutAthleteGroupsInput = {
  create?: SlotCreateWithoutAthleteGroupsInput | null
  connect?: SlotWhereUniqueInput | null
}

export type AthleteGroupCreateWithoutEventInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name: string
  slot: SlotCreateOneWithoutAthleteGroupsInput
}

export type AthleteGroupCreateManyWithoutEventInput = {
  create?: Enumerable<AthleteGroupCreateWithoutEventInput> | null
  connect?: Enumerable<AthleteGroupWhereUniqueInput> | null
}

export type EventCreateWithoutSlotsInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name: string
  discipline: Discipline
  contestType: ContestType
  athletes?: AthleteCreateManyWithoutEventInput | null
  athleteGroups?: AthleteGroupCreateManyWithoutEventInput | null
  officials?: OfficialCreateManyWithoutEventInput | null
}

export type EventCreateOneWithoutSlotsInput = {
  create?: EventCreateWithoutSlotsInput | null
  connect?: EventWhereUniqueInput | null
}

export type SlotCreateWithoutOfficialSlotsInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name: string
  event: EventCreateOneWithoutSlotsInput
  athleteGroups?: AthleteGroupCreateManyWithoutSlotInput | null
}

export type SlotCreateOneWithoutOfficialSlotsInput = {
  create?: SlotCreateWithoutOfficialSlotsInput | null
  connect?: SlotWhereUniqueInput | null
}

export type OfficialSlotCreateWithoutOfficialInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  position: Position
  slot: SlotCreateOneWithoutOfficialSlotsInput
}

export type OfficialSlotCreateManyWithoutOfficialInput = {
  create?: Enumerable<OfficialSlotCreateWithoutOfficialInput> | null
  connect?: Enumerable<OfficialSlotWhereUniqueInput> | null
}

export type OfficialCreateWithoutEventInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  officalNumber: number
  lastName: string
  firstName: string
  club: string
  license: string
  position: string
  location: string
  importId: number
  officialSlots?: OfficialSlotCreateManyWithoutOfficialInput | null
}

export type OfficialCreateManyWithoutEventInput = {
  create?: Enumerable<OfficialCreateWithoutEventInput> | null
  connect?: Enumerable<OfficialWhereUniqueInput> | null
}

export type EventCreateWithoutAthleteGroupsInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name: string
  discipline: Discipline
  contestType: ContestType
  athletes?: AthleteCreateManyWithoutEventInput | null
  slots?: SlotCreateManyWithoutEventInput | null
  officials?: OfficialCreateManyWithoutEventInput | null
}

export type EventCreateOneWithoutAthleteGroupsInput = {
  create?: EventCreateWithoutAthleteGroupsInput | null
  connect?: EventWhereUniqueInput | null
}

export type AthleteGroupCreateWithoutSlotInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name: string
  event: EventCreateOneWithoutAthleteGroupsInput
}

export type AthleteGroupCreateManyWithoutSlotInput = {
  create?: Enumerable<AthleteGroupCreateWithoutSlotInput> | null
  connect?: Enumerable<AthleteGroupWhereUniqueInput> | null
}

export type SlotCreateWithoutEventInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name: string
  athleteGroups?: AthleteGroupCreateManyWithoutSlotInput | null
  officialSlots?: OfficialSlotCreateManyWithoutSlotInput | null
}

export type SlotCreateManyWithoutEventInput = {
  create?: Enumerable<SlotCreateWithoutEventInput> | null
  connect?: Enumerable<SlotWhereUniqueInput> | null
}

export type EventCreateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name: string
  discipline: Discipline
  contestType: ContestType
  athletes?: AthleteCreateManyWithoutEventInput | null
  slots?: SlotCreateManyWithoutEventInput | null
  athleteGroups?: AthleteGroupCreateManyWithoutEventInput | null
  officials?: OfficialCreateManyWithoutEventInput | null
}

export type WeightClassUpdateWithoutAthletesDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  gender?: Gender | null
  min?: number | null
  max?: number | null
}

export type WeightClassUpsertWithoutAthletesInput = {
  update: WeightClassUpdateWithoutAthletesDataInput
  create: WeightClassCreateWithoutAthletesInput
}

export type WeightClassUpdateOneRequiredWithoutAthletesInput = {
  create?: WeightClassCreateWithoutAthletesInput | null
  connect?: WeightClassWhereUniqueInput | null
  update?: WeightClassUpdateWithoutAthletesDataInput | null
  upsert?: WeightClassUpsertWithoutAthletesInput | null
}

export type AgeClassUpdateWithoutAthletesDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  sortId?: number | null
}

export type AgeClassUpsertWithoutAthletesInput = {
  update: AgeClassUpdateWithoutAthletesDataInput
  create: AgeClassCreateWithoutAthletesInput
}

export type AgeClassUpdateOneRequiredWithoutAthletesInput = {
  create?: AgeClassCreateWithoutAthletesInput | null
  connect?: AgeClassWhereUniqueInput | null
  update?: AgeClassUpdateWithoutAthletesDataInput | null
  upsert?: AgeClassUpsertWithoutAthletesInput | null
}

export type AttemptUpdateWithoutAthleteDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  discipline?: Discipline | null
  date?: Date | string | null
  index?: number | null
  weight?: number | null
  raw?: boolean | null
  valid?: boolean | null
  done?: boolean | null
  resign?: boolean | null
}

export type AttemptUpdateWithWhereUniqueWithoutAthleteInput = {
  where: AttemptWhereUniqueInput
  data: AttemptUpdateWithoutAthleteDataInput
}

export type AttemptScalarWhereInput = {
  id?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  discipline?: Discipline | DisciplineFilter | null
  date?: Date | string | DateTimeFilter | null
  index?: number | IntFilter | null
  weight?: number | IntFilter | null
  raw?: boolean | BooleanFilter | null
  valid?: boolean | BooleanFilter | null
  done?: boolean | BooleanFilter | null
  resign?: boolean | BooleanFilter | null
  AND?: Enumerable<AttemptScalarWhereInput> | null
  OR?: Enumerable<AttemptScalarWhereInput> | null
  NOT?: Enumerable<AttemptScalarWhereInput> | null
}

export type AttemptUpdateManyDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  discipline?: Discipline | null
  date?: Date | string | null
  index?: number | null
  weight?: number | null
  raw?: boolean | null
  valid?: boolean | null
  done?: boolean | null
  resign?: boolean | null
}

export type AttemptUpdateManyWithWhereNestedInput = {
  where: AttemptScalarWhereInput
  data: AttemptUpdateManyDataInput
}

export type AttemptUpsertWithWhereUniqueWithoutAthleteInput = {
  where: AttemptWhereUniqueInput
  update: AttemptUpdateWithoutAthleteDataInput
  create: AttemptCreateWithoutAthleteInput
}

export type AttemptUpdateManyWithoutAthleteInput = {
  create?: Enumerable<AttemptCreateWithoutAthleteInput> | null
  connect?: Enumerable<AttemptWhereUniqueInput> | null
  set?: Enumerable<AttemptWhereUniqueInput> | null
  disconnect?: Enumerable<AttemptWhereUniqueInput> | null
  delete?: Enumerable<AttemptWhereUniqueInput> | null
  update?: Enumerable<AttemptUpdateWithWhereUniqueWithoutAthleteInput> | null
  updateMany?: Enumerable<AttemptUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<AttemptScalarWhereInput> | null
  upsert?: Enumerable<AttemptUpsertWithWhereUniqueWithoutAthleteInput> | null
}

export type AthleteUpdateWithoutEventDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  raw?: boolean | null
  athleteNumber?: number | null
  firstName?: string | null
  lastName?: string | null
  gender?: Gender | null
  club?: string | null
  birthday?: Date | string | null
  total?: number | null
  norm?: boolean | null
  lateRegistration?: boolean | null
  price?: number | null
  bodyWeight?: number | null
  wilks?: number | null
  dots?: number | null
  los?: number | null
  KB1?: number | null
  KB2?: number | null
  KB3?: number | null
  BD1?: number | null
  BD2?: number | null
  BD3?: number | null
  KH1?: number | null
  KH2?: number | null
  KH3?: number | null
  points?: number | null
  place?: number | null
  location?: string | null
  nextAttemptsSortKeys?: string | null
  importId?: number | null
  resultClassId?: string | null
  weightClass?: WeightClassUpdateOneRequiredWithoutAthletesInput | null
  ageClass?: AgeClassUpdateOneRequiredWithoutAthletesInput | null
  attempts?: AttemptUpdateManyWithoutAthleteInput | null
}

export type AthleteUpdateWithWhereUniqueWithoutEventInput = {
  where: AthleteWhereUniqueInput
  data: AthleteUpdateWithoutEventDataInput
}

export type AthleteScalarWhereInput = {
  id?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  raw?: boolean | BooleanFilter | null
  athleteNumber?: number | IntFilter | null
  firstName?: string | StringFilter | null
  lastName?: string | StringFilter | null
  gender?: Gender | GenderFilter | null
  club?: string | StringFilter | null
  birthday?: Date | string | DateTimeFilter | null
  total?: number | FloatFilter | null
  norm?: boolean | BooleanFilter | null
  lateRegistration?: boolean | BooleanFilter | null
  price?: number | FloatFilter | null
  bodyWeight?: number | FloatFilter | null
  wilks?: number | FloatFilter | null
  dots?: number | FloatFilter | null
  los?: number | IntFilter | null
  KB1?: number | FloatFilter | null
  KB2?: number | FloatFilter | null
  KB3?: number | FloatFilter | null
  BD1?: number | FloatFilter | null
  BD2?: number | FloatFilter | null
  BD3?: number | FloatFilter | null
  KH1?: number | FloatFilter | null
  KH2?: number | FloatFilter | null
  KH3?: number | FloatFilter | null
  points?: number | FloatFilter | null
  place?: number | IntFilter | null
  location?: string | StringFilter | null
  nextAttemptsSortKeys?: string | StringFilter | null
  importId?: number | IntFilter | null
  resultClassId?: string | StringFilter | null
  attempts?: AttemptFilter | null
  AND?: Enumerable<AthleteScalarWhereInput> | null
  OR?: Enumerable<AthleteScalarWhereInput> | null
  NOT?: Enumerable<AthleteScalarWhereInput> | null
}

export type AthleteUpdateManyDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  raw?: boolean | null
  athleteNumber?: number | null
  firstName?: string | null
  lastName?: string | null
  gender?: Gender | null
  club?: string | null
  birthday?: Date | string | null
  total?: number | null
  norm?: boolean | null
  lateRegistration?: boolean | null
  price?: number | null
  bodyWeight?: number | null
  wilks?: number | null
  dots?: number | null
  los?: number | null
  KB1?: number | null
  KB2?: number | null
  KB3?: number | null
  BD1?: number | null
  BD2?: number | null
  BD3?: number | null
  KH1?: number | null
  KH2?: number | null
  KH3?: number | null
  points?: number | null
  place?: number | null
  location?: string | null
  nextAttemptsSortKeys?: string | null
  importId?: number | null
  resultClassId?: string | null
}

export type AthleteUpdateManyWithWhereNestedInput = {
  where: AthleteScalarWhereInput
  data: AthleteUpdateManyDataInput
}

export type AthleteUpsertWithWhereUniqueWithoutEventInput = {
  where: AthleteWhereUniqueInput
  update: AthleteUpdateWithoutEventDataInput
  create: AthleteCreateWithoutEventInput
}

export type AthleteUpdateManyWithoutEventInput = {
  create?: Enumerable<AthleteCreateWithoutEventInput> | null
  connect?: Enumerable<AthleteWhereUniqueInput> | null
  set?: Enumerable<AthleteWhereUniqueInput> | null
  disconnect?: Enumerable<AthleteWhereUniqueInput> | null
  delete?: Enumerable<AthleteWhereUniqueInput> | null
  update?: Enumerable<AthleteUpdateWithWhereUniqueWithoutEventInput> | null
  updateMany?: Enumerable<AthleteUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<AthleteScalarWhereInput> | null
  upsert?: Enumerable<AthleteUpsertWithWhereUniqueWithoutEventInput> | null
}

export type EventUpdateWithoutOfficialsDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  discipline?: Discipline | null
  contestType?: ContestType | null
  athletes?: AthleteUpdateManyWithoutEventInput | null
  slots?: SlotUpdateManyWithoutEventInput | null
  athleteGroups?: AthleteGroupUpdateManyWithoutEventInput | null
}

export type EventUpsertWithoutOfficialsInput = {
  update: EventUpdateWithoutOfficialsDataInput
  create: EventCreateWithoutOfficialsInput
}

export type EventUpdateOneRequiredWithoutOfficialsInput = {
  create?: EventCreateWithoutOfficialsInput | null
  connect?: EventWhereUniqueInput | null
  update?: EventUpdateWithoutOfficialsDataInput | null
  upsert?: EventUpsertWithoutOfficialsInput | null
}

export type OfficialUpdateWithoutOfficialSlotsDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  officalNumber?: number | null
  lastName?: string | null
  firstName?: string | null
  club?: string | null
  license?: string | null
  position?: string | null
  location?: string | null
  importId?: number | null
  event?: EventUpdateOneRequiredWithoutOfficialsInput | null
}

export type OfficialUpsertWithoutOfficialSlotsInput = {
  update: OfficialUpdateWithoutOfficialSlotsDataInput
  create: OfficialCreateWithoutOfficialSlotsInput
}

export type OfficialUpdateOneRequiredWithoutOfficialSlotsInput = {
  create?: OfficialCreateWithoutOfficialSlotsInput | null
  connect?: OfficialWhereUniqueInput | null
  update?: OfficialUpdateWithoutOfficialSlotsDataInput | null
  upsert?: OfficialUpsertWithoutOfficialSlotsInput | null
}

export type OfficialSlotUpdateWithoutSlotDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  position?: Position | null
  official?: OfficialUpdateOneRequiredWithoutOfficialSlotsInput | null
}

export type OfficialSlotUpdateWithWhereUniqueWithoutSlotInput = {
  where: OfficialSlotWhereUniqueInput
  data: OfficialSlotUpdateWithoutSlotDataInput
}

export type OfficialSlotScalarWhereInput = {
  id?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  position?: Position | PositionFilter | null
  AND?: Enumerable<OfficialSlotScalarWhereInput> | null
  OR?: Enumerable<OfficialSlotScalarWhereInput> | null
  NOT?: Enumerable<OfficialSlotScalarWhereInput> | null
}

export type OfficialSlotUpdateManyDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  position?: Position | null
}

export type OfficialSlotUpdateManyWithWhereNestedInput = {
  where: OfficialSlotScalarWhereInput
  data: OfficialSlotUpdateManyDataInput
}

export type OfficialSlotUpsertWithWhereUniqueWithoutSlotInput = {
  where: OfficialSlotWhereUniqueInput
  update: OfficialSlotUpdateWithoutSlotDataInput
  create: OfficialSlotCreateWithoutSlotInput
}

export type OfficialSlotUpdateManyWithoutSlotInput = {
  create?: Enumerable<OfficialSlotCreateWithoutSlotInput> | null
  connect?: Enumerable<OfficialSlotWhereUniqueInput> | null
  set?: Enumerable<OfficialSlotWhereUniqueInput> | null
  disconnect?: Enumerable<OfficialSlotWhereUniqueInput> | null
  delete?: Enumerable<OfficialSlotWhereUniqueInput> | null
  update?: Enumerable<OfficialSlotUpdateWithWhereUniqueWithoutSlotInput> | null
  updateMany?: Enumerable<OfficialSlotUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<OfficialSlotScalarWhereInput> | null
  upsert?: Enumerable<OfficialSlotUpsertWithWhereUniqueWithoutSlotInput> | null
}

export type SlotUpdateWithoutAthleteGroupsDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  event?: EventUpdateOneRequiredWithoutSlotsInput | null
  officialSlots?: OfficialSlotUpdateManyWithoutSlotInput | null
}

export type SlotUpsertWithoutAthleteGroupsInput = {
  update: SlotUpdateWithoutAthleteGroupsDataInput
  create: SlotCreateWithoutAthleteGroupsInput
}

export type SlotUpdateOneRequiredWithoutAthleteGroupsInput = {
  create?: SlotCreateWithoutAthleteGroupsInput | null
  connect?: SlotWhereUniqueInput | null
  update?: SlotUpdateWithoutAthleteGroupsDataInput | null
  upsert?: SlotUpsertWithoutAthleteGroupsInput | null
}

export type AthleteGroupUpdateWithoutEventDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  slot?: SlotUpdateOneRequiredWithoutAthleteGroupsInput | null
}

export type AthleteGroupUpdateWithWhereUniqueWithoutEventInput = {
  where: AthleteGroupWhereUniqueInput
  data: AthleteGroupUpdateWithoutEventDataInput
}

export type AthleteGroupScalarWhereInput = {
  id?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  name?: string | StringFilter | null
  AND?: Enumerable<AthleteGroupScalarWhereInput> | null
  OR?: Enumerable<AthleteGroupScalarWhereInput> | null
  NOT?: Enumerable<AthleteGroupScalarWhereInput> | null
}

export type AthleteGroupUpdateManyDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
}

export type AthleteGroupUpdateManyWithWhereNestedInput = {
  where: AthleteGroupScalarWhereInput
  data: AthleteGroupUpdateManyDataInput
}

export type AthleteGroupUpsertWithWhereUniqueWithoutEventInput = {
  where: AthleteGroupWhereUniqueInput
  update: AthleteGroupUpdateWithoutEventDataInput
  create: AthleteGroupCreateWithoutEventInput
}

export type AthleteGroupUpdateManyWithoutEventInput = {
  create?: Enumerable<AthleteGroupCreateWithoutEventInput> | null
  connect?: Enumerable<AthleteGroupWhereUniqueInput> | null
  set?: Enumerable<AthleteGroupWhereUniqueInput> | null
  disconnect?: Enumerable<AthleteGroupWhereUniqueInput> | null
  delete?: Enumerable<AthleteGroupWhereUniqueInput> | null
  update?: Enumerable<AthleteGroupUpdateWithWhereUniqueWithoutEventInput> | null
  updateMany?: Enumerable<AthleteGroupUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<AthleteGroupScalarWhereInput> | null
  upsert?: Enumerable<AthleteGroupUpsertWithWhereUniqueWithoutEventInput> | null
}

export type EventUpdateWithoutSlotsDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  discipline?: Discipline | null
  contestType?: ContestType | null
  athletes?: AthleteUpdateManyWithoutEventInput | null
  athleteGroups?: AthleteGroupUpdateManyWithoutEventInput | null
  officials?: OfficialUpdateManyWithoutEventInput | null
}

export type EventUpsertWithoutSlotsInput = {
  update: EventUpdateWithoutSlotsDataInput
  create: EventCreateWithoutSlotsInput
}

export type EventUpdateOneRequiredWithoutSlotsInput = {
  create?: EventCreateWithoutSlotsInput | null
  connect?: EventWhereUniqueInput | null
  update?: EventUpdateWithoutSlotsDataInput | null
  upsert?: EventUpsertWithoutSlotsInput | null
}

export type SlotUpdateWithoutOfficialSlotsDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  event?: EventUpdateOneRequiredWithoutSlotsInput | null
  athleteGroups?: AthleteGroupUpdateManyWithoutSlotInput | null
}

export type SlotUpsertWithoutOfficialSlotsInput = {
  update: SlotUpdateWithoutOfficialSlotsDataInput
  create: SlotCreateWithoutOfficialSlotsInput
}

export type SlotUpdateOneRequiredWithoutOfficialSlotsInput = {
  create?: SlotCreateWithoutOfficialSlotsInput | null
  connect?: SlotWhereUniqueInput | null
  update?: SlotUpdateWithoutOfficialSlotsDataInput | null
  upsert?: SlotUpsertWithoutOfficialSlotsInput | null
}

export type OfficialSlotUpdateWithoutOfficialDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  position?: Position | null
  slot?: SlotUpdateOneRequiredWithoutOfficialSlotsInput | null
}

export type OfficialSlotUpdateWithWhereUniqueWithoutOfficialInput = {
  where: OfficialSlotWhereUniqueInput
  data: OfficialSlotUpdateWithoutOfficialDataInput
}

export type OfficialSlotUpsertWithWhereUniqueWithoutOfficialInput = {
  where: OfficialSlotWhereUniqueInput
  update: OfficialSlotUpdateWithoutOfficialDataInput
  create: OfficialSlotCreateWithoutOfficialInput
}

export type OfficialSlotUpdateManyWithoutOfficialInput = {
  create?: Enumerable<OfficialSlotCreateWithoutOfficialInput> | null
  connect?: Enumerable<OfficialSlotWhereUniqueInput> | null
  set?: Enumerable<OfficialSlotWhereUniqueInput> | null
  disconnect?: Enumerable<OfficialSlotWhereUniqueInput> | null
  delete?: Enumerable<OfficialSlotWhereUniqueInput> | null
  update?: Enumerable<OfficialSlotUpdateWithWhereUniqueWithoutOfficialInput> | null
  updateMany?: Enumerable<OfficialSlotUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<OfficialSlotScalarWhereInput> | null
  upsert?: Enumerable<OfficialSlotUpsertWithWhereUniqueWithoutOfficialInput> | null
}

export type OfficialUpdateWithoutEventDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  officalNumber?: number | null
  lastName?: string | null
  firstName?: string | null
  club?: string | null
  license?: string | null
  position?: string | null
  location?: string | null
  importId?: number | null
  officialSlots?: OfficialSlotUpdateManyWithoutOfficialInput | null
}

export type OfficialUpdateWithWhereUniqueWithoutEventInput = {
  where: OfficialWhereUniqueInput
  data: OfficialUpdateWithoutEventDataInput
}

export type OfficialScalarWhereInput = {
  id?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  officalNumber?: number | IntFilter | null
  lastName?: string | StringFilter | null
  firstName?: string | StringFilter | null
  club?: string | StringFilter | null
  license?: string | StringFilter | null
  position?: string | StringFilter | null
  location?: string | StringFilter | null
  importId?: number | IntFilter | null
  officialSlots?: OfficialSlotFilter | null
  AND?: Enumerable<OfficialScalarWhereInput> | null
  OR?: Enumerable<OfficialScalarWhereInput> | null
  NOT?: Enumerable<OfficialScalarWhereInput> | null
}

export type OfficialUpdateManyDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  officalNumber?: number | null
  lastName?: string | null
  firstName?: string | null
  club?: string | null
  license?: string | null
  position?: string | null
  location?: string | null
  importId?: number | null
}

export type OfficialUpdateManyWithWhereNestedInput = {
  where: OfficialScalarWhereInput
  data: OfficialUpdateManyDataInput
}

export type OfficialUpsertWithWhereUniqueWithoutEventInput = {
  where: OfficialWhereUniqueInput
  update: OfficialUpdateWithoutEventDataInput
  create: OfficialCreateWithoutEventInput
}

export type OfficialUpdateManyWithoutEventInput = {
  create?: Enumerable<OfficialCreateWithoutEventInput> | null
  connect?: Enumerable<OfficialWhereUniqueInput> | null
  set?: Enumerable<OfficialWhereUniqueInput> | null
  disconnect?: Enumerable<OfficialWhereUniqueInput> | null
  delete?: Enumerable<OfficialWhereUniqueInput> | null
  update?: Enumerable<OfficialUpdateWithWhereUniqueWithoutEventInput> | null
  updateMany?: Enumerable<OfficialUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<OfficialScalarWhereInput> | null
  upsert?: Enumerable<OfficialUpsertWithWhereUniqueWithoutEventInput> | null
}

export type EventUpdateWithoutAthleteGroupsDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  discipline?: Discipline | null
  contestType?: ContestType | null
  athletes?: AthleteUpdateManyWithoutEventInput | null
  slots?: SlotUpdateManyWithoutEventInput | null
  officials?: OfficialUpdateManyWithoutEventInput | null
}

export type EventUpsertWithoutAthleteGroupsInput = {
  update: EventUpdateWithoutAthleteGroupsDataInput
  create: EventCreateWithoutAthleteGroupsInput
}

export type EventUpdateOneRequiredWithoutAthleteGroupsInput = {
  create?: EventCreateWithoutAthleteGroupsInput | null
  connect?: EventWhereUniqueInput | null
  update?: EventUpdateWithoutAthleteGroupsDataInput | null
  upsert?: EventUpsertWithoutAthleteGroupsInput | null
}

export type AthleteGroupUpdateWithoutSlotDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  event?: EventUpdateOneRequiredWithoutAthleteGroupsInput | null
}

export type AthleteGroupUpdateWithWhereUniqueWithoutSlotInput = {
  where: AthleteGroupWhereUniqueInput
  data: AthleteGroupUpdateWithoutSlotDataInput
}

export type AthleteGroupUpsertWithWhereUniqueWithoutSlotInput = {
  where: AthleteGroupWhereUniqueInput
  update: AthleteGroupUpdateWithoutSlotDataInput
  create: AthleteGroupCreateWithoutSlotInput
}

export type AthleteGroupUpdateManyWithoutSlotInput = {
  create?: Enumerable<AthleteGroupCreateWithoutSlotInput> | null
  connect?: Enumerable<AthleteGroupWhereUniqueInput> | null
  set?: Enumerable<AthleteGroupWhereUniqueInput> | null
  disconnect?: Enumerable<AthleteGroupWhereUniqueInput> | null
  delete?: Enumerable<AthleteGroupWhereUniqueInput> | null
  update?: Enumerable<AthleteGroupUpdateWithWhereUniqueWithoutSlotInput> | null
  updateMany?: Enumerable<AthleteGroupUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<AthleteGroupScalarWhereInput> | null
  upsert?: Enumerable<AthleteGroupUpsertWithWhereUniqueWithoutSlotInput> | null
}

export type SlotUpdateWithoutEventDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  athleteGroups?: AthleteGroupUpdateManyWithoutSlotInput | null
  officialSlots?: OfficialSlotUpdateManyWithoutSlotInput | null
}

export type SlotUpdateWithWhereUniqueWithoutEventInput = {
  where: SlotWhereUniqueInput
  data: SlotUpdateWithoutEventDataInput
}

export type SlotScalarWhereInput = {
  id?: string | UUIDFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  name?: string | StringFilter | null
  athleteGroups?: AthleteGroupFilter | null
  officialSlots?: OfficialSlotFilter | null
  AND?: Enumerable<SlotScalarWhereInput> | null
  OR?: Enumerable<SlotScalarWhereInput> | null
  NOT?: Enumerable<SlotScalarWhereInput> | null
}

export type SlotUpdateManyDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
}

export type SlotUpdateManyWithWhereNestedInput = {
  where: SlotScalarWhereInput
  data: SlotUpdateManyDataInput
}

export type SlotUpsertWithWhereUniqueWithoutEventInput = {
  where: SlotWhereUniqueInput
  update: SlotUpdateWithoutEventDataInput
  create: SlotCreateWithoutEventInput
}

export type SlotUpdateManyWithoutEventInput = {
  create?: Enumerable<SlotCreateWithoutEventInput> | null
  connect?: Enumerable<SlotWhereUniqueInput> | null
  set?: Enumerable<SlotWhereUniqueInput> | null
  disconnect?: Enumerable<SlotWhereUniqueInput> | null
  delete?: Enumerable<SlotWhereUniqueInput> | null
  update?: Enumerable<SlotUpdateWithWhereUniqueWithoutEventInput> | null
  updateMany?: Enumerable<SlotUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<SlotScalarWhereInput> | null
  upsert?: Enumerable<SlotUpsertWithWhereUniqueWithoutEventInput> | null
}

export type EventUpdateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  discipline?: Discipline | null
  contestType?: ContestType | null
  athletes?: AthleteUpdateManyWithoutEventInput | null
  slots?: SlotUpdateManyWithoutEventInput | null
  athleteGroups?: AthleteGroupUpdateManyWithoutEventInput | null
  officials?: OfficialUpdateManyWithoutEventInput | null
}

export type EventUpdateManyMutationInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  discipline?: Discipline | null
  contestType?: ContestType | null
}

export type EventCreateWithoutAthletesInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name: string
  discipline: Discipline
  contestType: ContestType
  slots?: SlotCreateManyWithoutEventInput | null
  athleteGroups?: AthleteGroupCreateManyWithoutEventInput | null
  officials?: OfficialCreateManyWithoutEventInput | null
}

export type EventCreateOneWithoutAthletesInput = {
  create?: EventCreateWithoutAthletesInput | null
  connect?: EventWhereUniqueInput | null
}

export type AthleteCreateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  raw: boolean
  athleteNumber: number
  firstName: string
  lastName: string
  gender: Gender
  club: string
  birthday: Date | string
  total: number
  norm: boolean
  lateRegistration: boolean
  price: number
  bodyWeight: number
  wilks: number
  dots: number
  los: number
  KB1: number
  KB2: number
  KB3: number
  BD1: number
  BD2: number
  BD3: number
  KH1: number
  KH2: number
  KH3: number
  points: number
  place: number
  location: string
  nextAttemptsSortKeys: string
  importId: number
  resultClassId: string
  event: EventCreateOneWithoutAthletesInput
  weightClass: WeightClassCreateOneWithoutAthletesInput
  ageClass: AgeClassCreateOneWithoutAthletesInput
  attempts?: AttemptCreateManyWithoutAthleteInput | null
}

export type EventUpdateWithoutAthletesDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  discipline?: Discipline | null
  contestType?: ContestType | null
  slots?: SlotUpdateManyWithoutEventInput | null
  athleteGroups?: AthleteGroupUpdateManyWithoutEventInput | null
  officials?: OfficialUpdateManyWithoutEventInput | null
}

export type EventUpsertWithoutAthletesInput = {
  update: EventUpdateWithoutAthletesDataInput
  create: EventCreateWithoutAthletesInput
}

export type EventUpdateOneRequiredWithoutAthletesInput = {
  create?: EventCreateWithoutAthletesInput | null
  connect?: EventWhereUniqueInput | null
  update?: EventUpdateWithoutAthletesDataInput | null
  upsert?: EventUpsertWithoutAthletesInput | null
}

export type AthleteUpdateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  raw?: boolean | null
  athleteNumber?: number | null
  firstName?: string | null
  lastName?: string | null
  gender?: Gender | null
  club?: string | null
  birthday?: Date | string | null
  total?: number | null
  norm?: boolean | null
  lateRegistration?: boolean | null
  price?: number | null
  bodyWeight?: number | null
  wilks?: number | null
  dots?: number | null
  los?: number | null
  KB1?: number | null
  KB2?: number | null
  KB3?: number | null
  BD1?: number | null
  BD2?: number | null
  BD3?: number | null
  KH1?: number | null
  KH2?: number | null
  KH3?: number | null
  points?: number | null
  place?: number | null
  location?: string | null
  nextAttemptsSortKeys?: string | null
  importId?: number | null
  resultClassId?: string | null
  event?: EventUpdateOneRequiredWithoutAthletesInput | null
  weightClass?: WeightClassUpdateOneRequiredWithoutAthletesInput | null
  ageClass?: AgeClassUpdateOneRequiredWithoutAthletesInput | null
  attempts?: AttemptUpdateManyWithoutAthleteInput | null
}

export type AthleteUpdateManyMutationInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  raw?: boolean | null
  athleteNumber?: number | null
  firstName?: string | null
  lastName?: string | null
  gender?: Gender | null
  club?: string | null
  birthday?: Date | string | null
  total?: number | null
  norm?: boolean | null
  lateRegistration?: boolean | null
  price?: number | null
  bodyWeight?: number | null
  wilks?: number | null
  dots?: number | null
  los?: number | null
  KB1?: number | null
  KB2?: number | null
  KB3?: number | null
  BD1?: number | null
  BD2?: number | null
  BD3?: number | null
  KH1?: number | null
  KH2?: number | null
  KH3?: number | null
  points?: number | null
  place?: number | null
  location?: string | null
  nextAttemptsSortKeys?: string | null
  importId?: number | null
  resultClassId?: string | null
}

export type SlotCreateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name: string
  event: EventCreateOneWithoutSlotsInput
  athleteGroups?: AthleteGroupCreateManyWithoutSlotInput | null
  officialSlots?: OfficialSlotCreateManyWithoutSlotInput | null
}

export type SlotUpdateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  event?: EventUpdateOneRequiredWithoutSlotsInput | null
  athleteGroups?: AthleteGroupUpdateManyWithoutSlotInput | null
  officialSlots?: OfficialSlotUpdateManyWithoutSlotInput | null
}

export type SlotUpdateManyMutationInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
}

export type AthleteGroupCreateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name: string
  event: EventCreateOneWithoutAthleteGroupsInput
  slot: SlotCreateOneWithoutAthleteGroupsInput
}

export type AthleteGroupUpdateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  event?: EventUpdateOneRequiredWithoutAthleteGroupsInput | null
  slot?: SlotUpdateOneRequiredWithoutAthleteGroupsInput | null
}

export type AthleteGroupUpdateManyMutationInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
}

export type AthleteCreateWithoutAttemptsInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  raw: boolean
  athleteNumber: number
  firstName: string
  lastName: string
  gender: Gender
  club: string
  birthday: Date | string
  total: number
  norm: boolean
  lateRegistration: boolean
  price: number
  bodyWeight: number
  wilks: number
  dots: number
  los: number
  KB1: number
  KB2: number
  KB3: number
  BD1: number
  BD2: number
  BD3: number
  KH1: number
  KH2: number
  KH3: number
  points: number
  place: number
  location: string
  nextAttemptsSortKeys: string
  importId: number
  resultClassId: string
  event: EventCreateOneWithoutAthletesInput
  weightClass: WeightClassCreateOneWithoutAthletesInput
  ageClass: AgeClassCreateOneWithoutAthletesInput
}

export type AthleteCreateOneWithoutAttemptsInput = {
  create?: AthleteCreateWithoutAttemptsInput | null
  connect?: AthleteWhereUniqueInput | null
}

export type AttemptCreateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  discipline: Discipline
  date: Date | string
  index: number
  weight: number
  raw: boolean
  valid: boolean
  done: boolean
  resign: boolean
  athlete: AthleteCreateOneWithoutAttemptsInput
}

export type AthleteUpdateWithoutAttemptsDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  raw?: boolean | null
  athleteNumber?: number | null
  firstName?: string | null
  lastName?: string | null
  gender?: Gender | null
  club?: string | null
  birthday?: Date | string | null
  total?: number | null
  norm?: boolean | null
  lateRegistration?: boolean | null
  price?: number | null
  bodyWeight?: number | null
  wilks?: number | null
  dots?: number | null
  los?: number | null
  KB1?: number | null
  KB2?: number | null
  KB3?: number | null
  BD1?: number | null
  BD2?: number | null
  BD3?: number | null
  KH1?: number | null
  KH2?: number | null
  KH3?: number | null
  points?: number | null
  place?: number | null
  location?: string | null
  nextAttemptsSortKeys?: string | null
  importId?: number | null
  resultClassId?: string | null
  event?: EventUpdateOneRequiredWithoutAthletesInput | null
  weightClass?: WeightClassUpdateOneRequiredWithoutAthletesInput | null
  ageClass?: AgeClassUpdateOneRequiredWithoutAthletesInput | null
}

export type AthleteUpsertWithoutAttemptsInput = {
  update: AthleteUpdateWithoutAttemptsDataInput
  create: AthleteCreateWithoutAttemptsInput
}

export type AthleteUpdateOneRequiredWithoutAttemptsInput = {
  create?: AthleteCreateWithoutAttemptsInput | null
  connect?: AthleteWhereUniqueInput | null
  update?: AthleteUpdateWithoutAttemptsDataInput | null
  upsert?: AthleteUpsertWithoutAttemptsInput | null
}

export type AttemptUpdateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  discipline?: Discipline | null
  date?: Date | string | null
  index?: number | null
  weight?: number | null
  raw?: boolean | null
  valid?: boolean | null
  done?: boolean | null
  resign?: boolean | null
  athlete?: AthleteUpdateOneRequiredWithoutAttemptsInput | null
}

export type AttemptUpdateManyMutationInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  discipline?: Discipline | null
  date?: Date | string | null
  index?: number | null
  weight?: number | null
  raw?: boolean | null
  valid?: boolean | null
  done?: boolean | null
  resign?: boolean | null
}

export type AthleteCreateWithoutWeightClassInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  raw: boolean
  athleteNumber: number
  firstName: string
  lastName: string
  gender: Gender
  club: string
  birthday: Date | string
  total: number
  norm: boolean
  lateRegistration: boolean
  price: number
  bodyWeight: number
  wilks: number
  dots: number
  los: number
  KB1: number
  KB2: number
  KB3: number
  BD1: number
  BD2: number
  BD3: number
  KH1: number
  KH2: number
  KH3: number
  points: number
  place: number
  location: string
  nextAttemptsSortKeys: string
  importId: number
  resultClassId: string
  event: EventCreateOneWithoutAthletesInput
  ageClass: AgeClassCreateOneWithoutAthletesInput
  attempts?: AttemptCreateManyWithoutAthleteInput | null
}

export type AthleteCreateManyWithoutWeightClassInput = {
  create?: Enumerable<AthleteCreateWithoutWeightClassInput> | null
  connect?: Enumerable<AthleteWhereUniqueInput> | null
}

export type WeightClassCreateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name: string
  gender: Gender
  min: number
  max: number
  athletes?: AthleteCreateManyWithoutWeightClassInput | null
}

export type AthleteUpdateWithoutWeightClassDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  raw?: boolean | null
  athleteNumber?: number | null
  firstName?: string | null
  lastName?: string | null
  gender?: Gender | null
  club?: string | null
  birthday?: Date | string | null
  total?: number | null
  norm?: boolean | null
  lateRegistration?: boolean | null
  price?: number | null
  bodyWeight?: number | null
  wilks?: number | null
  dots?: number | null
  los?: number | null
  KB1?: number | null
  KB2?: number | null
  KB3?: number | null
  BD1?: number | null
  BD2?: number | null
  BD3?: number | null
  KH1?: number | null
  KH2?: number | null
  KH3?: number | null
  points?: number | null
  place?: number | null
  location?: string | null
  nextAttemptsSortKeys?: string | null
  importId?: number | null
  resultClassId?: string | null
  event?: EventUpdateOneRequiredWithoutAthletesInput | null
  ageClass?: AgeClassUpdateOneRequiredWithoutAthletesInput | null
  attempts?: AttemptUpdateManyWithoutAthleteInput | null
}

export type AthleteUpdateWithWhereUniqueWithoutWeightClassInput = {
  where: AthleteWhereUniqueInput
  data: AthleteUpdateWithoutWeightClassDataInput
}

export type AthleteUpsertWithWhereUniqueWithoutWeightClassInput = {
  where: AthleteWhereUniqueInput
  update: AthleteUpdateWithoutWeightClassDataInput
  create: AthleteCreateWithoutWeightClassInput
}

export type AthleteUpdateManyWithoutWeightClassInput = {
  create?: Enumerable<AthleteCreateWithoutWeightClassInput> | null
  connect?: Enumerable<AthleteWhereUniqueInput> | null
  set?: Enumerable<AthleteWhereUniqueInput> | null
  disconnect?: Enumerable<AthleteWhereUniqueInput> | null
  delete?: Enumerable<AthleteWhereUniqueInput> | null
  update?: Enumerable<AthleteUpdateWithWhereUniqueWithoutWeightClassInput> | null
  updateMany?: Enumerable<AthleteUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<AthleteScalarWhereInput> | null
  upsert?: Enumerable<AthleteUpsertWithWhereUniqueWithoutWeightClassInput> | null
}

export type WeightClassUpdateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  gender?: Gender | null
  min?: number | null
  max?: number | null
  athletes?: AthleteUpdateManyWithoutWeightClassInput | null
}

export type WeightClassUpdateManyMutationInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  gender?: Gender | null
  min?: number | null
  max?: number | null
}

export type AthleteCreateWithoutAgeClassInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  raw: boolean
  athleteNumber: number
  firstName: string
  lastName: string
  gender: Gender
  club: string
  birthday: Date | string
  total: number
  norm: boolean
  lateRegistration: boolean
  price: number
  bodyWeight: number
  wilks: number
  dots: number
  los: number
  KB1: number
  KB2: number
  KB3: number
  BD1: number
  BD2: number
  BD3: number
  KH1: number
  KH2: number
  KH3: number
  points: number
  place: number
  location: string
  nextAttemptsSortKeys: string
  importId: number
  resultClassId: string
  event: EventCreateOneWithoutAthletesInput
  weightClass: WeightClassCreateOneWithoutAthletesInput
  attempts?: AttemptCreateManyWithoutAthleteInput | null
}

export type AthleteCreateManyWithoutAgeClassInput = {
  create?: Enumerable<AthleteCreateWithoutAgeClassInput> | null
  connect?: Enumerable<AthleteWhereUniqueInput> | null
}

export type AgeClassCreateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name: string
  sortId: number
  athletes?: AthleteCreateManyWithoutAgeClassInput | null
}

export type AthleteUpdateWithoutAgeClassDataInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  raw?: boolean | null
  athleteNumber?: number | null
  firstName?: string | null
  lastName?: string | null
  gender?: Gender | null
  club?: string | null
  birthday?: Date | string | null
  total?: number | null
  norm?: boolean | null
  lateRegistration?: boolean | null
  price?: number | null
  bodyWeight?: number | null
  wilks?: number | null
  dots?: number | null
  los?: number | null
  KB1?: number | null
  KB2?: number | null
  KB3?: number | null
  BD1?: number | null
  BD2?: number | null
  BD3?: number | null
  KH1?: number | null
  KH2?: number | null
  KH3?: number | null
  points?: number | null
  place?: number | null
  location?: string | null
  nextAttemptsSortKeys?: string | null
  importId?: number | null
  resultClassId?: string | null
  event?: EventUpdateOneRequiredWithoutAthletesInput | null
  weightClass?: WeightClassUpdateOneRequiredWithoutAthletesInput | null
  attempts?: AttemptUpdateManyWithoutAthleteInput | null
}

export type AthleteUpdateWithWhereUniqueWithoutAgeClassInput = {
  where: AthleteWhereUniqueInput
  data: AthleteUpdateWithoutAgeClassDataInput
}

export type AthleteUpsertWithWhereUniqueWithoutAgeClassInput = {
  where: AthleteWhereUniqueInput
  update: AthleteUpdateWithoutAgeClassDataInput
  create: AthleteCreateWithoutAgeClassInput
}

export type AthleteUpdateManyWithoutAgeClassInput = {
  create?: Enumerable<AthleteCreateWithoutAgeClassInput> | null
  connect?: Enumerable<AthleteWhereUniqueInput> | null
  set?: Enumerable<AthleteWhereUniqueInput> | null
  disconnect?: Enumerable<AthleteWhereUniqueInput> | null
  delete?: Enumerable<AthleteWhereUniqueInput> | null
  update?: Enumerable<AthleteUpdateWithWhereUniqueWithoutAgeClassInput> | null
  updateMany?: Enumerable<AthleteUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<AthleteScalarWhereInput> | null
  upsert?: Enumerable<AthleteUpsertWithWhereUniqueWithoutAgeClassInput> | null
}

export type AgeClassUpdateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  sortId?: number | null
  athletes?: AthleteUpdateManyWithoutAgeClassInput | null
}

export type AgeClassUpdateManyMutationInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  sortId?: number | null
}

export type OfficialCreateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  officalNumber: number
  lastName: string
  firstName: string
  club: string
  license: string
  position: string
  location: string
  importId: number
  event: EventCreateOneWithoutOfficialsInput
  officialSlots?: OfficialSlotCreateManyWithoutOfficialInput | null
}

export type OfficialUpdateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  officalNumber?: number | null
  lastName?: string | null
  firstName?: string | null
  club?: string | null
  license?: string | null
  position?: string | null
  location?: string | null
  importId?: number | null
  event?: EventUpdateOneRequiredWithoutOfficialsInput | null
  officialSlots?: OfficialSlotUpdateManyWithoutOfficialInput | null
}

export type OfficialUpdateManyMutationInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  officalNumber?: number | null
  lastName?: string | null
  firstName?: string | null
  club?: string | null
  license?: string | null
  position?: string | null
  location?: string | null
  importId?: number | null
}

export type OfficialSlotCreateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  position: Position
  official: OfficialCreateOneWithoutOfficialSlotsInput
  slot: SlotCreateOneWithoutOfficialSlotsInput
}

export type OfficialSlotUpdateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  position?: Position | null
  official?: OfficialUpdateOneRequiredWithoutOfficialSlotsInput | null
  slot?: SlotUpdateOneRequiredWithoutOfficialSlotsInput | null
}

export type OfficialSlotUpdateManyMutationInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  position?: Position | null
}

export type UserCreateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  role?: Role | null
  username: string
  passwordHash: string
  salt: string
}

export type UserUpdateInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  role?: Role | null
  username?: string | null
  passwordHash?: string | null
  salt?: string | null
}

export type UserUpdateManyMutationInput = {
  id?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  role?: Role | null
  username?: string | null
  passwordHash?: string | null
  salt?: string | null
}

export type UUIDFilter = {
  equals?: string | null
  not?: string | UUIDFilter | null
  in?: Enumerable<string> | null
  notIn?: Enumerable<string> | null
  lt?: string | null
  lte?: string | null
  gt?: string | null
  gte?: string | null
  contains?: string | null
  startsWith?: string | null
  endsWith?: string | null
}

export type DateTimeFilter = {
  equals?: Date | string | null
  not?: Date | string | DateTimeFilter | null
  in?: Enumerable<Date | string> | null
  notIn?: Enumerable<Date | string> | null
  lt?: Date | string | null
  lte?: Date | string | null
  gt?: Date | string | null
  gte?: Date | string | null
}

export type StringFilter = {
  equals?: string | null
  not?: string | StringFilter | null
  in?: Enumerable<string> | null
  notIn?: Enumerable<string> | null
  lt?: string | null
  lte?: string | null
  gt?: string | null
  gte?: string | null
  contains?: string | null
  startsWith?: string | null
  endsWith?: string | null
}

export type GenderFilter = {
  equals?: Gender | null
  not?: Gender | GenderFilter | null
  in?: Enumerable<Gender> | null
  notIn?: Enumerable<Gender> | null
}

export type FloatFilter = {
  equals?: number | null
  not?: number | FloatFilter | null
  in?: Enumerable<number> | null
  notIn?: Enumerable<number> | null
  lt?: number | null
  lte?: number | null
  gt?: number | null
  gte?: number | null
}

export type IntFilter = {
  equals?: number | null
  not?: number | IntFilter | null
  in?: Enumerable<number> | null
  notIn?: Enumerable<number> | null
  lt?: number | null
  lte?: number | null
  gt?: number | null
  gte?: number | null
}

export type AthleteFilter = {
  every?: AthleteWhereInput | null
  some?: AthleteWhereInput | null
  none?: AthleteWhereInput | null
}

export type DisciplineFilter = {
  equals?: Discipline | null
  not?: Discipline | DisciplineFilter | null
  in?: Enumerable<Discipline> | null
  notIn?: Enumerable<Discipline> | null
}

export type BooleanFilter = {
  equals?: boolean | null
  not?: boolean | BooleanFilter | null
}

export type AttemptFilter = {
  every?: AttemptWhereInput | null
  some?: AttemptWhereInput | null
  none?: AttemptWhereInput | null
}

export type OfficialSlotFilter = {
  every?: OfficialSlotWhereInput | null
  some?: OfficialSlotWhereInput | null
  none?: OfficialSlotWhereInput | null
}

export type PositionFilter = {
  equals?: Position | null
  not?: Position | PositionFilter | null
  in?: Enumerable<Position> | null
  notIn?: Enumerable<Position> | null
}

export type AthleteGroupFilter = {
  every?: AthleteGroupWhereInput | null
  some?: AthleteGroupWhereInput | null
  none?: AthleteGroupWhereInput | null
}

export type ContestTypeFilter = {
  equals?: ContestType | null
  not?: ContestType | ContestTypeFilter | null
  in?: Enumerable<ContestType> | null
  notIn?: Enumerable<ContestType> | null
}

export type SlotFilter = {
  every?: SlotWhereInput | null
  some?: SlotWhereInput | null
  none?: SlotWhereInput | null
}

export type OfficialFilter = {
  every?: OfficialWhereInput | null
  some?: OfficialWhereInput | null
  none?: OfficialWhereInput | null
}

export type RoleFilter = {
  equals?: Role | null
  not?: Role | RoleFilter | null
  in?: Enumerable<Role> | null
  notIn?: Enumerable<Role> | null
}

export type EventOrderByInput = {
  id?: OrderByArg | null
  createdAt?: OrderByArg | null
  updatedAt?: OrderByArg | null
  name?: OrderByArg | null
  discipline?: OrderByArg | null
  contestType?: OrderByArg | null
}

export type AthleteOrderByInput = {
  id?: OrderByArg | null
  createdAt?: OrderByArg | null
  updatedAt?: OrderByArg | null
  raw?: OrderByArg | null
  athleteNumber?: OrderByArg | null
  firstName?: OrderByArg | null
  lastName?: OrderByArg | null
  gender?: OrderByArg | null
  club?: OrderByArg | null
  birthday?: OrderByArg | null
  total?: OrderByArg | null
  norm?: OrderByArg | null
  lateRegistration?: OrderByArg | null
  price?: OrderByArg | null
  bodyWeight?: OrderByArg | null
  wilks?: OrderByArg | null
  dots?: OrderByArg | null
  los?: OrderByArg | null
  KB1?: OrderByArg | null
  KB2?: OrderByArg | null
  KB3?: OrderByArg | null
  BD1?: OrderByArg | null
  BD2?: OrderByArg | null
  BD3?: OrderByArg | null
  KH1?: OrderByArg | null
  KH2?: OrderByArg | null
  KH3?: OrderByArg | null
  points?: OrderByArg | null
  place?: OrderByArg | null
  location?: OrderByArg | null
  nextAttemptsSortKeys?: OrderByArg | null
  importId?: OrderByArg | null
  resultClassId?: OrderByArg | null
}

export type AttemptOrderByInput = {
  id?: OrderByArg | null
  createdAt?: OrderByArg | null
  updatedAt?: OrderByArg | null
  discipline?: OrderByArg | null
  date?: OrderByArg | null
  index?: OrderByArg | null
  weight?: OrderByArg | null
  raw?: OrderByArg | null
  valid?: OrderByArg | null
  done?: OrderByArg | null
  resign?: OrderByArg | null
}

export type SlotOrderByInput = {
  id?: OrderByArg | null
  createdAt?: OrderByArg | null
  updatedAt?: OrderByArg | null
  name?: OrderByArg | null
}

export type AthleteGroupOrderByInput = {
  id?: OrderByArg | null
  createdAt?: OrderByArg | null
  updatedAt?: OrderByArg | null
  name?: OrderByArg | null
}

export type OfficialSlotOrderByInput = {
  id?: OrderByArg | null
  createdAt?: OrderByArg | null
  updatedAt?: OrderByArg | null
  position?: OrderByArg | null
}

export type OfficialOrderByInput = {
  id?: OrderByArg | null
  createdAt?: OrderByArg | null
  updatedAt?: OrderByArg | null
  officalNumber?: OrderByArg | null
  lastName?: OrderByArg | null
  firstName?: OrderByArg | null
  club?: OrderByArg | null
  license?: OrderByArg | null
  position?: OrderByArg | null
  location?: OrderByArg | null
  importId?: OrderByArg | null
}

export type WeightClassOrderByInput = {
  id?: OrderByArg | null
  createdAt?: OrderByArg | null
  updatedAt?: OrderByArg | null
  name?: OrderByArg | null
  gender?: OrderByArg | null
  min?: OrderByArg | null
  max?: OrderByArg | null
}

export type AgeClassOrderByInput = {
  id?: OrderByArg | null
  createdAt?: OrderByArg | null
  updatedAt?: OrderByArg | null
  name?: OrderByArg | null
  sortId?: OrderByArg | null
}

export type UserOrderByInput = {
  id?: OrderByArg | null
  createdAt?: OrderByArg | null
  updatedAt?: OrderByArg | null
  role?: OrderByArg | null
  username?: OrderByArg | null
  passwordHash?: OrderByArg | null
  salt?: OrderByArg | null
}

/**
 * Batch Payload for updateMany & deleteMany
 */

export type BatchPayload = {
  count: number
}

/**
 * DMMF
 */
export declare const dmmf: DMMF.Document;
export {};
