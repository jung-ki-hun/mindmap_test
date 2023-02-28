<template>
  <div class="hello"   @mousedown.right="sideMenuIsShow" @contextmenu.prevent>
    <h1>{{ msg }}</h1>
    <!-- <button @click="createNode()">add Node</button>
    <button @click="createGroup()">add Group</button>
    <input type="text" v-model="stringText"/>
    <button @click="editNode()">edit Node</button>
    <button @click="editGroup()">edit group</button>
    <button @click="deleteNode()">delete Node</button>
    <button @click="deleteGroup()">delete Group</button>     -->
    <ButterflyVue
      style="border: 1px solid;"
      :canvasData="frameData"
      ref="butterfly"
      @onOtherEvent="onEventListener"
      />
      <!-- :canvasConf="settingData" -->
      <!-- @mousedown.right="sideMenuIsShow" -->
      <!-- @contextmenu.prevent  -->
     
      
      <!-- modal -->
      <div v-if="isShowMeun" :style="contextmenu_style">
        <!-- :style="sideMenuIsShow" -->
        <ul>
          <li><button @click="createNode()">add Node</button></li><br>
          <li><button @click="createGroup()">add Group</button></li><br>
          <li><input type="text" v-model="stringText"/><button @click="editNode()">edit Node</button></li><br>
          <li><button @click="editGroup()">edit group</button></li><br>
          <li><button @click="deleteNode()">delete Node</button></li><br>
          <li><button @click="deleteGroup()">delete Group</button></li><br>
        </ul>
      </div>
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
      settingData:{
        autoFixCanvas: {     // auto expand canvas when drag nodes or edges near the edge of canvas.
        enable: true,
        autoMovePadding: [20, 20, 20, 20]
        },
      },
      isShowMeun : false,
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
          {
            id: 'n-3',
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
          id: 'n-1-n-2',
          sourceNode: 'n-1',
          targetNode: 'n-2',
          source: 'down', // 연결 포인트 위치
          target: 'up', // 대상의 연결 포인트 위치
        }]
      },// 추후 db에서 가져옴
      stringText:null,
      contextmenu_style:null,
      selected_node: null,
      selected_group: null,
      currentMindVueEvent: null,
      mousePoint:{x:null,y:null},
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
  watch:{
    async 'selected_node' (){
      if (!this.selected_node) return;
      else{
        // node dom 구조 가져오기
        // const node = document.getElementById(`bf_node_${this.selected_node.id}`).getElementsByClassName('vue-bf-node') // 선택한 노드의 엘리멘트값 가져옴
        // console.log(node);
        // node[0].style.background = `#aaaaaa`;  // 캠퍼스 화면 갱신해줌

        this.frameData.nodes.forEach(x => {
          if (x.id === this.selected_node.id) {
            document.getElementById(`bf_node_${this.selected_node.id}`).getElementsByClassName('vue-bf-node')[0].style.background = `#aaaaaa` // 선택한 노드의 엘리멘트값 가져옴
          } else {
            document.getElementById(`bf_node_${x.id}`).getElementsByClassName('vue-bf-node')[0].style.background = `#fff` // 선택한 노드의 엘리멘트값 가져옴
          }
        })
        
      }
    }
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
    this.buildUp.nodes = [{id:'n-1',value:'빌드업'},{id:'n-2',value:'자금유치'}]; // 추후 디비에서 들고오도록 수정
    if(this.buildUp.nodes.length >0) {
      for(let index= 0; index < this.buildUp.nodes.length; index ++) {
         this.designNode('',index);
         
        // this.frameData.nodes[Number(index)].render=`<div class="vue-bf-node">${this.buildUp.nodes[Number(index)].value}</div>`; // 노드 디자인 설정공간
      }
    }
    this.buildUp.groups = [{id:'g-1',value:'투자유치'}]; // 추후 디비에서 가져올 예정
    if(this.buildUp.groups.length >0) {
      for(let index= 0; index < this.buildUp.groups.length; index ++) {
         this.designGroup('',index);
        // this.frameData.groups[Number(index)].render=`<div class="vue-bf-group"><div class="vue-bf-group-header">${this.buildUp.groups[Number(index)].value}</div><div class="vue-bf-group-content"></div></div>`; // 노드 디자인 설정공간
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
        this.frameData.nodes = this.frameData.nodes.filter(x=> x.id !== this.selected_node.id)  // 노드 제거
        this.frameData.edges = this.frameData.edges.filter(x=> x.sourceNode !== this.selected_node.id && x.targetNode !== this.selected_node.id)  // 연결선 제거
        this.buildUp.nodes = this.buildUp.nodes.filter(x=> x.id !== this.selected_node.id)// 빌드업 데이터 제거
        this.$refs.butterfly.canvas.removeNode(this.selected_node.id) // 캠버스에서 제거
        this.$refs.butterfly.edges = this.frameData.edges // 라이브러리가 가지는 로컬데이터 제거
        this.$refs.butterfly.nodes = this.frameData.nodes
        this.selected_node = null;  
      }
    },
    deleteGroup() {
      if (!this.selected_group) return alert('선택된 그룹이 없음')
      else {
        this.frameData.groups = this.frameData.groups.filter(x=> x.id !== this.selected_group.id) // 그룹제거
        this.$refs.butterfly.canvas.removeGroup(this.selected_group.id) // 캠버스에서 제거
        this.$refs.butterfly.groups = this.frameData.groups // 라이브러리 로컬데이터 수정
        this.selected_group = null;
      }
      console.log(this.selected_group.top)
    },
    /**
     * 
     * @param {String} render 적용할 디자인 인덱스 코드(기본디자인 null, crm 커스텀 진행한 디자인 '', 그외 인자로 전달)
     * @param {Number} index 적용할 노드 인덱스
     * @description node 디자인 해주는 함수
     */
    designNode(render = null,index){
      console.log(render)
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

      // 순차적으로 노드 삭제 하지 않으면 노드 id값이 꼬이기 때문에 확인필요
      const node_id_check = this.current_nodes.findIndex(x=>x === `n-${this.nodes_length + 1}`)
      let disused_index = null;
      if(node_id_check !== -1 ){
        for(let i = 0; i< this.nodes_length; i++){
          const index_check = this.current_nodes.findIndex(x=>x === `n-${i + 1}`)
          if(index_check === -1){
            disused_index = i;
            break;
            }          
        }
      }
      
      const node = {        
        id: node_id_check === -1 ? `n-${this.nodes_length + 1}` : `n-${disused_index+1}`, // index 번호 부여
        top: this.mousePoint.y || 50, // TODO 마우스 좌표 확인해서 해당 포인터의 위치로 생성될수 있도록 수정필요
        left: this.mousePoint.x || 300,
        endpoints: endpoints,
        render:render,
      }
      if(render === null){ // 기본 라이브러리 디자인 사용하고 싶을경우
        return node;
      } else if (render === '') { // crm에 맞게 커스텀된 디자인 사용하고 싶을경우
        // 외부에서 render 값을 공백으로 전달시 기본값을 줌 // 추후 디자인 기획나오면 확정 디자인 적용
        node.render = `<div
        class="vue-bf-node"
        style="
          width: 100px;
          height: 25px;
          border-radius: 5px;
          background-color: #fff;
          border: 1px solid #aaa;
          text-align: center;
        ">${this.buildUp.nodes[Number(index)].value}</div>`;
        console.log(node.render);
        return this.frameData.nodes[Number(index)].render = node.render;
      } else { 
        // 외부에서 새로운 render 값을 전달해준경우 
        return this.frameData.nodes[Number(index)].render = render;
      }
    },
    /**
     * @param {String} render 
     * @param {Number} index 
     * @description group 디자인 해주는 함수
     */
    designGroup(render = null,index){

      const group_id_check = this.current_groups.findIndex(x=>x === `g-${this.groups_length + 1}`)
      let disused_index = null;
      if(group_id_check !== -1 ){
        for(let i = 0; i< this.groups_length; i++){
          const index_check = this.current_groups.findIndex(x=>x === `g-${i + 1}`)
          if(index_check === -1){
            disused_index = i;
            break;
            }
          
        }
      }

      const group = {        
        id: group_id_check === -1 ? `g-${this.groups_length + 1}` : `g-${disused_index + 1}`, // index 번호 부여
        top: this.mousePoint.y || 50, // TODO 마우스 좌표 확인해서 해당 포인터의 위치로 생성될수 있도록 수정필요
        left: this.mousePoint.x || 300,
        render:render,
      }      
      if(render === null){ // 라이브러리 기본 디자인
        return group;
      } else if (render === '') { // 커스텀한 기본 디자인
        // 외부에서 render 값을 공백으로 전달시 기본값을 줌 // 추후 디자인 기획나오면 확정 디자인 적용 인라인으로 적용해야 먹힘...ㅠㅠ
        group.render = `<div class="vue-bf-group" style="border-radius: 5px;min-width: 250px;border: 1px solid #aaa;"><div class="vue-bf-group-header" style="background-color: #0004dc;height: 30px;text-align: center;line-height: 30px;">${this.buildUp.groups[Number(index)].value}</div><div class="vue-bf-group-content" style="min-height: 120px;"></div></div>`;
        return this.frameData.groups[Number(index)].render= group.render;
      } else { 
        // 외부에서 새로운 render 값을 전달해준경우 
        return this.frameData.groups[Number(index)].render = render;
      }
    },
    async createNode(){
     // node 생성함수
    
      if (!this.selected_node) {
        // 선택된 노드가 없을경우
        console.log('1')
        this.frameData.nodes.push(this.designNode()) // 신규 노드 함수에 추가
        console.log('2')
        console.log(this.frameData.nodes)
        console.log('3')
        const nodeObjectDate = { id: this.designNode().id, value:null }
        console.log('4')
        this.buildUp.nodes.push(nodeObjectDate)//생성시 내용 데이터 저장
        console.log('5')
        this.$refs.butterfly.redraw(); // 캠퍼스 새로 그려줌
        console.log('7')
      } else {
        // 선택한 노드가 존재할경우
        // 
        const node = this.designNode(); //노드 정보 가져옴
        const edge = {
          id: `${this.selected_node.id}-${node.id}`,// '1'-'2' 꼴의 형태로 작성
          sourceNode: this.selected_node.id, // 부모노드
          targetNode: node.id, // 자식노드
          source: 'down', // 연결 포인트 위치
          target: 'up', // 대상의 연결 포인트 위치
        }
        const nodeObjectDate = { id: node.id, value:null }
        this.frameData.edges.push(edge); // 생성된 엣지값 추가
        this.frameData.nodes.push(node); // 생성된 엣지값 추가
        this.buildUp.nodes.push(nodeObjectDate)//생성시 내용 데이터 저장
        this.$refs.butterfly.redraw(); // 캠퍼스 새로 그려줌
        this.selected_node = null;
      }
    },
    async createGroup(){
     // group 생성함수
      this.frameData.groups.push(this.designGroup()) // 신규 노드 함수에 추가
      this.$refs.butterfly.redraw(); // 캠퍼스 새로 그려줌     
    },
    async editNode(){
      if (!this.selected_node) return alert('선택된 노드가 없음')
      else{
        // node dom 구조 가져오기
        const node = document.getElementById(`bf_node_${this.selected_node.id}`).getElementsByClassName('vue-bf-node') // 선택한 노드의 엘리멘트값 가져옴
        // node dom 구저 가져오기 end
        // const frameDataIndex = this.frameData.nodes.findIndex(x=> x.id===this.selected_node.id) // 프레임 데이터 들고옴 x
        const bulidupIndex = this.buildUp.nodes.findIndex(x=> x.id===this.selected_node.id) // 빌드업 데이터 들고옴
        this.buildUp.nodes[bulidupIndex] = this.textContent; // db에 저장될 값
        node[0].textContent = this.stringText;  // 캠퍼스 화면 갱신해줌
        this.textContent = null; // input 내용비워줌
      }
    }, // 노드 화면에 부착용
    async editGroup(){
      if (!this.selected_group) return alert('선택된 그룹이 없음')
      else{
        // group dom 구조 가져오기 
        const group = document.getElementById(`bf_group_${this.selected_group.id}`).getElementsByClassName('vue-bf-group-header') // 선택한 노드의 엘리멘트값 가져옴
        // group dom 구조 가져오기 end
        console.log(group)
        const bulidupIndex = this.buildUp.groups.findIndex(x=> x.id===this.selected_group.id)
        this.buildUp.groups[bulidupIndex] = this.textContent; // db에 저장될 값
        group[0].textContent = this.stringText;  // 캠퍼스 화면 갱신해줌
        this.textContent = null; // input 내용비워줌
      }
    }, // 그룹 화면에 부착용
    async sideMenuIsShow(e) {
      this.isShowMeun = !this.isShowMeun;
      console.log(e)
      let point = {
        x:e.pageX,
        y:e.pageY
      }
    
      console.log(point)
      this.contextmenu_style = `position:absolute;left:${point.x}px;top:${point.y}px;z-index:99999`
      // if(!this.isShowMeun){ // 우클릭 메뉴 창 닫기시 기존 포인터 값 제거
      //   this.mousePoint.x = null;
      //   this.mousePoint.y = null;
      // } else {  // TODO 좌표값 변경 필요함
        this.mousePoint.x = e.layerX;//point.x;//e.screenX;
        this.mousePoint.y = e.layerY;//point.y;//e.screenY;
      // }
      console.log(this.mousePoint)
    }
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
.contextmenu {
  display: none;
  position: absolute;
  width: 200px;
  margin: 0;
  padding: 0;
  background: #FFFFFF;
  border-radius: 5px;
  list-style: none;
  box-shadow:
    0 15px 35px rgba(50,50,90,0.1),
    0 5px 15px rgba(0,0,0,0.07);
  overflow: hidden;
  z-index: 999999;
}
.vue-bf-group-header{
  background-color: #0004dc;
}
</style>
