// This file allows us to use Webpack to export content of the files with these extentions as a string

declare module '*.html' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}
