<!--
 * 导入JSON文件
-->

<template>
  <div class="inline-block">
    <el-button @click="insert" size="small">{{ $t('editor.import_files') }}</el-button>
  </div>
</template>

<script setup>
import useSelect from '@/hooks/select'
// import { selectFiles, downFontByJSON } from '@/utils/utils';
defineOptions({
  name: 'ImportJson'
})
const { canvasEditor } = useSelect()
const insert = () => {
  canvasEditor.insert()
  // selectFiles({ accept: '.json' }).then((files) => {
  //   const [file] = files;
  //   const reader = new FileReader();
  //   reader.readAsText(file, 'UTF-8');
  //   reader.onload = () => {
  //     insertSvgFile(reader.result);
  //   };
  // });
}

// function insertSvgFile(jsonFile) {
//   // 加载字体后导入
//   downFontByJSON(jsonFile).then(() => {
//     canvas.c.loadFromJSON(jsonFile, () => {
//       canvas.c.renderAll.bind(canvas.c);
//       setTimeout(() => {
//         const workspace = canvas.c.getObjects().find((item) => item.id === 'workspace');
//         workspace.set('selectable', false);
//         workspace.set('hasControls', false);
//         canvas.c.requestRenderAll();
//         canvas.editor.editorWorkspace.setSize(workspace.width, workspace.height);
//         canvas.c.renderAll();
//         canvas.c.requestRenderAll();
//       }, 100);
//     });
//   });
// }
</script>
