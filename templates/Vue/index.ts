import { IPageFunctions } from "../../types";

export function handleVueFile(functions: IPageFunctions[]): string {
  let render = '' // 渲染数据
  const paginationData: string[] = [] // 分页数据

  // 模板数据
  const templateDatas = (other: string[]): string[] => [
    '<template>\n',
    ...other,
    '\n</template>',
  ]

  // 插件数据
  const importDatas: string[] = [
    `import { defineComponent, reactive, ref } from 'vue';\n`,
    `import { VxeGridInstance, VxeGridProps } from 'vxe-table';\n`,
  ]

  // script数据
  const scriptDatas = (other: string[]): string[] => [
    '<script lang="ts">\n',
    ...importDatas,
    '\nexport default defineComponent({',
    ...other,
    '\n})',
    '\n</script>',
  ]

  // 当有分页数据时
  if (functions.includes('pagination')) {
    paginationData.push('\r\n    <pagination />')
  }

  templateDatas(['\n<div>test</div>']).forEach(e => render += e)
  scriptDatas(['\nsetup () {}']).forEach(e => render += e)
  
  return render
}