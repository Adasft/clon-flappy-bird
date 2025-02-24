/**
 * Interfaz que define las opciones de configuración de físicas, separadas en opciones para
 * físicas de objetos individuales y opciones globales para la escena.
 *
 * Esta interfaz está diseñada para ser flexible y cubrir una amplia gama de motores de físicas 2D,
 * aunque la disponibilidad y sintaxis exacta de las opciones puede variar dependiendo del motor específico que se utilice.
 *
 * Consulta siempre la documentación oficial de tu motor de juego para obtener la información más precisa y detallada.
 */

import Drawable from "./engine/drawables/drawable";

interface ObjectPhysicsOptions {
  /**
   * **Gravedad (Objeto)**
   *
   * Define la gravedad *específica* para este objeto.
   * Si se define aquí, esta gravedad *reemplaza* la gravedad global para este objeto en particular.
   * Si no se define, el objeto hereda la gravedad global (si está definida).
   *
   * **Formato:** Un objeto con las propiedades `x` e `y`.
   *   - `x`: Componente horizontal de la gravedad.
   *   - `y`: Componente vertical de la gravedad.
   *
   * **Ejemplos:**
   *   `gravity: { x: 0, y: 150 }` (Gravedad vertical específica para el objeto).
   */
  gravity?: { x?: number; y?: number };

  /**
   * **Depuración (Debug) (Objeto)**
   *
   * Activa/desactiva la visualización de depuración física *solo para este objeto*.
   * Si se activa a nivel de objeto, la depuración se mostrará solo para este objeto, incluso si la depuración global está desactivada.
   *
   * **Formato:** Un valor booleano (`true` o `false`).
   *   - `true`: Activa la depuración para este objeto.
   *   - `false`: Desactiva la depuración para este objeto.
   */
  debug?: boolean;

  /**
   * **Inmóvil (Immovable) / Estático (Static) (Objeto)**
   *
   * Convierte este objeto en un cuerpo físico inmóvil.
   * Un cuerpo inmóvil no se mueve ni es afectado por fuerzas o colisiones con otros cuerpos dinámicos.
   * Útil para crear plataformas, paredes, suelos, etc.
   *
   * **Formato:** Un valor booleano (`true` o `false`).
   *   - `true`: El cuerpo es inmóvil (estático).
   *   - `false`: El cuerpo es dinámico.
   *
   * **Alias comunes:** `isStatic`.
   */
  immovable?: boolean;
  isStatic?: boolean;

  /**
   * **Fricción (Friction) (Objeto)**
   *
   * Define la fricción superficial específica para este objeto.
   * Afecta cuánto se ralentiza un objeto al deslizarse o rozar contra otras superficies.
   *
   * **Formato:** Un valor numérico (generalmente entre 0 y 1, o mayor).
   *   - `0`: Sin fricción.
   *   - `1`: Fricción alta.
   */
  friction?: number;

  /**
   * **Restitución / Rebote (Restitution / Bounce) (Objeto)**
   *
   * Define el rebote específico para este objeto al colisionar con superficies.
   *
   * **Formato:** Un valor numérico (generalmente entre 0 y 1).
   *   - `0`: Sin rebote.
   *   - `1`: Rebote perfecto (teórico).
   *
   * **Alias comunes:** `bounce`.
   */
  restitution?: number;
  bounce?: number;

  /**
   * **Densidad (Density) (Objeto)**
   *
   * Define la densidad específica para este objeto.  Junto con el tamaño, determina su masa.
   *
   * **Formato:** Un valor numérico positivo.
   *   - Mayor densidad = mayor masa (para el mismo tamaño).
   */
  density?: number;

  /**
   * **Masa (Mass) (Objeto)**
   *
   * Define directamente la masa del cuerpo físico para este objeto. Alternativa a `density` en algunos motores.
   *
   * **Formato:** Un valor numérico positivo.
   */
  mass?: number;

  /**
   * **Amortiguación Lineal (Linear Damping / Drag) (Objeto)**
   *
   * Define la amortiguación lineal específica para este objeto (resistencia al movimiento lineal).
   *
   * **Formato:** Un valor numérico (generalmente entre 0 y 1, o mayor).
   *   - `0`: Sin amortiguación.
   *   - Valores positivos: Mayor amortiguación.
   *
   * **Alias comunes:** `drag`.
   */
  linearDamping?: number;
  drag?: number;

  /**
   * **Amortiguación Angular (Angular Damping) (Objeto)**
   *
   * Define la amortiguación angular específica para este objeto (resistencia al movimiento rotacional).
   *
   * **Formato:** Un valor numérico (similar a `linearDamping`).
   */
  angularDamping?: number;

  /**
   * **Colisionar con Bordes del Mundo (Collide World Bounds) (Objeto)**
   *
   * Define si *este objeto* colisiona con los límites del mundo del juego.
   *
   * **Formato:** Un valor booleano (`true` o `false`).
   *   - `true`: Colisiona con los bordes.
   *   - `false`: No colisiona con los bordes.
   */
  collideWorldBounds?: boolean;

  /**
   * **Velocidad Inicial X (VelocityX) (Objeto)**
   *
   * Define la velocidad horizontal inicial de este objeto.
   *
   * **Formato:** Un valor numérico.
   */
  velocityX?: number;

  /**
   * **Velocidad Inicial Y (VelocityY) (Objeto)**
   *
   * Define la velocidad vertical inicial de este objeto.
   *
   * **Formato:** Un valor numérico.
   */
  velocityY?: number;

  /**
   * **Velocidad Angular Inicial (Angular Velocity) (Objeto)**
   *
   * Define la velocidad de rotación inicial de este objeto.
   *
   * **Formato:** Un valor numérico.
   */
  angularVelocity?: number;

  /**
   * **Forma (Shape) / Tipo de Cuerpo (BodyType) (Objeto)**
   *
   * Define la forma geométrica del cuerpo físico para la detección de colisiones de este objeto.
   *
   * **Formato:** Depende del motor. String o objeto de configuración.
   *   - Ejemplos: `'circle'`, `'rectangle'`, `{ type: 'polygon', vertices: [...] }`.
   *
   * **Alias comunes:** `bodyType`.
   */
  shape?: string | object;
  bodyType?: string | object;

  /**
   * **Sensor (Is Sensor) (Objeto)**
   *
   * Convierte este objeto en un sensor de colisiones (detecta pero no reacciona físicamente).
   *
   * **Formato:** Un valor booleano (`true` o `false`).
   *   - `true`: Es un sensor.
   *   - `false`: No es un sensor.
   */
  isSensor?: boolean;
};

interface GlobalPhysicsOptions {
    /**
     * **Gravedad (Global)**
     *
     * Define la gravedad *global* que afecta a todos los cuerpos físicos en la escena por defecto.
     *
     * **Formato:** Un objeto con las propiedades `x` e `y`.
     *   - `x`: Componente horizontal de la gravedad global.
     *   - `y`: Componente vertical de la gravedad global.
     *
     * **Ejemplos:**
     *   `gravity: { x: 0, y: 300 }` (Gravedad vertical global para la escena).
     */
    gravity?: { x?: number; y?: number };

    /**
     * **Depuración (Debug) (Global)**
     *
     * Activa/desactiva la visualización de depuración física para *toda la escena*.
     *
     * **Formato:** Un valor booleano (`true` o `false`).
     *   - `true`: Activa la depuración global.
     *   - `false`: Desactiva la depuración global.
     */
    debug?: boolean;

    /**
     * **Límites del Mundo (World Bounds) (Global)**
     *
     * Define los límites del "mundo" físico en la escena.
     *
     * **Formato:** Depende del motor. Objeto con `x`, `y`, `width`, `height`.
     *   - Ejemplo: `worldBounds: { x: 0, y: 0, width: 800, height: 600 }`.
     *
     * **Alias comunes:** `setBounds`.
     */
    worldBounds?: { x?: number; y?: number; width?: number; height?: number };
    setBounds?: { x?: number; y?: number; width?: number; height?: number };

    /**
     * **Escala de Tiempo (Time Scale) (Global)**
     *
     * Controla la velocidad de la simulación física global en relación con el tiempo real del juego.
     *
     * **Formato:** Un valor numérico.
     *   - `1`: Escala de tiempo normal.
     *   - `> 1`: Física más rápida.
     *   - `< 1`: Física más lenta.
     *
     * **Alias comunes:** `physicsTimeScale`, `setPhysicsTimeScale`.
     */
    timeScale?: number;
    physicsTimeScale?: number;
    setPhysicsTimeScale?: number;

    /**
     * **Valores por Defecto (Defaults) (Global)**
     *
     * Define valores por defecto para propiedades físicas que se aplicarán a todos los objetos.
     *
     * **Formato:** Un objeto con propiedades físicas y sus valores por defecto (ej. `{ friction: 0.3, restitution: 0.1 }`).
     *
     * **Propiedades comunes:** `friction`, `restitution`, `density`, `linearDamping`, `angularDamping`.
     */
    defaults?: {
      friction?: number;
      restitution?: number;
      density?: number;
      linearDamping?: number;
      angularDamping?: number;
    };

    /**
     * **Bias de Superposición (Overlap Bias) / Dirección de Ordenamiento (Sort Direction Bias) (Global)**
     *
     * Influye en la resolución de superposiciones entre cuerpos físicos en la escena. Opción avanzada.
     *
     * **Formato:** Depende del motor. Valor numérico o constante predefinida.
     *
     * **Alias comunes:** `sortDirectionBias`.
     */
    overlapBias?: number;
    sortDirectionBias?: number;

    /**
     * **Broadphase (Global)**
     *
     * Configuración del algoritmo de Broadphase para la detección de colisiones en la escena. Opción avanzada.
     *
     * **Formato:**  Muy específico del motor. String o objeto de configuración.
     *   - Ejemplos: `'SweepAndPrune'`, `'Grid'`.
     */
    broadphase?: string | object;

    /**
     * **Narrowphase (Global)**
     *
     * Configuración del algoritmo de Narrowphase para la detección detallada de colisiones en la escena. Opción avanzada.
     *
     * **Formato:** Muy específico del motor. String o objeto de configuración.
     *   - Ejemplos: `'SAT'`, `'Minkowski'`.
     */
    narrowphase?: string | object;

    /**
     * **Iteraciones (Iterations) (Global)**
     *
     * Controla el número de iteraciones del solucionador de físicas por paso de simulación global. Opción avanzada.
     *
     * **Formato:** Un valor numérico entero.
     *
     * **Alias comunes:** `velocityIterations`, `positionIterations`.
     */
    iterations?: number;
    velocityIterations?: number;
    positionIterations?: number;

    /**
     * **Timestep / Paso de Tiempo (Timestep) (Global)**
     *
     * Define el tamaño del paso de tiempo para la simulación física global. Opción avanzada.
     *
     * **Formato:** Un valor numérico (ej. `1/60`).
     *
     * **Alias comunes:** `fixedTimestep`, `deltaT`, `maxSubSteps`.
     */
    timestep?: number;
    fixedTimestep?: number;
    deltaT?: number;
    maxSubSteps?: number;

}

interface Body {}

interface PhysicsOrchestrators {
  enable: (options: GlobalPhysicsOptions) => void
  disable: () => void
  add: (...objects: Drawable[]) => Drawable
}