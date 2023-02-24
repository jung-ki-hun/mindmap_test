<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="createGroup()">add Group</button>
    <button @click="createNode()">add Node</button>
    <button @click="deleteNode()">delete Node</button>
    <button @click="deleteGroup()">delete Group</button>
    <ButterflyVue
    style="border: 1px solid ;"
      :canvasData="mockData"
      @onOtherEvent="onEventListener"
      ref="butterfly"
    />
  </div>
</template>

<script>
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
    ButterflyVue,
  },
  data () {
    return {
      mockData: {
        groups: [
          {
            id: 'g-1',
            left: 10,
            top: 20,
          },
        ],
        nodes: [
          {
            id: 'n-1',
            group: 'g-1',
            top: 40,
            left: 20,
            // render:`<div><img alt="Vue logo" src="./assets/logo.png"></div>`,//vue 컨테이너로 넣어줘야됨
            endpoints: [
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
            ],
          },
          {
            id: 'n-2',
            group: 'g-1',
            top: 40,
            left: 140,
            endpoints: [
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
            ],
          },
        ],
        edges: [{
          id: '1-2',
          sourceNode: '1',
          targetNode: '2',
          source: 'down', // 연결 포인트 위치
          target: 'down', // 대상의 연결 포인트 위치
        }, 
        {
          id: '2-1',
          sourceNode: '2',
          targetNode: '1',
          source: 'up',
          target: 'up',
        }],
      },// 추후 db에서 가져옴
      selected_node: null,
      selected_group: null,
      currentMindVueEvent: null
    }
  },
  computed: {
    current_nodes() {
      return this.mockData.nodes.map(x => x.id)
    },
    nodes_length () {
      return this.current_nodes.length
    },
    current_groups() {
      return this.mockData.groups.map(x => x.id)
    },
    groups_length () {
      return this.current_groups.length
    },
   
  },
  async mounted(){
    if (this.$refs.butterfly) {
      console.log(this.$refs.butterfly)
      /* this.$refs.butterfly.node.on('click', (callback) => {
        console.log(callback);
      }) */
    }
    
  },
  methods:{
    onEventListener(v) {
      console.log(v)
      if (v.type.includes('node:') && this.currentMindVueEvent === 'drag:start') {
        this.selected_node = v.node;
      }
      if (v.type.includes('group:') && this.currentMindVueEvent === 'drag:start') {
        this.selected_group = v.group;
      }
      if(v.type.includes('drag:end')){
        if(v.dragNode.nodes.length > 0 ){
          const index = this.mockData.nodes.findIndex( x => { return x.id === v.dragNode.id})
          this.mockData.nodes[index].group = v.dragNode.group;
          this.mockData.nodes[index].top = v.dragNode.top;
          this.mockData.nodes[index].left = v.dragNode.left;
          this.$refs.butterfly.nodes = this.mockData.nodes; // 라이브러리 내 지역변수 갱신시켜줌
        }
        if(v.dragGroup !== null){
          const index = this.mockData.groups.findIndex( x => { return x.id === v.dragGroup.id})
          this.mockData.groups[index].top = v.dragGroup.top;
          this.mockData.groups[index].left = v.dragGroup.left;
          this.$refs.butterfly.groups = this.mockData.groups; // 라이브러리 내 지역변수 갱신시켜줌
        }
      }
      this.currentMindVueEvent = v.type;
    },
    deleteNode() {
      if (!this.selected_node) return alert('선택된 노드가 없음')
      else {
        this.mockData.nodes = this.mockData.nodes.filter(x=> x.id !== this.selected_node.id)
        this.mockData.edges = this.mockData.edges.filter(x=> x.sourceNode !== this.selected_node.id && x.targetNode !== this.selected_node.id)
        this.$refs.butterfly.canvas.removeNode(this.selected_node.id)
        this.$refs.butterfly.edges = this.mockData.edges
        this.$refs.butterfly.nodes = this.mockData.nodes
        this.selected_node = null;
      }
    },
    deleteGroup() {
      if (!this.selected_group) return alert('선택된 그룹이 없음')
      else {
        this.mockData.groups = this.mockData.groups.filter(x=> x.id !== this.selected_group.id)
        this.$refs.butterfly.canvas.removeGroup(this.selected_group.id)
        this.$refs.butterfly.groups = this.mockData.groups
        this.selected_group = null;
      }
      console.log(this.selected_group.top)
    },
    async createNode(){
     // node 생성함수
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
      const node = {        
        id: `n-${this.nodes_length + 1}`, // index 번호 부여
        top: 50,
        left: 300,
        endpoints: endpoints,
      }
      this.mockData.nodes.push(node) // 신규 노드 함수에 추가
      this.$refs.butterfly.redraw(); // 캠퍼스 새로 그려줌
    },
    async createGroup(){
     // group 생성함수
      const group = {        
        id: `g-${this.groups_length + 1}`, // index 번호 부여
        top: 50,
        left: 300,
      }      
      this.mockData.groups.push(group) // 신규 노드 함수에 추가
      this.$refs.butterfly.redraw(); // 캠퍼스 새로 그려줌     
      console.log(group.top) 
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
