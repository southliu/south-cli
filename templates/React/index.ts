import { IPageFunctions } from "../../types";

export function handleReactFile(functions: IPageFunctions[]) {
  const data: string[] = [
    `import axios from 'axios'\n`,
    '\nfunction Page() {',
    '\n}\n',
    '\nexport default Page',
  ]

  let value = ''
  data.forEach(e => value += e)
  return value
}