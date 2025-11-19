/**
 * Utility types para substituir 'any' em todo o codebase
 * Fornece type-safety melhorado e documentação clara de intenções
 */

/**
 * UnknownData
 * Use para respostas de API ou dados externos onde o tipo é desconhecido.
 * Força o desenvolvedor a fazer type-checking antes de usar a data.
 * 
 * @example
 * const data: UnknownData = await fetch('/api/data').then(r => r.json());
 * if (typeof data === 'object' && data !== null && 'id' in data) {
 *   console.log(data.id);
 * }
 */
export type UnknownData = Record<string, unknown>;

/**
 * SerializableValue
 * Tipo recursivo para dados que podem ser serializados para JSON.
 * Use quando você precisa garantir que a data é segura para passar entre
 * Server Components e Client Components, ou para armazenar/transmitir.
 * 
 * @example
 * const safeData: SerializableValue = {
 *   name: "John",
 *   age: 30,
 *   active: true,
 *   tags: ["admin", "user"],
 *   metadata: { created: "2024-01-01" }
 * };
 */
export type SerializableValue =
  | string
  | number
  | boolean
  | null
  | SerializableValue[]
  | { [key: string]: SerializableValue };

/**
 * FormDataType
 * Use para dados de formulário submetidos via react-hook-form ou similar.
 * Garante que todos os valores são valores primitivos ou arrays/objetos desses.
 * 
 * @example
 * type MyFormData = FormDataType & {
 *   email: string;
 *   password: string;
 *   rememberMe?: boolean;
 * };
 * 
 * const form = useForm<MyFormData>({ ... });
 */
export type FormDataType = Record<string, string | number | boolean | null | undefined>;

/**
 * ComponentProps
 * Use para props genéricos de componentes React quando o tipo exato é dinâmico.
 * Preferível a `any` porque restringe a valores primitivos/objects.
 * 
 * @example
 * function GenericComponent(props: ComponentProps) {
 *   return <div>{JSON.stringify(props)}</div>;
 * }
 * 
 * // Melhor: use interfaces específicas quando possível
 * interface MyProps {
 *   title: string;
 *   onClick: () => void;
 * }
 * function MyComponent(props: MyProps) { ... }
 */
export type ComponentProps = Record<string, unknown>;

/**
 * SafeAny
 * ÚLTIMO RECURSO quando `any` é verdadeiramente necessário.
 * Use MUITO raramente e SEMPRE com um comentário explicando por quê.
 * 
 * @example
 * // eslint-disable-next-line @typescript-eslint/no-explicit-any
 * function legacyLibraryWrapper(data: SafeAny) {
 *   // Biblioteca legada retorna tipos dinâmicos e não é viável reescrever
 *   return data.process();
 * }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SafeAny = any;

/**
 * Tipos para APIs e Respostas de Servidor
 */

/**
 * ApiResponse
 * Padrão para respostas de API RESTful.
 * Use quando a API segue um padrão de { data, error, status }.
 * 
 * @example
 * type UserApiResponse = ApiResponse<User>;
 * const response: UserApiResponse = await fetch('/api/users/1').then(r => r.json());
 */
export type ApiResponse<T = unknown> = {
  data?: T;
  error?: string | null;
  status: 'success' | 'error' | 'pending';
  message?: string;
};

/**
 * PaginatedResponse
 * Para respostas paginadas de API.
 * 
 * @example
 * type UserListResponse = PaginatedResponse<User>;
 */
export type PaginatedResponse<T = unknown> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * Tipos para Serialização Prisma
 */

/**
 * PrismaSerializable
 * Use para objetos do Prisma que precisam ser convertidos para valores
 * serializáveis antes de serem passados para Client Components.
 * Remove tipos como Decimal e Date.
 * 
 * @example
 * const plan = await prisma.plan.findUnique({ where: { id: 1 } });
 * const serialized: PrismaSerializable = serializePlan(plan);
 * return <ClientComponent data={serialized} />;
 */
export type PrismaSerializable = Record<string, SerializableValue>;

/**
 * Tipos para Validação
 */

/**
 * ValidationResult
 * Para resultados de validação com informações de erro.
 * Use com Zod, Joi, ou validadores customizados.
 * 
 * @example
 * const result: ValidationResult<User> = validateUserForm(formData);
 * if (result.success) {
 *   await createUser(result.data);
 * } else {
 *   console.error(result.errors);
 * }
 */
export type ValidationResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> };

/**
 * Tipos para Estado de Loading
 */

/**
 * LoadingState
 * Para gerenciar estados de loading/error em componentes e hooks.
 * 
 * @example
 * const [state, setState] = useState<LoadingState<User>>({ status: 'idle' });
 */
export type LoadingState<T = unknown> =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error | string };

/**
 * Tipos para Callbacks
 */

/**
 * AsyncFunction
 * Para funções assíncronas com tipo parametrizável.
 * 
 * @example
 * const fetchUser: AsyncFunction<User> = async () => { ... };
 */
export type AsyncFunction<T = void, Args extends unknown[] = []> = (
  ...args: Args
) => Promise<T>;

/**
 * SyncFunction
 * Para funções síncronas com tipo parametrizável.
 */
export type SyncFunction<T = void, Args extends unknown[] = []> = (
  ...args: Args
) => T;

/**
 * EventHandler
 * Para event handlers React tipados.
 * 
 * @example
 * type ClickHandler = EventHandler<React.MouseEvent<HTMLButtonElement>>;
 */
export type EventHandler<T extends React.SyntheticEvent = React.SyntheticEvent> = (
  event: T
) => void;

/**
 * Tipos para Arrays e Collections
 */

/**
 * NonEmptyArray
 * Para arrays que devem ter pelo menos 1 elemento.
 * 
 * @example
 * function processItems(items: NonEmptyArray<Item>) {
 *   // items.length >= 1 é garantido
 * }
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Tipos para Nullable
 */

/**
 * Nullable
 * Para valores que podem ser null ou undefined.
 * 
 * @example
 * function processValue(value: Nullable<string>) {
 *   if (value) console.log(value.toUpperCase());
 * }
 */
export type Nullable<T> = T | null | undefined;

/**
 * Tipos para Optional
 */

/**
 * Optional
 * Para valores opcionais em objetos.
 * 
 * @example
 * type User = {
 *   id: string;
 *   name: string;
 *   email: Optional<string>;
 * };
 */
export type Optional<T> = T | undefined;
