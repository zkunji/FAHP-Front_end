<template>
  <table>
    <tr>
      <th>重要性等级</th>
      <th>r<sub>mn</sub></th>
    </tr>
    <tr>
      <td>同等重要</td>
      <td>1</td>
    </tr>
    <tr>
      <td>稍微重要</td>
      <td>3</td>
    </tr>
    <tr>
      <td>比较重要</td>
      <td>5</td>
    </tr>
    <tr>
      <td>十分重要</td>
      <td>7</td>
    </tr>
    <tr>
      <td>绝对重要</td>
      <td>9</td>
    </tr>
    <tr>
      <td>稍微不重要</td>
      <td>1/3</td>
    </tr>
    <tr>
      <td>比较不重要</td>
      <td>1/5</td>
    </tr>
    <tr>
      <td>十分不重要</td>
      <td>1/7</td>
    </tr>
    <tr>
      <td>绝对不重要</td>
      <td>1/9</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'stardTable'
}
</script>

<style scoped>
td,
th {
  width: 255px;
  height: 38px;
  border: 1px solid#000;
  /* padding: 4px; */
}
table {
  box-sizing: border-box;
  border-collapse: collapse;
  border: 1px solid #000;
  background: #e9eff7;
  text-align: center;
  margin: -10px auto;
}
</style>
