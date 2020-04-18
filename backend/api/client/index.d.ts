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

declare type SelectAndInclude = {
  select: any
  include: any
}

declare type HasSelect = {
  select: any
}

declare type HasInclude = {
  include: any
}


declare type CheckSelect<T, S, U> = T extends SelectAndInclude
  ? 'Please either choose `select` or `include`'
  : T extends HasSelect
  ? U
  : T extends HasInclude
  ? U
  : S

/**
 * Get the type of the value, that the Promise holds.
 */
export declare type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

/**
 * Get the return type of a function which returns a Promise.
 */
export declare type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>


export declare type Enumerable<T> = T | Array<T>;

export declare type TrueKeys<T> = {
  [key in keyof T]: T[key] extends false | undefined | null ? never : key
}[keyof T]

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

  /**
   * Useful for pgbouncer
   */
  forceTransactions?: boolean
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

export declare type Version = {
  client: string
}

export declare const version: Version 

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
   * 
   * // With parameters use prisma.raw``, values will be escaped automatically
   * const userId = '1'
   * const result = await prisma.raw`SELECT * FROM User WHERE id = ${userId};`
  * ```
  * 
  * Read more in our [docs](https://github.com/prisma/prisma2/blob/master/docs/prisma-client-js/api.md#raw-database-access).
  */
  raw<T = any>(query: string | TemplateStringsArray, ...values: any[]): Promise<T>;

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

export type EventSelect = {
  id?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  name?: boolean
  discipline?: boolean
  contestType?: boolean
  athletes?: boolean | FindManyAthleteArgs
  slots?: boolean | FindManySlotArgs
  athleteGroups?: boolean | FindManyAthleteGroupArgs
  officials?: boolean | FindManyOfficialArgs
}

export type EventInclude = {
  athletes?: boolean | FindManyAthleteArgs
  slots?: boolean | FindManySlotArgs
  athleteGroups?: boolean | FindManyAthleteGroupArgs
  officials?: boolean | FindManyOfficialArgs
}

export type EventGetPayload<
  S extends boolean | null | undefined | EventArgs,
  U = keyof S
> = S extends true
  ? Event
  : S extends undefined
  ? never
  : S extends EventArgs
  ? 'include' extends U
    ? Event  & {
      [P in TrueKeys<S['include']>]:
      P extends 'athletes'
      ? Array<AthleteGetPayload<S['include'][P]>> :
      P extends 'slots'
      ? Array<SlotGetPayload<S['include'][P]>> :
      P extends 'athleteGroups'
      ? Array<AthleteGroupGetPayload<S['include'][P]>> :
      P extends 'officials'
      ? Array<OfficialGetPayload<S['include'][P]>> : never
    }
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof Event ? Event[P]
: 
      P extends 'athletes'
      ? Array<AthleteGetPayload<S['select'][P]>> :
      P extends 'slots'
      ? Array<SlotGetPayload<S['select'][P]>> :
      P extends 'athleteGroups'
      ? Array<AthleteGroupGetPayload<S['select'][P]>> :
      P extends 'officials'
      ? Array<OfficialGetPayload<S['select'][P]>> : never
    }
  : Event
: Event


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
  ): CheckSelect<T, EventClient<Event | null>, EventClient<EventGetPayload<T> | null>>
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
  ): CheckSelect<T, Promise<Array<Event>>, Promise<Array<EventGetPayload<T>>>>
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
  ): CheckSelect<T, EventClient<Event>, EventClient<EventGetPayload<T>>>
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
  ): CheckSelect<T, EventClient<Event>, EventClient<EventGetPayload<T>>>
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
  ): CheckSelect<T, EventClient<Event>, EventClient<EventGetPayload<T>>>
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
  ): CheckSelect<T, EventClient<Event>, EventClient<EventGetPayload<T>>>
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

  athletes<T extends FindManyAthleteArgs = {}>(args?: Subset<T, FindManyAthleteArgs>): CheckSelect<T, Promise<Array<Athlete>>, Promise<Array<AthleteGetPayload<T>>>>;

  slots<T extends FindManySlotArgs = {}>(args?: Subset<T, FindManySlotArgs>): CheckSelect<T, Promise<Array<Slot>>, Promise<Array<SlotGetPayload<T>>>>;

  athleteGroups<T extends FindManyAthleteGroupArgs = {}>(args?: Subset<T, FindManyAthleteGroupArgs>): CheckSelect<T, Promise<Array<AthleteGroup>>, Promise<Array<AthleteGroupGetPayload<T>>>>;

  officials<T extends FindManyOfficialArgs = {}>(args?: Subset<T, FindManyOfficialArgs>): CheckSelect<T, Promise<Array<Official>>, Promise<Array<OfficialGetPayload<T>>>>;

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
  eventId: string
  weightClassId: string
  ageClassId: string
  resultClassId: string
}

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
  event?: boolean | EventArgs
  eventId?: boolean
  weightClass?: boolean | WeightClassArgs
  weightClassId?: boolean
  ageClass?: boolean | AgeClassArgs
  ageClassId?: boolean
  resultClassId?: boolean
  attempts?: boolean | FindManyAttemptArgs
}

export type AthleteInclude = {
  event?: boolean | EventArgs
  weightClass?: boolean | WeightClassArgs
  ageClass?: boolean | AgeClassArgs
  attempts?: boolean | FindManyAttemptArgs
}

export type AthleteGetPayload<
  S extends boolean | null | undefined | AthleteArgs,
  U = keyof S
> = S extends true
  ? Athlete
  : S extends undefined
  ? never
  : S extends AthleteArgs
  ? 'include' extends U
    ? Athlete  & {
      [P in TrueKeys<S['include']>]:
      P extends 'event'
      ? EventGetPayload<S['include'][P]> :
      P extends 'weightClass'
      ? WeightClassGetPayload<S['include'][P]> :
      P extends 'ageClass'
      ? AgeClassGetPayload<S['include'][P]> :
      P extends 'attempts'
      ? Array<AttemptGetPayload<S['include'][P]>> : never
    }
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof Athlete ? Athlete[P]
: 
      P extends 'event'
      ? EventGetPayload<S['select'][P]> :
      P extends 'weightClass'
      ? WeightClassGetPayload<S['select'][P]> :
      P extends 'ageClass'
      ? AgeClassGetPayload<S['select'][P]> :
      P extends 'attempts'
      ? Array<AttemptGetPayload<S['select'][P]>> : never
    }
  : Athlete
: Athlete


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
  ): CheckSelect<T, AthleteClient<Athlete | null>, AthleteClient<AthleteGetPayload<T> | null>>
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
  ): CheckSelect<T, Promise<Array<Athlete>>, Promise<Array<AthleteGetPayload<T>>>>
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
  ): CheckSelect<T, AthleteClient<Athlete>, AthleteClient<AthleteGetPayload<T>>>
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
  ): CheckSelect<T, AthleteClient<Athlete>, AthleteClient<AthleteGetPayload<T>>>
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
  ): CheckSelect<T, AthleteClient<Athlete>, AthleteClient<AthleteGetPayload<T>>>
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
  ): CheckSelect<T, AthleteClient<Athlete>, AthleteClient<AthleteGetPayload<T>>>
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

  event<T extends EventArgs = {}>(args?: Subset<T, EventArgs>): CheckSelect<T, EventClient<Event | null>, EventClient<EventGetPayload<T> | null>>;

  weightClass<T extends WeightClassArgs = {}>(args?: Subset<T, WeightClassArgs>): CheckSelect<T, WeightClassClient<WeightClass | null>, WeightClassClient<WeightClassGetPayload<T> | null>>;

  ageClass<T extends AgeClassArgs = {}>(args?: Subset<T, AgeClassArgs>): CheckSelect<T, AgeClassClient<AgeClass | null>, AgeClassClient<AgeClassGetPayload<T> | null>>;

  attempts<T extends FindManyAttemptArgs = {}>(args?: Subset<T, FindManyAttemptArgs>): CheckSelect<T, Promise<Array<Attempt>>, Promise<Array<AttemptGetPayload<T>>>>;

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



/**
 * Model Slot
 */

export type Slot = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  eventId: string
}

export type SlotSelect = {
  id?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  name?: boolean
  event?: boolean | EventArgs
  eventId?: boolean
  athleteGroups?: boolean | FindManyAthleteGroupArgs
  officialSlots?: boolean | FindManyOfficialSlotArgs
}

export type SlotInclude = {
  event?: boolean | EventArgs
  athleteGroups?: boolean | FindManyAthleteGroupArgs
  officialSlots?: boolean | FindManyOfficialSlotArgs
}

export type SlotGetPayload<
  S extends boolean | null | undefined | SlotArgs,
  U = keyof S
> = S extends true
  ? Slot
  : S extends undefined
  ? never
  : S extends SlotArgs
  ? 'include' extends U
    ? Slot  & {
      [P in TrueKeys<S['include']>]:
      P extends 'event'
      ? EventGetPayload<S['include'][P]> :
      P extends 'athleteGroups'
      ? Array<AthleteGroupGetPayload<S['include'][P]>> :
      P extends 'officialSlots'
      ? Array<OfficialSlotGetPayload<S['include'][P]>> : never
    }
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof Slot ? Slot[P]
: 
      P extends 'event'
      ? EventGetPayload<S['select'][P]> :
      P extends 'athleteGroups'
      ? Array<AthleteGroupGetPayload<S['select'][P]>> :
      P extends 'officialSlots'
      ? Array<OfficialSlotGetPayload<S['select'][P]>> : never
    }
  : Slot
: Slot


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
  ): CheckSelect<T, SlotClient<Slot | null>, SlotClient<SlotGetPayload<T> | null>>
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
  ): CheckSelect<T, Promise<Array<Slot>>, Promise<Array<SlotGetPayload<T>>>>
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
  ): CheckSelect<T, SlotClient<Slot>, SlotClient<SlotGetPayload<T>>>
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
  ): CheckSelect<T, SlotClient<Slot>, SlotClient<SlotGetPayload<T>>>
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
  ): CheckSelect<T, SlotClient<Slot>, SlotClient<SlotGetPayload<T>>>
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
  ): CheckSelect<T, SlotClient<Slot>, SlotClient<SlotGetPayload<T>>>
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

  event<T extends EventArgs = {}>(args?: Subset<T, EventArgs>): CheckSelect<T, EventClient<Event | null>, EventClient<EventGetPayload<T> | null>>;

  athleteGroups<T extends FindManyAthleteGroupArgs = {}>(args?: Subset<T, FindManyAthleteGroupArgs>): CheckSelect<T, Promise<Array<AthleteGroup>>, Promise<Array<AthleteGroupGetPayload<T>>>>;

  officialSlots<T extends FindManyOfficialSlotArgs = {}>(args?: Subset<T, FindManyOfficialSlotArgs>): CheckSelect<T, Promise<Array<OfficialSlot>>, Promise<Array<OfficialSlotGetPayload<T>>>>;

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



/**
 * Model AthleteGroup
 */

export type AthleteGroup = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  eventId: string
  slotId: string
}

export type AthleteGroupSelect = {
  id?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  name?: boolean
  event?: boolean | EventArgs
  eventId?: boolean
  slot?: boolean | SlotArgs
  slotId?: boolean
}

export type AthleteGroupInclude = {
  event?: boolean | EventArgs
  slot?: boolean | SlotArgs
}

export type AthleteGroupGetPayload<
  S extends boolean | null | undefined | AthleteGroupArgs,
  U = keyof S
> = S extends true
  ? AthleteGroup
  : S extends undefined
  ? never
  : S extends AthleteGroupArgs
  ? 'include' extends U
    ? AthleteGroup  & {
      [P in TrueKeys<S['include']>]:
      P extends 'event'
      ? EventGetPayload<S['include'][P]> :
      P extends 'slot'
      ? SlotGetPayload<S['include'][P]> : never
    }
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof AthleteGroup ? AthleteGroup[P]
: 
      P extends 'event'
      ? EventGetPayload<S['select'][P]> :
      P extends 'slot'
      ? SlotGetPayload<S['select'][P]> : never
    }
  : AthleteGroup
: AthleteGroup


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
  ): CheckSelect<T, AthleteGroupClient<AthleteGroup | null>, AthleteGroupClient<AthleteGroupGetPayload<T> | null>>
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
  ): CheckSelect<T, Promise<Array<AthleteGroup>>, Promise<Array<AthleteGroupGetPayload<T>>>>
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
  ): CheckSelect<T, AthleteGroupClient<AthleteGroup>, AthleteGroupClient<AthleteGroupGetPayload<T>>>
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
  ): CheckSelect<T, AthleteGroupClient<AthleteGroup>, AthleteGroupClient<AthleteGroupGetPayload<T>>>
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
  ): CheckSelect<T, AthleteGroupClient<AthleteGroup>, AthleteGroupClient<AthleteGroupGetPayload<T>>>
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
  ): CheckSelect<T, AthleteGroupClient<AthleteGroup>, AthleteGroupClient<AthleteGroupGetPayload<T>>>
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

  event<T extends EventArgs = {}>(args?: Subset<T, EventArgs>): CheckSelect<T, EventClient<Event | null>, EventClient<EventGetPayload<T> | null>>;

  slot<T extends SlotArgs = {}>(args?: Subset<T, SlotArgs>): CheckSelect<T, SlotClient<Slot | null>, SlotClient<SlotGetPayload<T> | null>>;

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
  athleteId: string
}

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
  athlete?: boolean | AthleteArgs
  athleteId?: boolean
}

export type AttemptInclude = {
  athlete?: boolean | AthleteArgs
}

export type AttemptGetPayload<
  S extends boolean | null | undefined | AttemptArgs,
  U = keyof S
> = S extends true
  ? Attempt
  : S extends undefined
  ? never
  : S extends AttemptArgs
  ? 'include' extends U
    ? Attempt  & {
      [P in TrueKeys<S['include']>]:
      P extends 'athlete'
      ? AthleteGetPayload<S['include'][P]> : never
    }
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof Attempt ? Attempt[P]
: 
      P extends 'athlete'
      ? AthleteGetPayload<S['select'][P]> : never
    }
  : Attempt
: Attempt


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
  ): CheckSelect<T, AttemptClient<Attempt | null>, AttemptClient<AttemptGetPayload<T> | null>>
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
  ): CheckSelect<T, Promise<Array<Attempt>>, Promise<Array<AttemptGetPayload<T>>>>
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
  ): CheckSelect<T, AttemptClient<Attempt>, AttemptClient<AttemptGetPayload<T>>>
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
  ): CheckSelect<T, AttemptClient<Attempt>, AttemptClient<AttemptGetPayload<T>>>
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
  ): CheckSelect<T, AttemptClient<Attempt>, AttemptClient<AttemptGetPayload<T>>>
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
  ): CheckSelect<T, AttemptClient<Attempt>, AttemptClient<AttemptGetPayload<T>>>
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

  athlete<T extends AthleteArgs = {}>(args?: Subset<T, AthleteArgs>): CheckSelect<T, AthleteClient<Athlete | null>, AthleteClient<AthleteGetPayload<T> | null>>;

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

export type WeightClassSelect = {
  id?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  name?: boolean
  gender?: boolean
  min?: boolean
  max?: boolean
  athletes?: boolean | FindManyAthleteArgs
}

export type WeightClassInclude = {
  athletes?: boolean | FindManyAthleteArgs
}

export type WeightClassGetPayload<
  S extends boolean | null | undefined | WeightClassArgs,
  U = keyof S
> = S extends true
  ? WeightClass
  : S extends undefined
  ? never
  : S extends WeightClassArgs
  ? 'include' extends U
    ? WeightClass  & {
      [P in TrueKeys<S['include']>]:
      P extends 'athletes'
      ? Array<AthleteGetPayload<S['include'][P]>> : never
    }
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof WeightClass ? WeightClass[P]
: 
      P extends 'athletes'
      ? Array<AthleteGetPayload<S['select'][P]>> : never
    }
  : WeightClass
: WeightClass


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
  ): CheckSelect<T, WeightClassClient<WeightClass | null>, WeightClassClient<WeightClassGetPayload<T> | null>>
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
  ): CheckSelect<T, Promise<Array<WeightClass>>, Promise<Array<WeightClassGetPayload<T>>>>
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
  ): CheckSelect<T, WeightClassClient<WeightClass>, WeightClassClient<WeightClassGetPayload<T>>>
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
  ): CheckSelect<T, WeightClassClient<WeightClass>, WeightClassClient<WeightClassGetPayload<T>>>
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
  ): CheckSelect<T, WeightClassClient<WeightClass>, WeightClassClient<WeightClassGetPayload<T>>>
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
  ): CheckSelect<T, WeightClassClient<WeightClass>, WeightClassClient<WeightClassGetPayload<T>>>
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

  athletes<T extends FindManyAthleteArgs = {}>(args?: Subset<T, FindManyAthleteArgs>): CheckSelect<T, Promise<Array<Athlete>>, Promise<Array<AthleteGetPayload<T>>>>;

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

export type AgeClassSelect = {
  id?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  name?: boolean
  sortId?: boolean
  athletes?: boolean | FindManyAthleteArgs
}

export type AgeClassInclude = {
  athletes?: boolean | FindManyAthleteArgs
}

export type AgeClassGetPayload<
  S extends boolean | null | undefined | AgeClassArgs,
  U = keyof S
> = S extends true
  ? AgeClass
  : S extends undefined
  ? never
  : S extends AgeClassArgs
  ? 'include' extends U
    ? AgeClass  & {
      [P in TrueKeys<S['include']>]:
      P extends 'athletes'
      ? Array<AthleteGetPayload<S['include'][P]>> : never
    }
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof AgeClass ? AgeClass[P]
: 
      P extends 'athletes'
      ? Array<AthleteGetPayload<S['select'][P]>> : never
    }
  : AgeClass
: AgeClass


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
  ): CheckSelect<T, AgeClassClient<AgeClass | null>, AgeClassClient<AgeClassGetPayload<T> | null>>
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
  ): CheckSelect<T, Promise<Array<AgeClass>>, Promise<Array<AgeClassGetPayload<T>>>>
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
  ): CheckSelect<T, AgeClassClient<AgeClass>, AgeClassClient<AgeClassGetPayload<T>>>
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
  ): CheckSelect<T, AgeClassClient<AgeClass>, AgeClassClient<AgeClassGetPayload<T>>>
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
  ): CheckSelect<T, AgeClassClient<AgeClass>, AgeClassClient<AgeClassGetPayload<T>>>
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
  ): CheckSelect<T, AgeClassClient<AgeClass>, AgeClassClient<AgeClassGetPayload<T>>>
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

  athletes<T extends FindManyAthleteArgs = {}>(args?: Subset<T, FindManyAthleteArgs>): CheckSelect<T, Promise<Array<Athlete>>, Promise<Array<AthleteGetPayload<T>>>>;

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
  eventId: string
}

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
  event?: boolean | EventArgs
  eventId?: boolean
  officialSlots?: boolean | FindManyOfficialSlotArgs
}

export type OfficialInclude = {
  event?: boolean | EventArgs
  officialSlots?: boolean | FindManyOfficialSlotArgs
}

export type OfficialGetPayload<
  S extends boolean | null | undefined | OfficialArgs,
  U = keyof S
> = S extends true
  ? Official
  : S extends undefined
  ? never
  : S extends OfficialArgs
  ? 'include' extends U
    ? Official  & {
      [P in TrueKeys<S['include']>]:
      P extends 'event'
      ? EventGetPayload<S['include'][P]> :
      P extends 'officialSlots'
      ? Array<OfficialSlotGetPayload<S['include'][P]>> : never
    }
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof Official ? Official[P]
: 
      P extends 'event'
      ? EventGetPayload<S['select'][P]> :
      P extends 'officialSlots'
      ? Array<OfficialSlotGetPayload<S['select'][P]>> : never
    }
  : Official
: Official


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
  ): CheckSelect<T, OfficialClient<Official | null>, OfficialClient<OfficialGetPayload<T> | null>>
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
  ): CheckSelect<T, Promise<Array<Official>>, Promise<Array<OfficialGetPayload<T>>>>
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
  ): CheckSelect<T, OfficialClient<Official>, OfficialClient<OfficialGetPayload<T>>>
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
  ): CheckSelect<T, OfficialClient<Official>, OfficialClient<OfficialGetPayload<T>>>
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
  ): CheckSelect<T, OfficialClient<Official>, OfficialClient<OfficialGetPayload<T>>>
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
  ): CheckSelect<T, OfficialClient<Official>, OfficialClient<OfficialGetPayload<T>>>
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

  event<T extends EventArgs = {}>(args?: Subset<T, EventArgs>): CheckSelect<T, EventClient<Event | null>, EventClient<EventGetPayload<T> | null>>;

  officialSlots<T extends FindManyOfficialSlotArgs = {}>(args?: Subset<T, FindManyOfficialSlotArgs>): CheckSelect<T, Promise<Array<OfficialSlot>>, Promise<Array<OfficialSlotGetPayload<T>>>>;

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



/**
 * Model OfficialSlot
 */

export type OfficialSlot = {
  id: string
  createdAt: Date
  updatedAt: Date
  position: Position
  officialId: string
  slotId: string
}

export type OfficialSlotSelect = {
  id?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  position?: boolean
  official?: boolean | OfficialArgs
  officialId?: boolean
  slot?: boolean | SlotArgs
  slotId?: boolean
}

export type OfficialSlotInclude = {
  official?: boolean | OfficialArgs
  slot?: boolean | SlotArgs
}

export type OfficialSlotGetPayload<
  S extends boolean | null | undefined | OfficialSlotArgs,
  U = keyof S
> = S extends true
  ? OfficialSlot
  : S extends undefined
  ? never
  : S extends OfficialSlotArgs
  ? 'include' extends U
    ? OfficialSlot  & {
      [P in TrueKeys<S['include']>]:
      P extends 'official'
      ? OfficialGetPayload<S['include'][P]> :
      P extends 'slot'
      ? SlotGetPayload<S['include'][P]> : never
    }
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof OfficialSlot ? OfficialSlot[P]
: 
      P extends 'official'
      ? OfficialGetPayload<S['select'][P]> :
      P extends 'slot'
      ? SlotGetPayload<S['select'][P]> : never
    }
  : OfficialSlot
: OfficialSlot


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
  ): CheckSelect<T, OfficialSlotClient<OfficialSlot | null>, OfficialSlotClient<OfficialSlotGetPayload<T> | null>>
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
  ): CheckSelect<T, Promise<Array<OfficialSlot>>, Promise<Array<OfficialSlotGetPayload<T>>>>
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
  ): CheckSelect<T, OfficialSlotClient<OfficialSlot>, OfficialSlotClient<OfficialSlotGetPayload<T>>>
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
  ): CheckSelect<T, OfficialSlotClient<OfficialSlot>, OfficialSlotClient<OfficialSlotGetPayload<T>>>
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
  ): CheckSelect<T, OfficialSlotClient<OfficialSlot>, OfficialSlotClient<OfficialSlotGetPayload<T>>>
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
  ): CheckSelect<T, OfficialSlotClient<OfficialSlot>, OfficialSlotClient<OfficialSlotGetPayload<T>>>
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

  official<T extends OfficialArgs = {}>(args?: Subset<T, OfficialArgs>): CheckSelect<T, OfficialClient<Official | null>, OfficialClient<OfficialGetPayload<T> | null>>;

  slot<T extends SlotArgs = {}>(args?: Subset<T, SlotArgs>): CheckSelect<T, SlotClient<Slot | null>, SlotClient<SlotGetPayload<T> | null>>;

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

export type UserGetPayload<
  S extends boolean | null | undefined | UserArgs,
  U = keyof S
> = S extends true
  ? User
  : S extends undefined
  ? never
  : S extends UserArgs
  ? 'include' extends U
    ? User 
  : 'select' extends U
    ? {
      [P in TrueKeys<S['select']>]:P extends keyof User ? User[P]
: 
 never
    }
  : User
: User


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
  ): CheckSelect<T, UserClient<User | null>, UserClient<UserGetPayload<T> | null>>
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
  ): CheckSelect<T, Promise<Array<User>>, Promise<Array<UserGetPayload<T>>>>
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
  ): CheckSelect<T, UserClient<User>, UserClient<UserGetPayload<T>>>
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
  ): CheckSelect<T, UserClient<User>, UserClient<UserGetPayload<T>>>
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
  ): CheckSelect<T, UserClient<User>, UserClient<UserGetPayload<T>>>
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
  ): CheckSelect<T, UserClient<User>, UserClient<UserGetPayload<T>>>
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
  athleteId?: string | StringFilter | null
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
  eventId?: string | StringFilter | null
  weightClassId?: string | StringFilter | null
  ageClassId?: string | StringFilter | null
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
  eventId?: string | StringFilter | null
  slotId?: string | StringFilter | null
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
  eventId?: string | StringFilter | null
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
  officialId?: string | StringFilter | null
  slotId?: string | StringFilter | null
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
  eventId?: string | StringFilter | null
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
  athleteId?: string | StringFilter | null
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
  eventId?: string | StringFilter | null
  weightClassId?: string | StringFilter | null
  ageClassId?: string | StringFilter | null
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
  officialId?: string | StringFilter | null
  slotId?: string | StringFilter | null
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
  eventId?: string | StringFilter | null
  slotId?: string | StringFilter | null
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
  eventId?: string | StringFilter | null
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
  eventId?: string | StringFilter | null
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
  event?: OrderByArg | null
  eventId?: OrderByArg | null
  weightClass?: OrderByArg | null
  weightClassId?: OrderByArg | null
  ageClass?: OrderByArg | null
  ageClassId?: OrderByArg | null
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
  athlete?: OrderByArg | null
  athleteId?: OrderByArg | null
}

export type SlotOrderByInput = {
  id?: OrderByArg | null
  createdAt?: OrderByArg | null
  updatedAt?: OrderByArg | null
  name?: OrderByArg | null
  event?: OrderByArg | null
  eventId?: OrderByArg | null
}

export type AthleteGroupOrderByInput = {
  id?: OrderByArg | null
  createdAt?: OrderByArg | null
  updatedAt?: OrderByArg | null
  name?: OrderByArg | null
  event?: OrderByArg | null
  eventId?: OrderByArg | null
  slot?: OrderByArg | null
  slotId?: OrderByArg | null
}

export type OfficialSlotOrderByInput = {
  id?: OrderByArg | null
  createdAt?: OrderByArg | null
  updatedAt?: OrderByArg | null
  position?: OrderByArg | null
  official?: OrderByArg | null
  officialId?: OrderByArg | null
  slot?: OrderByArg | null
  slotId?: OrderByArg | null
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
  event?: OrderByArg | null
  eventId?: OrderByArg | null
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
