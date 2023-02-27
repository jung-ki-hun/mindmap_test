<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="createNode()">add Node</button>
    <button @click="createGroup()">add Group</button>
    <input type="text" v-model="stringText"/>
    <button @click="editNode()">edit Node</button>
    <button @click="editGroup()">edit group</button>
    <button @click="deleteNode()">delete Node</button>
    <button @click="deleteGroup()">delete Group</button>    
    <ButterflyVue
    style="border: 1px solid ;"
      :canvasData="frameData"
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
      buildUp:{
        groups:null,
        nodes:null,
      },
      frameData: {
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
            render:null,//
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
      stringText:null,
      selected_node: null,
      selected_group: null,
      currentMindVueEvent: null
    }
  },
  computed: {
    current_nodes() {
      return this.frameData.nodes.map(x => x.id)
    },
    nodes_length () {
      return this.current_nodes.length
    },
    current_groups() {
      return this.frameData.groups.map(x => x.id)
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
  async created(){
    // render에 입력되는 div string 값이 변경되면 아래 edit 부분도 수정이 필요함
    this.buildUp.nodes = [{id:'n-1',value:'rlgnsWkdWkd123'},{id:'n-2',value:'rlgnsWkdWkd234'}]; // 추후 디비에서 들고오도록 수정
    if(this.buildUp.nodes.length >0) {
      for(let index= 0; index < this.buildUp.nodes.length; index ++) {
        this.frameData.nodes[Number(index)].render=`<div class="vue-bf-node">${this.buildUp.nodes[Number(index)].value}</div>`; // 노드 디자인 설정공간
      }
    }
    this.buildUp.groups = [{id:'g-1',value:'rlgnsWkdWkd123'},{id:'g-2',value:'rlgnsWkdWkd234'}]; // 추후 디비에서 가져올 예정
    if(this.buildUp.groups.length >0) {
      for(let index= 0; index < this.buildUp.groups.length; index ++) {
        this.frameData.groups[Number(index)].render=`<div class="vue-bf-group">
          <div class="vue-bf-group-header">${this.buildUp.groups[Number(index)].value}</div>
          <div class="vue-bf-group-content"></div>
        </div>`; // 노드 디자인 설정공간
      }
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
        if(v.dragNode?.nodes?.length < 0){
          const index = this.frameData.nodes.findIndex( x => { return x.id === v.dragNode.id})
          this.frameData.nodes[index].group = v.dragGroup.id;
          this.frameData.nodes[index].top = v.dragNode.top;
          this.frameData.nodes[index].left = v.dragNode.left;
          this.$refs.butterfly.nodes = this.frameData.nodes; // 라이브러리 내 지역변수 갱신시켜줌
        }
        if(v.dragGroup !== null){
          const index = this.frameData.groups.findIndex( x => { return x.id === v.dragGroup.id})
          this.frameData.groups[index].top = v.dragGroup.top;
          this.frameData.groups[index].left = v.dragGroup.left;
          this.$refs.butterfly.groups = this.frameData.groups; // 라이브러리 내 지역변수 갱신시켜줌
        }// 그룹이동
      }
      this.currentMindVueEvent = v.type;
    },
    deleteNode() {
      if (!this.selected_node) return alert('선택된 노드가 없음')
      else {
        this.frameData.nodes = this.frameData.nodes.filter(x=> x.id !== this.selected_node.id)
        this.frameData.edges = this.frameData.edges.filter(x=> x.sourceNode !== this.selected_node.id && x.targetNode !== this.selected_node.id)
        this.$refs.butterfly.canvas.removeNode(this.selected_node.id)
        this.$refs.butterfly.edges = this.frameData.edges
        this.$refs.butterfly.nodes = this.frameData.nodes
        this.selected_node = null;
      }
    },
    deleteGroup() {
      if (!this.selected_group) return alert('선택된 그룹이 없음')
      else {
        this.frameData.groups = this.frameData.groups.filter(x=> x.id !== this.selected_group.id)
        this.$refs.butterfly.canvas.removeGroup(this.selected_group.id)
        this.$refs.butterfly.groups = this.frameData.groups
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
      this.frameData.nodes.push(node) // 신규 노드 함수에 추가
      this.$refs.butterfly.redraw(); // 캠퍼스 새로 그려줌
    },
    async createGroup(){
     // group 생성함수
      const group = {        
        id: `g-${this.groups_length + 1}`, // index 번호 부여
        top: 50,
        left: 300,
      }      
      this.frameData.groups.push(group) // 신규 노드 함수에 추가
      this.$refs.butterfly.redraw(); // 캠퍼스 새로 그려줌     
      console.log(group.top) 
    },
    async editNode(){
      if (!this.selected_node) return alert('선택된 노드가 없음')
      else{
        // node dom 구조 가져오기
        const node = document.getElementById(`bf_node_${this.selected_node.id}`).getElementsByClassName('vue-bf-node') // 선택한 노드의 엘리멘트값 가져옴
        // node dom 구저 가져오기 end
        console.log(node)
        const index = this.frameData.nodes.findIndex(x=> x.id===this.selected_node.id)
        console.log(index)
        this.buildUp.nodes[index] = this.textContent; // db에 저장될 값
        node[0].textContent = this.stringText;  // 캠퍼스 화면 갱신해줌
      }
    }, 
    async editGroup(){
      if (!this.selected_group) return alert('선택된 그룹이 없음')
      else{
        // group dom 구조 가져오기 
        const group = document.getElementById(`bf_group_${this.selected_group.id}`).getElementsByClassName('vue-bf-group-header') // 선택한 노드의 엘리멘트값 가져옴
        // group dom 구조 가져오기 end
        console.log(group)
        const index = this.frameData.groups.findIndex(x=> x.id===this.selected_group.id)
        this.buildUp.groups[index] = this.textContent; // db에 저장될 값
        group[0].textContent = this.stringText;  // 캠퍼스 화면 갱신해줌
      }
    }, 
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component osnly -->
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
