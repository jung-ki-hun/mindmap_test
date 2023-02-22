<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <!-- <flowchart :nodes="nodes" 
      :connections="connections" 
      :remove-requires-confirmation="true"
      @editnode="handleEditNode"
      @dblclick="handleDblClick" 
      @editconnection="handleEditConnection"
      @removeconfirmationrequired="initRemovingConfirmation"
      @save="handleChartSave" ref="chart">
        </flowchart> -->
        <MindMap :msg="'테스트'"/>
  </div>
</template>

<script>
import MindMap from './components/MindMap.vue'
export default {
  name: 'App',
  components: {
    MindMap
},
  data: function() {
      return {
        nodes: [
          // Basic fields
          {id: 1, x: 140, y: 270, name: 'Start', type: 'start'},
          // You can add any generic fields to node, for example: description
          // It will be passed to @save, @editnode
          {
          id: 3,
          x: 340,
          y: 270,
          name: "Operation",
          type: "operation",
          description: "I'm here",
          approvers: [{ name: "Joyce" }],
          theme:{ borderColor: "#bbbbbb", borderColorSelected: "#6616c6", headerTextColor: "black", headerBackgroundColor: "#ffaaff", bodyBackgroundColor: "red", bodyTextColor: "black" }
        },
                  {id: 2, x: 540, y: 270, name: 'End', type: 'end', description: 'I\'m here'},
        ],
        connections: [
          {
            source: {id: 1, position: 'right'},
            destination: {id: 2, position: 'left'},
            id: 1,
            type: 'pass',
          },
          {
            source: {id: 3, position: 'right'},
            destination: {id: 2, position: 'left'},
            id: 2,
            type: 'pass',
          },
          {
            source: {id: 2, position: 'right'},
            destination: {id: 3, position: 'left'},
            id: 3,
            type: 'pass',
          },
        ],
        showRemovingConfirmation: false,
      };
    },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
