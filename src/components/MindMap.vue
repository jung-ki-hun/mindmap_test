<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ButterflyVue
      :canvasData="mockData"
    />
  </div>
</template>

<script>
import mockData from "./mockData.js";
import { ButterflyVue } from 'butterfly-vue';
export default {
  name: 'MindMap',
  props: {
    msg:
    {
      type: String,
      default:'',
    }
  },
  components: {
    ButterflyVue
  },
  data () {
    return {
      mockData: mockData,// 추후 db에서 가져옴
      nodes: [],
    }
  },
  async created(){
    console.log(mockData)
    // console.log(mockData)
  },
 async mounted(){
    await this.setNodeEvent();

  },
  methods:{
    setNodeEvent() {
      // click 이벤트 추가 함수
      this.mockData.nodes.forEach(x=>{this.nodes.push(x.id)}) //node index 번호가져옴
      for(let x of this.nodes){
      const node = document.getElementById(`bf_node_${x}`) // 모든 노드에 부여함
      node.addEventListener('dblclick',()=>{
        if(confirm("노드 추가 하시겠습니까?")){
          this.createNode();
        }
      })
      }
    },//이벤트 부여 함수
    createNode(){
      const endpoints = [
        {
          id: 'right',// 구분용 id 값 // 식별하기 편한걸로 진행하면 하면됨
          orientation: [1, 0],// x 축값 
          pos: [0, 0.5] // y 축값
        },
        {
          id: 'left',
          orientation: [-1, 0],
          pos: [0, 0.5]
        },
        {
          id: 'up',
          orientation: [0, -1],
          pos: [0.5, 0.5] 
        },
        {
          id: 'down',
          orientation: [0, 1],
          pos: [0.5, 0.5]
        }
      ];// 연결점
      // node 생성함수
      const node = {        
        id: `${this.nodes.length + 1}`, // index 번호 부여
        top: 50,
        left: 300,
        endpoints: endpoints,
      }
      this.mockData.nodes.push(node)
      const createdNode = document.getElementById(`bf_node_${node.id}`) // 모든 노드에 부여함
      createdNode.addEventListener('dblclick',()=>{
        if(confirm("노드 추가 하시겠습니까?")){
          this.createNode();
        }
      })// 신규 생성 노드에도 click event 부여
    }
  
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
