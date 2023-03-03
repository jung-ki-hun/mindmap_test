<template>
  <div
    class="hello"
    @mousedown.right="sideMenuIsShow"
    @contextmenu.prevent
  >
    <h1>{{ msg }}</h1>
    <!-- <button @click="createNode()">add Node</button>
    <button @click="createGroup()">add Group</button>
    <input type="text" v-model="stringText"/>
    <button @click="editNode()">edit Node</button>
    <button @click="editGroup()">edit group</button>
    <button @click="deleteNode()">delete Node</button>
    <button @click="deleteGroup()">delete Group</button>     -->
    <ButterflyVue
      ref="butterfly"
      style="border: 1px solid;"
      :canvas-data="frameData" 
      :canvas-conf="settingData"
      @onOtherEvent="onEventListener"
      />
      <!-- @mousedown.right="sideMenuIsShow" -->
      <!-- :canvas-conf="settingData" -->
    <!-- @contextmenu.prevent  -->

    <!-- modal -->
    <div
      v-if="isShowMeun"
      :style="contextmenu_style"
    >
      <!-- :style="sideMenuIsShow" -->
      <ul>
        <li>
          <button @click="createNode()">
            add Node
          </button>
        </li><br>
        <li>
          <button @click="createGroup()">
            add Group
          </button>
        </li><br>
        <li>
          <input
            v-model="stringText"
            type="text"
            placeholder="이름을 입력해주세요"
          /><br>
          <button @click="editNameNode()">
            edit Node
          </button>
        </li><br>
        <li>
         node 글자 크기
        </li><br>
        <li>
          <button @click="editFontSizeNode('down')">
            t</button>
          <button @click="editFontSizeNode('up')">
            T</button>
        </li><br>
        <li>
          group 글자 크기
        </li><br>
        <li>
          <button @click="editFontSizeNode('down')">
            t</button>
          <button @click="editFontSizeNode('up')">
            T</button>
        </li><br>
        <li>
          group 크기
        </li><br>
        <li>
          <button @click="editFontSizeNode('down')">
            s</button>
          <button @click="editFontSizeNode('up')">
            m</button>
          <button @click="editFontSizeNode('down')">
            l</button>      
        </li><br>
        <li>
          <button @click="editGroup()">
            edit group
          </button>
        </li><br>
        <li>
          <button @click="deleteNode()">
            delete Node
          </button>
        </li><br>
        <li>
          <button @click="deleteGroup()">
            delete Group
          </button>
        </li><br>
      </ul>
    </div>
  </div>
</template>

<script>
import { ButterflyVue } from 'butterfly-vue'
export default {
  name: 'MindMap',
  components: {
    ButterflyVue
  },
  props: {
    msg:
    {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      buildUp: {
        groups: [],
        nodes: [],
      },
      settingData: {
        // autoFixCanvas: { // auto expand canvas when drag nodes or edges near the edge of canvas.
        //   enable: true,
        //   autoMovePadding: [20, 20, 20, 20]
        // }
        // root: dom,               // canvas root dom (require)
        // layout: {type: 'ForceLayout', options: {}},   // layout setting , integrated or custom , (optional)
        // layoutOptions: {rankdir: 'TB'}, // layout options(optional)
        zoomable: true,          // enable zoom canvas (optional)
        moveable: true,          // enable move canvas (optional)
        draggable: true,         // enable drag nodes (optional)
        linkable: true,          // enable connect edges (optional)
        disLinkable: true,       // enable disConnect edges (optional)
        // layout: {},              // initialize auto layout (optional)
        theme: {                 // theme (optional) 
          group: {
            type: 'normal',       // Node group type: normal (drag in and drag out), inner (can only be dragged in and not out)
            dragGroupZIndex: 50  // Node group z-index: (optional, Default:50)
          },
          node: {
            dragNodeZIndex: 250  //node z-index/2 (optional, Default:250)
          },
          edge: {
            type: 'endpoint',    // edge connection type
            shapeType: 'AdvancedBezier', // edge type：Bezier curve，Polyline ，Straight，Manhattan line，Improved Bezier curve。values ： Bezier/Flow/Straight/Manhattan/AdvancedBezier
            hasRadius: false ,   //the rounded corners of the Manhattan Curve: true represents having rounded corners,false represents having right angle. Default value false
            label: '연결선',       // edge label
            arrow: true,         // whether to show arrow
            arrowPosition: 0.5,  // arrow position (0 ~ 1)
            arrowOffset: 0.0,    // arrow offset
            // arrowShapeType: '',  // custom arrow style
            // Class: XXClass,      // custom Class
            isExpandWidth: false,// expand line interaction area
            defaultAnimate: false,// turn on line animation by default
            dragEdgeZindex: 499  // edge z-index (optional, Default:490)
          },
          // endpoint: {
          //   position: [],        // limit endpoint position ['Top', 'Bottom', 'Left', 'Right'],
          //   linkableHighlight: true,// point.linkable method is triggered when connecting, can be highlighted
          //   limitNum: 10,        // limit the number of anchor connections
          //   expandArea: {        // when the anchor point is too small, the connection hot zone can be expanded.
          //     left: 10,
          //     right: 10,
          //     top: 10,
          //     botton: 10
          //   }
          // },
          zoomGap: 0.001,       // mouse zoom in and out gap settings
          autoFixCanvas: {     // auto expand canvas when drag nodes or edges near the edge of canvas.
            enable: true,
            autoMovePadding: [20, 20, 20, 20]
          },
          autoResizeRootSize: true // automatically adapt to the root size, the default is true
        },
        global: {                // custom configuration, will run through all canvas, group, node, edge, endpoint objects
          isScopeStrict: false   // whether scope is strict mode (default is false)
        }
      },// 초기 마인드맵 설정 모음
      isShowMeun: false,
      frameData: {
        groups: [
          // {
          //   id: 'g-1',
          //   left: 10,
          //   top: 20
          // }
        ],
        nodes: [
          {
            id: 'n-1',
            top: 200,
            left: 1000,
            render: null, //
            endpoints: [
              {
                id: 'right', // 구분용 id 값 // 식별하기 편한걸로 진행하면 하면됨
                orientation: [1, 0], // x 축값
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
            ]
          },
          {
            id: 'n-2',
            top: 100,
            left: 1000,
            render: null, //
            endpoints: [
              {
                id: 'right', // 구분용 id 값 // 식별하기 편한걸로 진행하면 하면됨
                orientation: [1, 0], // x 축값
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
            ]
          },
        ],
        edges: [
          {
          id: 'n-1-n-2',
          sourceNode: 'n-1',
          targetNode: 'n-2',
          source: 'down', // 연결 포인트 위치
          target: 'up', // 대상의 연결 포인트 위치
          shapeType:'AdvancedBezier'
        }
      ]
      }, // 추후 db에서 가져옴
      stringText: null,
      contextmenu_style: null,
      selected_node: null,
      selected_group: null,
      currentMindVueEvent: null,
      mousePoint: { x: null, y: null }
    }
  },
  computed: {
    current_nodes () {
      return this.frameData.nodes.map(x => x.id)
    },
    nodes_length () {
      return this.current_nodes.length
    },
    current_groups () {
      return this.frameData.groups.map(x => x.id)
    },
    groups_length () {
      return this.current_groups.length
    }
  },
  watch: {
    async 'selected_node' () {
      if (!this.selected_node) {
        this.frameData.nodes.forEach(x => {
            document.getElementById(`bf_node_${x.id}`).getElementsByClassName('vue-bf-node')[0].style.background = '#fff' // 선택한 노드의 엘리멘트값 가져옴
          })
      }
      else {
        // node dom 구조 가져오기
        // const node = document.getElementById(`bf_node_${this.selected_node.id}`).getElementsByClassName('vue-bf-node') // 선택한 노드의 엘리멘트값 가져옴
        // console.log(node);
        // node[0].style.background = `#aaaaaa`;  // 캠퍼스 화면 갱신해줌

        this.frameData.nodes.forEach(x => {
          if (x.id === this.selected_node.id) {
            document.getElementById(`bf_node_${this.selected_node.id}`).getElementsByClassName('vue-bf-node')[0].style.background = '#aaaaaa' // 선택한 노드의 엘리멘트값 가져옴
          } else {
            document.getElementById(`bf_node_${x.id}`).getElementsByClassName('vue-bf-node')[0].style.background = '#fff' // 선택한 노드의 엘리멘트값 가져옴
          }
        })
      }
    }
  },
  async mounted () {
    if (this.$refs.butterfly) {
      console.log(this.$refs.butterfly)
      /* this.$refs.butterfly.node.on('click', (callback) => {
        console.log(callback);
      }) */
    }
  },
  async created () {
    // render에 입력되는 div string 값이 변경되면 아래 edit 부분도 수정이 필요함
    this.buildUp.nodes = [{ id: 'n-1', value: '프로젝트',font_size: 20},{ id: 'n-2', value: 'node',font_size: 20 }] // 추후 디비에서 들고오도록 수정
    if (this.buildUp.nodes.length > 0) {
      for (let index = 0; index < this.buildUp.nodes.length; index++) {
        this.designNode('', index)

        // this.frameData.nodes[Number(index)].render=`<div class="vue-bf-node">${this.buildUp.nodes[Number(index)].value}</div>`; // 노드 디자인 설정공간
      }
    }
    // this.buildUp.groups = [{ id: 'g-1', value: '투자유치' }] // 추후 디비에서 가져올 예정
    if (this.buildUp.groups.length > 0) {
      for (let index = 0; index < this.buildUp.groups.length; index++) {
        this.designGroup('', index)
        // this.frameData.groups[Number(index)].render=`<div class="vue-bf-group"><div class="vue-bf-group-header">${this.buildUp.groups[Number(index)].value}</div><div class="vue-bf-group-content"></div></div>`; // 노드 디자인 설정공간
      }
    }
  },
  methods: {
    onEventListener (v) {
      console.log(v)
      if (v.type.includes('node:') && this.currentMindVueEvent === 'drag:start') {
        this.selected_node = this.selected_node === null ? v.node : null
      }
      if (v.type.includes('group:') && this.currentMindVueEvent === 'drag:start') {
        this.selected_group = v.group
      }
      if (v.type.includes('drag:end')) {
        if (v.dragNode?.nodes?.length < 0) {
          const index = this.frameData.nodes.findIndex(x => { return x.id === v.dragNode.id })
          this.frameData.nodes[index].group = v.dragGroup.id
          this.frameData.nodes[index].top = v.dragNode.top
          this.frameData.nodes[index].left = v.dragNode.left
          this.$refs.butterfly.nodes = this.frameData.nodes // 라이브러리 내 지역변수 갱신시켜줌
        }
        if (v.dragGroup !== null) {
          const index = this.frameData.groups.findIndex(x => { return x.id === v.dragGroup.id })
          this.frameData.groups[index].top = v.dragGroup.top
          this.frameData.groups[index].left = v.dragGroup.left
          this.$refs.butterfly.groups = this.frameData.groups // 라이브러리 내 지역변수 갱신시켜줌
        }// 그룹이동
      }
      this.currentMindVueEvent = v.type
    },
    deleteNode () {
      if (!this.selected_node) return alert('선택된 노드가 없음')
      else {
        this.frameData.nodes = this.frameData.nodes.filter(x => x.id !== this.selected_node.id) // 노드 제거
        this.frameData.edges = this.frameData.edges.filter(x => x.sourceNode !== this.selected_node.id && x.targetNode !== this.selected_node.id) // 연결선 제거
        this.buildUp.nodes = this.buildUp.nodes.filter(x => x.id !== this.selected_node.id)// 빌드업 데이터 제거
        this.$refs.butterfly.canvas.removeNode(this.selected_node.id) // 캠버스에서 제거
        this.$refs.butterfly.edges = this.frameData.edges // 라이브러리가 가지는 로컬데이터 제거
        this.$refs.butterfly.nodes = this.frameData.nodes
        this.selected_node = null
      }
    },
    deleteGroup () {
      if (!this.selected_group) return alert('선택된 그룹이 없음')
      else {
        this.frameData.groups = this.frameData.groups.filter(x => x.id !== this.selected_group.id) // 그룹제거
        this.$refs.butterfly.canvas.removeGroup(this.selected_group.id) // 캠버스에서 제거
        this.$refs.butterfly.groups = this.frameData.groups // 라이브러리 로컬데이터 수정
        this.selected_group = null
      }
    },
    /**
     *
     * @param {String} render 적용할 디자인 인덱스 코드(기본디자인 null, crm 커스텀 진행한 디자인 '', 그외 인자로 전달)
     * @param {Number} index 적용할 노드 인덱스
     * @description node 디자인 적용시키는 함수
     */
    designNode (render = null, index = null) {
      console.log(render)
      const endpoints = [
        {
          id: 'right', // 구분용 id 값 // 식별하기 편한걸로 진행하면 하면됨
          orientation: [1, 0], // x 축값
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
      ]// 연결점 위치

      // 순차적으로 노드 삭제 하지 않으면 노드 id값이 꼬이기 때문에 확인필요
      const node_id_check = this.current_nodes.findIndex(x => x === `n-${this.nodes_length + 1}`)
      let disused_index = null
      if (node_id_check !== -1) {
        for (let i = 0; i < this.nodes_length; i++) {
          const index_check = this.current_nodes.findIndex(x => x === `n-${i + 1}`)
          if (index_check === -1) {
            disused_index = i
            break
          }
        }
      }
      let node = {
        id: node_id_check === -1 ? `n-${this.nodes_length + 1}` : `n-${disused_index + 1}`, // index 번호 부여
        top: this.mousePoint.y || 50, // TODO 마우스 좌표 확인해서 해당 포인터의 위치로 생성될수 있도록 수정필요
        left: this.mousePoint.x || 300,
        endpoints: endpoints,
        render: render
      }
      if (render === null) { // 기본 라이브러리 디자인 사용하고 싶을경우
        return node
      } else if (render === '' && index !== null) { // crm에 맞게 커스텀된 디자인으로 db에 값에 따라 디자인 적용하려할때
        // fix css node
        node.render = `<div
        class="vue-bf-node"
        style="
          width: auto;
          height: auto;
          border-radius: 5px;
          background-color: #fff;
          border: 1px solid #aaa;
          text-align: center;
          padding-top: 5px;
          padding-right: 5px;
          padding-bottom: 5px;
          padding-left: 5px;
          font-size: ${this.buildUp.nodes[Number(index)].font_size}px;
        ">${this.buildUp.nodes[Number(index)].value}</div>`
        // 노드 css 적용위치
        console.log(`dd : ${this.buildUp.nodes[Number(index)].font_size}`)
        this.frameData.nodes[Number(index)].render = node.render // 따로 create 함수를 타지 않고 바로 처리 하기 위해서
        return node;
      } else if(render === '' && index === null) { // 커스텀한 노드디자인으로 새로운 노드를 생성하려 할때(db에 없는 값)
        // fix css node
        node.render = `<div
        class="vue-bf-node"
        style="
          width: auto;
          height: auto;
          border-radius: 5px;
          background-color: #fff;
          border: 1px solid #aaa;
          text-align: center;
          padding-top: 5px;
          padding-right: 5px;
          padding-bottom: 5px;
          padding-left: 5px;
          font-size: 20px;
        ">node Id : ${node.id}</div>`
        // 노드 css 적용위치
        return node
      } else {
        // 외부에서 새로운 render 값을 전달해준경우
        node.render = render;// 유저가 함수호출 시 css값을 전달하여 변경시 
        this.frameData.nodes[Number(index)].render = render
        return node
      }
    },
    /**
     * @param {String} render
     * @param {Number} index
     * @description group 디자인 해주는 함수
     */
    designGroup (render = null, index) {
      const group_id_check = this.current_groups.findIndex(x => x === `g-${this.groups_length + 1}`)
      let disused_index = null
      if (group_id_check !== -1) {
        for (let i = 0; i < this.groups_length; i++) {
          const index_check = this.current_groups.findIndex(x => x === `g-${i + 1}`)
          if (index_check === -1) {
            disused_index = i
            break
          }
        }
      }

      const group = {
        id: group_id_check === -1 ? `g-${this.groups_length + 1}` : `g-${disused_index + 1}`, // index 번호 부여
        top: this.mousePoint.y || 50, // TODO 마우스 좌표 확인해서 해당 포인터의 위치로 생성될수 있도록 수정필요
        left: this.mousePoint.x || 300,
        render: render
      }
      if (render === null) { // 라이브러리 기본 디자인
        return group
      } else if (render === '' && index !== null ) { // 커스텀한 기본 디자인에 따라 db에 있는 값을 .
        // 외부에서 render 값을 공백으로 전달시 기본값을 줌 // 추후 디자인 기획나오면 확정 디자인 적용 인라인으로 적용해야 먹힘...ㅠㅠ
        group.render = `<div
          class="vue-bf-group"
          style="border-radius: 5px;
          min-width: 250px;
          border: 1px solid #aaa;">
          <div 
          class="vue-bf-group-header"
          style="background-color: #0004dc;
          height: 30px;
          text-align: center;
          line-height: 30px;">
          ${this.buildUp.groups[Number(index)].value}</div>
          <div class="vue-bf-group-content"
          style="min-height: 120px;">
          </div>
        </div>`
        return this.frameData.groups[Number(index)].render = group.render
      } else {
        // 외부에서 새로운 render 값을 전달해준경우
        return this.frameData.groups[Number(index)].render = render
      }
    },
    /**    
     * @description node 추가해주는 함수
     */
    async createNode () {
      if (!this.selected_node) {
        // 선택된 노드가 없을경우
        const designNode = this.designNode('')        
        const nodeObjectDate = { id: designNode.id, value: `node Id : ${designNode.id}`,font_size:16 }
        this.frameData.nodes.push(designNode) // 신규 노드 함수에 추가
        this.buildUp.nodes.push(nodeObjectDate)// 생성시 내용 데이터 저장
        // this.$refs.butterfly.redraw() // 캠퍼스 새로 그려줌 -> 함수로 이동 시킬예정
        this.redrawCanvas() // 화면 다시 그려주는 함수
      } else {
        // 선택한 노드가 존재할경우
        const designNode = this.designNode('') // 노드 정보 가져옴
        const edge = {
          id: `${this.selected_node.id}-${designNode.id}`, // '1'-'2' 꼴의 형태로 작성
          sourceNode: this.selected_node.id, // 부모노드
          targetNode: designNode.id, // 자식노드
          source: 'down', // 연결 포인트 위치
          target: 'up' // 대상의 연결 포인트 위치
        }
        const nodeObjectDate = { id: designNode.id, value: `node Id : ${designNode.id}`,font_size:16 }
        this.frameData.edges.push(edge) // 생성된 엣지값 추가
        this.frameData.nodes.push(designNode) // 생성된 엣지값 추가
        this.buildUp.nodes.push(nodeObjectDate)// 생성시 내용 데이터 저장
        // this.$refs.butterfly.redraw() // 캠퍼스 새로 그려줌 -> 함수로 이동시킬 예정
        this.redrawCanvas() // 화면 다시 그려주는 함수
        this.selected_node = null
      }
    },
    async createGroup () {
      // group 생성함수
      this.frameData.groups.push(this.designGroup()) // 신규 노드 함수에 추가
      this.$refs.butterfly.redraw() // 캠퍼스 새로 그려줌
    },
    async editNameNode () {
      // node 이름 변경함수
      if (!this.selected_node) return alert('선택된 노드가 없음')
      else  {
        const node = document.getElementById(`bf_node_${this.selected_node.id}`).getElementsByClassName('vue-bf-node')// node dom 구조 가져오기// 선택한 노드의 엘리멘트값 가져옴
        const bulidupIndex = this.buildUp.nodes.findIndex(x => x.id === this.selected_node.id) // 빌드업 데이터 들고옴
        if(bulidupIndex === -1 ) return alert('오류발생');
        this.buildUp.nodes[bulidupIndex].value = this.stringText // db에 저장될 값
        node[0].textContent = this.stringText // 캠퍼스 화면 갱신해줌
        this.stringText = null // input 내용비워줌
        console.log(node)
      }       
    }, 
    async editFontSizeNode (type) {
      // node 글자 크기 변경
      if (!this.selected_node) return alert('선택된 노드가 없음')
      else  {
        const node = document.getElementById(`bf_node_${this.selected_node.id}`).getElementsByClassName('vue-bf-node')// node dom 구조 가져오기// 선택한 노드의 엘리멘트값 가져옴
        const bulidupIndex = this.buildUp.nodes.findIndex(x => x.id === this.selected_node.id) // 빌드업 데이터 들고옴
        if(bulidupIndex === -1 ) return alert('오류발생');
        if(type === 'up'){
          let font_size = this.buildUp.nodes[bulidupIndex].font_size + 2;
          this.buildUp.nodes[bulidupIndex].font_size = font_size; // db에 저장될 값
          node[0].style.fontSize= `${font_size}px`;
        }
        else {
          let font_size = this.buildUp.nodes[bulidupIndex].font_size - 2;          
          if(font_size < 10) {return;}
          this.buildUp.nodes[bulidupIndex].font_size = font_size; // db에 저장될 값
          node[0].style.fontSize= `${font_size}px`;
        }
      }       
    }, 
    async editGroup () {
      if (!this.selected_group) return alert('선택된 그룹이 없음')
      else {
        // group dom 구조 가져오기
        const group = document.getElementById(`bf_group_${this.selected_group.id}`).getElementsByClassName('vue-bf-group-header') // 선택한 노드의 엘리멘트값 가져옴
        // group dom 구조 가져오기 end
        console.log(group)
        const bulidupIndex = this.buildUp.groups.findIndex(x => x.id === this.selected_group.id)
        this.buildUp.groups[bulidupIndex] = this.stringText // db에 저장될 값
        group[0].textContent = this.stringText // 캠퍼스 화면 갱신해줌
        this.stringText = null // input 내용비워줌
      }
    }, // 그룹 화면에 부착용
    async redrawCanvas () {
      // 캠퍼스 새로 그려주는 함수
      this.$refs.butterfly.redraw() // 캠퍼스 새로 그려줌
      this.buildUp.nodes.forEach((value) => {
        const node = document.getElementById(`bf_node_${value.id}`).getElementsByClassName('vue-bf-node')// node dom 구조 가져오기
        node[0].textContent  = value.value // 저장되어 있던 이름 적용
        node[0].style.fontSize= `${value.font_size}px`; //저장되어 있던 폰트 사이즈 적용
      })
      // 캠퍼스 redraw 함수 실행
    },// 화면 새로 그려줌
    async sideMenuIsShow (e) {
      // 우클릭시 메뉴 호출 관련 함수
      this.isShowMeun = !this.isShowMeun
      const point = {
        x: e.pageX,
        y: e.pageY
      }
      // fix css 우클릭 메뉴
      this.contextmenu_style = `position:absolute;left:${point.x}px;top:${point.y}px;z-index:99999` //메뉴 기본 css // 필요시 해당 위치에 추가
      this.mousePoint.x = e.layerX
      this.mousePoint.y = e.layerY // 마우스 좌표 저장 -> 노드 생성시 부여하기 위해서
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
