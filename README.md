## Types of modules (CommonJS, AMD, UMD, ES6). Dynamic imports
### CommonJS (CJS)
It was designed for the server side, where files are stored locally and can be loaded synchronously.

Syntax: Uses module.exports to export and require() to import.  
Behavior: Synchronous. Execution stops until the required module is loaded.

### Asynchronous Module Definition (AMD)
AMD was created to solve the "synchronous" problem of CommonJS in browsers.
Allows modules to load **asynchronously**.

Syntax: Uses a `define()` function.  
Library: Most commonly associated with RequireJS.

### Universal Module Definition (UMD)
UMD isn't really a new system; it’s a **pattern** (a "wrapper").  
It checks which module system is currently available and uses that one. It’s used primarily **by library authors** who want their code to work everywhere.
1. If AMD is present, use `define()`.
2. Else if CommonJS is present, use `module.exports`.
3. Else, attach it to the global `window` object.

### ES6 Modules (ESM)
Official standard for JavaScript. It works natively in modern browsers and recent versions of Node.js.
It combines the best of both worlds.

Syntax: Uses `import` and `export`.
Behavior: It can be asynchronous and is strictly "static", meaning you can't import a module inside an if statement (unless using **dynamic** `import()`).  
"static" means that the structure of your imports and exports is determined at **compile time** (when the code is being read by the engine), not at runtime (when the code is actually executing).

`import()` is asynchronous. It acts like a function that returns a `Promise`. It's called **dynamic import**.


## Functional Patterns. Callbacks and IIFE
### Callbacks
A callback is simply a **function passed into another function** as an argument, which is then "called back" at a later time.  
We need them to make code asynchronous. It's passed into another function because we can't wait until something calls this function. We save it into another function and execute the rest of the code. 

### IIFE
'iffy's used for: 
- Data Privacy (Encapsulation): Variables declared inside an IIFE cannot be accessed from the outside. This was the original way to create "modules" before ES6 existed.  
- Avoiding Global Pollution: If you have a lot of code, you don't want to accidentally overwrite a global variable.

## Function Currying and Partial Application
### Currying 
Instead of `f(a, b, c)`, you call `f(a)(b)(c)`.
```// Regular function
const sum = (a, b) => a + b;
const curriedSum = (a) => (b) => a + b;
console.log(curriedSum(5)(10)); // 15
```

### Partial Application
Partial application is when you take a function with multiple arguments and "fix" (set) a few of them, returning a new function with fewer arguments.  
`.bind()` method is a common way to perform partial application.

### The difference:  
Currying always splits the function into **single-argument steps**. Partial application can fix **any number of arguments** at once.

## Object-Oriented Programming (OOP)
### `new` keyword functionality.
Creates an **instance** of an object from a constructor function or a class.

What happens under the hood?  
1. Creates a brand new empty object `{}`.
2. Binds `this` to that new object (so any code inside the function using this refers to the new instance).
3. Sets the prototype of the new object to the constructor's prototype (so it inherits methods).
4. Returns the new object (unless the function explicitly returns its own object).

If you call a constructor without new, this will point to the `global` object

### Differences between class declarations and constructor functions.

| Feature | Constructor Function | Class Declaration |
| :--- | :--- | :--- |
| **Hoisting** | Yes | No |
| **Strict Mode** | Optional | Always |
| **Call without `new`** | Allowed (returns `undefined`) | Throws `TypeError` |
| **Readability** | Messy (methods added outside) | Clean (all code in one block) |
| **Private Members** | Closures only | Native support (`#private`) |

### Usage of `supser`
- You can only use `super()` in a class that uses the `extends` keyword.
- Must be called before using `this` keyword.
- Used to call methods from the parent class like `super.method()`.

## Prototypal Inheritance
### Properties `__proto__` and `prototype`.
`prototype`: exists only on **constructor** functions. It is a "blueprint" where you put methods you want all instances created by that function to have access to.  
`__proto__`: exists on `every object`. It is a "link" or a pointer that tells the JavaScript engine: "If you can't find a property on me, go look at the object linked here."  

When you create a new object using a constructor (like `const myUser = new User()`), JavaScript automatically sets the `myUser.__proto__` to point to `User.prototype`.

### Using `[Object.create]` to define prototypes explicitly.
The `Object.create(proto, [propertiesObject])` static method creates a new object, using an existing object as the prototype of the newly created object.
**Return value:** a new object with the specified prototype object and properties.

Why use this over a Constructor?
1. Direct Linkage: You are linking one object to another without needing a "middleman" function.
2. Explicit Control: You can pass `null` as the argument (`Object.create(null)`) to create a "pure" object that has no prototype at all. Not even the standard `toString()` or `valueOf()` methods.
3. Readability: It makes the Prototype Chain very obvious
4. Itakes a second, optional argument that allows you to define properties with fine-tuned control (like making them read-only): 
```
const user = Object.create(machine, {
  id: {
    value: 123,
    writable: false, // This value cannot be changed!
    enumerable: true
  }
});
```

## WeakSet / WeakMap
Первое его отличие от Map в том, что ключи в WeakMap должны быть объектами, а не примитивными значениями:
