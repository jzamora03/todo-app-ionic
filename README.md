# Todo App

App de tareas construida con Ionic, Angular y Cordova. Pensada como prueba técnica, pero con la idea de que se sienta como una app real: buen diseño, categorías, filtros y un par de cosas extra como Firebase Remote Config para manejar features en caliente.

Corre en Android (y en iOS si tienes Mac).

---

## Qué hace

- Crear, completar y eliminar tareas
- Organizar tareas por categorías (con color)
- Filtrar por categoría desde la pantalla principal
- Persistencia con localStorage, no se pierde nada al cerrar
- Panel de estadísticas que se activa/desactiva desde Firebase sin tocar el código
- Hint animado la primera vez que agregas una tarea, para que sepas que puedes deslizar para eliminar

---

## Stack

- Ionic 7 + Angular 20
- Cordova (Android / iOS)
- Firebase + Remote Config
- @angular/cdk (virtual scroll)

---

## Cómo correrlo

### Lo que necesitas tener instalado

- Node.js 18+
- Java JDK 17 (importante que sea el 17, no versiones más nuevas)
- Android Studio con Android SDK y Build Tools 35
- `npm install -g @ionic/cli cordova native-run`

### Instalación

```bash
git clone https://github.com/tu-usuario/todo-app.git
cd todo-app
npm install
```

### Firebase

Crea un proyecto en [console.firebase.google.com](https://console.firebase.google.com), registra una app Web y una Android con el package `io.ionic.starter`, y llena `src/environments/environment.ts` con tus credenciales:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
  }
};
```

En Remote Config crea el parámetro `show_statistics` con valor `false` por defecto.

---

## Correr en Android

Antes de cualquier cosa, si estás en Windows, abre la terminal y setea Java 17 (si tienes otra versión instalada):

```bash
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
```

Activa la depuración USB en tu teléfono (Ajustes → Acerca del teléfono → toca 7 veces el número de compilación → Opciones de desarrollador → Depuración USB).

```bash
# En dispositivo físico
ionic cordova run android --device

# En emulador
ionic cordova run android --emulator

# Con live reload (dispositivo y PC en la misma red)
ionic cordova run android --device --livereload --external
```

### Generar APK

```bash
ionic cordova build android --prod --release
```

Sale en `platforms/android/app/build/outputs/apk/release/`.

---

## Correr en iOS

Solo en macOS. Necesitas Xcode y una Apple Developer Account.

```bash
ionic cordova platform add ios
ionic cordova run ios --device
```

Para generar el IPA, abre el proyecto en Xcode (`platforms/ios/`), configura el equipo de firma y usa Product → Archive.

---

## Feature flag con Firebase Remote Config

El parámetro `show_statistics` controla si se muestra el panel de estadísticas (total, pendientes, completadas) en la pantalla principal.

Para probarlo: entra a Firebase Console → Remote Config → cambia `show_statistics` a `true` → publica → cierra y abre la app. El panel aparece sin necesidad de subir una nueva versión.

---

## Estructura del proyecto

```
src/app/
├── models/
│   ├── todo.model.ts
│   └── category.model.ts
├── services/
│   ├── todo.service.ts
│   ├── category.service.ts
│   └── remote-config.service.ts
├── pages/
│   ├── home/
│   ├── categories/
│   └── category-form/
└── app-routing.module.ts
```

---

## Optimizaciones aplicadas

Algunas decisiones que tomé pensando en rendimiento:

- **OnPush en todos los componentes**: Angular solo re-renderiza cuando cambia una referencia, no en cada ciclo de detección.
- **trackBy en listas**: evita que Angular destruya y recree nodos del DOM que no cambiaron.
- **takeUntil + destroy$**: limpia las subscripciones de RxJS cuando se destruye un componente. Sin esto se acumula memoria con el tiempo.
- **Virtual scroll (CDK)**: si la lista tiene cientos de tareas, solo renderiza las que están visibles en pantalla.
- **Lazy loading**: cada página se carga solo cuando el usuario la visita, no todo al inicio.

---

## Preguntas técnicas

**¿Cuáles fueron los principales desafíos?**

Lo más complicado fue la compatibilidad entre herramientas. Angular 20, Ionic, Cordova, Gradle y Java tienen que estar en versiones específicas para funcionar juntos. Encontrar que Java 17 era el límite (Gradle 8 no soporta el bytecode de Java 21+) me tomó un rato. También tuve que configurar `network_security_config.xml` para que Android no bloqueara el tráfico HTTP del live reload.

**¿Qué técnicas de optimización usaste y por qué?**

Las que más impacto tienen en el día a día son OnPush y takeUntil. OnPush reduce mucho los ciclos de detección de cambios en listas que se actualizan seguido. takeUntil es algo que se omite fácil pero que en apps con navegación entre páginas causa memory leaks reales si no se limpia. El virtual scroll lo agregué más pensando en escalabilidad, porque con pocas tareas no se nota, pero con 500 la diferencia es clara.

**¿Cómo aseguraste la calidad del código?**

Separé bien las responsabilidades: los servicios manejan los datos, las páginas solo consumen y muestran. Usé interfaces TypeScript para todos los modelos, lo que ayuda a detectar errores en tiempo de compilación. Nombré las cosas de forma consistente y evité lógica de negocio en los templates. El historial de commits también ayuda a rastrear qué cambió y por qué.

---

## Cambios por versión

**v1.2.0**
- Virtual scroll con CDK para listas grandes
- takeUntil en todos los componentes para evitar memory leaks
- OnPush y trackBy en todas las páginas

**v1.1.0**
- Rediseño completo con estilo minimalista
- Saludo dinámico según la hora
- Hint animado al agregar la primera tarea
- Confirmación antes de eliminar
- Preview de color en el formulario de categorías

**v1.0.0**
- CRUD de tareas y categorías
- Filtrado por categoría
- Persistencia con localStorage
- Firebase + Remote Config con feature flag
- Configuración Cordova para Android

---

## Autor

Jhoseph Zamora — [LinkedIn](https://www.linkedin.com/in/jhoseph-zamora/) — jhosephzc@gmail.com
