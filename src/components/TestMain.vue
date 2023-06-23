<template>
  <div class="row">
  <button @click="updateViewTime();"> sdf </button>
    <!-- title -->
    <!-- <div class="col-xl-12">
      <div class="d-flex-between title-btn-bar">
        <h5 class="font-weight-bold mb-4">
          테스트
        </h5>
      </div>
    </div> -->
    <!-- End title -->

    <!-- Contents -->
    <!-- <div class="col-xl-12">
      <div class="card">
        <div class="card-body">
          <div>
            <div>
              {{ currentPage }} / {{ pageCount }}
            </div>
            <div>
              <button @click="currentPage--">
                Prev
              </button>
              <button @click="currentPage++">
                Next
              </button>
            </div>
            <pdf
              src="/assets/pdf/startup1.pdf"
              :page="currentPage"
              @num-pages="pageCount = $event"
              @page-loaded="currentPage = $event"
            ></pdf>
          </div>
        </div>
      </div>
    </div> -->
    <div class="col-xl-12">
      <div class="row">
        <div class="col-xl-12">
          <span
            v-for=" (time, i) in pageTime"
            :key="i"
            class="col-xl-3"
          > {{ i + '페이지 : ' +Math.floor( time.totalTimeOn /1000 ) }}초  </span>
        </div>
      </div>

      <div class="row">
        <div class="col-xl-12">
          <input
            :id="idConfig.pageNumber"
            type="number"
          />
          <span> currPage: {{ pageNumber + ' ' }} </span>
          <span :id="idConfig.numPages" />
        </div>
      </div>
      <!-- 차트 start -->
      <div class="row">
        <div class="col-xl-12">
          <apexcharts
            width="100%"
            height="250"
            type="bar"
            :options="chartOptions"
            :series="series"
          ></apexcharts>
        </div>
      </div>
      <!-- 차트 end -->
      <!-- VUE PDF -->
      <div class="row mt-2">
        <div class="col-xl-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div
                  class="col"
                  style="height: 78vh"
                >
                  <vue-pdf-app
                    :id-config="idConfig"
                    pdf="/assets/pdf/test_sample.pdf"
                    @pages-rendered="pagesRenderedHandler"
                  ></vue-pdf-app>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- VUE PDF END -->
    </div>
    <!-- End Contents -->
    <div>
      <b-modal
        id="modal_waring"
        ref="modal_waring"
        title="경고"
        hide-footer
      >
        <p class="my-4">
          5분간 활동이 없습니다. 1분후 이전페이지로 이동 하겠습니다.
        </p>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="$bvModal.hide('modal_waring')"
          >
            닫기
          </button>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
// import pdf from 'vue-pdf'
// import { useWindowFocus } from '@vueuse/core'
// const focused = useWindowFocus()
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'TestMain',
  components: {
    // pdf
    apexcharts: VueApexCharts
  },
  data () {
    return {
      pdfApp: null,
      pageNumber: 1,
      viewType: 'on',
      scrollListner: null,
      readingState: {
        totalTime: 0,
        times: [{
          type: 'on',
          start_dt: null,
          end_dt: null
        }]
      },
      pageStayingTimes: [],
      idConfig: {
        pageNumber: 'viewerPageNumber',
        numPages: 'viewNumPages'
      },
      series: [{
        name: '활성시간',
        data: [0]
      },
      {
        name: '비활성시간',
        data: [0]
      }],
      isShow: false,
      chartOptions: {
        chart: {
          type: 'bar',
          height: 300
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '5%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          tickAmount: 5,
          forceNiceScale: true,
          title: {
            text: ''
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + '초'
            }
          }
        }
      }, // CHART 설정
      timeCount: 0 // 5분 체크용
    }
  },
  computed: {
    pageTime () {
      for (const item of this.pageStayingTimes) {
        let totalTimeOn = 0; let totalTimeOff = 0
        for (const { start_dt, end_dt, type } of item.times) {
          if (end_dt && type === 'on') {
            totalTimeOn += (end_dt - start_dt)
          } else if (end_dt && type === 'off') {
            totalTimeOff += (end_dt - start_dt)
          }
        }
        item.totalTimeOff = totalTimeOff
        item.totalTimeOn = totalTimeOn
      }
      return this.pageStayingTimes
    }
  },
  watch: {
    pageTime () {
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          categories: this.pageTime.map((item, i) => i + 1)
        }
      }
      this.series[0].data = this.pageTime.map(item => Math.floor(item.totalTimeOn / 1000))
      this.series[1].data = this.pageTime.map(item => Math.floor(item.totalTimeOff / 1000))
    }
  },
  async created () {


    await this.getViewTime()
    // this.scrollListner = this._.throttle( ()=>{

    //     // this.setPageStayingInfo('on')
    //       // console.log('debounced')
    //   }, 750)

    // window.addEventListener('focusout', (event) => {
    //   console.log('focus out', event)
    //   this.viewType = 'off'
    //   // this.setPageStayingInfo('off')
    // })
    //  window.addEventListener('focus', (event) => {
    //   console.log('focus ', event)
    //   this.viewType = 'off'
    //   // this.setPageStayingInfo('off')
    // })
    // await this.loadStatisticsData() // 기존 데이터
    setInterval(() => {
      this.checkTimer5minute()
    }, 1000) // 1초마다 돌아가는 타이머
    document.addEventListener('mouseleave', (e) => {
      // 현재페이지 on마감 및 off 카운팅 시작
      this.setPageStayingInfo(this.pageNumber, 'end')
      this.viewType = 'off'
      this.setPageStayingInfo(this.pageNumber, 'start')
      // console.log('mouseleave', e)
    })// 마우스 영역밖으로 벗어남
    document.addEventListener('mouseenter', (e) => {
      this.setPageStayingInfo(this.pageNumber, 'end')
      this.viewType = 'on'
      this.setPageStayingInfo(this.pageNumber, 'start')
      // console.log('mouseenter', e)
    })// 마우스 영역 안으로 들어옴
    document.addEventListener('mousemove', (e) => {
      this.timeCount = 0
    })// 마우스 움직임이 발생하면 5분 카운트 초기화

    window.addEventListener('focus', this.scrollListner)
    // document.addEventListener('scroll',this.scrollListner)
  },
  beforeDestroy () {
    // this.storingStatisticsDateInDB()// 디비에 저장

    console.log('rrrrrrrrrrr')
  },
  methods: {
    async getViewTime(){
       const data = await this.$axios
          .get('/crm/v3/proj_files/get_viewtime', { viewing_time :this.pageStayingTimes  })
          .then((res) => res.data)
          console.log('data' , data.query[0].viewing_time)
          this.pageStayingTimes = data.query[0].viewing_time
    },
    async updateViewTime(){
       const data = await this.$axios
          .put('/crm/v3/proj_files/update_viewtime', { viewing_time :this.pageStayingTimes  })
          .then((res) => res.data)
          console.log('data' , data)

    },

    // async loadStatisticsData () {
    //   try {
    //     const params = this.paginateParams({
    //       user_no: this.user?.user_no,
    //       code: this.$route.query.code
    //     }, this.pagination)

    //     const data = await this.$axios
    //       .get('/crm/v1/client/partner_notice', { params })
    //       .then((res) => res.data)
    //       .then((res) => this.paginateResponse(res, this.pagination))

    //     // this.items = data.query
    //     // TODO db table 확인후 변경하기
    //     // this.series[0] = data.query.rows[0]
    //     // this.series[1] = data.query.rows[1]
    //     // this.pageStayingTimes = data.query.rows
    //     this.$router.replace({ query: params })
    //   } catch (e) {
    //     console.error(e)
    //   }
    // },
    // 페이지가 바뀌거나  on/off 상태 변경시
    setPageStayingInfo (pageNumber, state) {

      if (state === 'end') { // 상태가 종료로 입력 되면
        const lastTimestampPos = this.pageStayingTimes[pageNumber - 1].times.length - 1
        this.pageStayingTimes[pageNumber - 1].times.at(lastTimestampPos).end_dt = Date.now()// 지금까지의 기록 저장
        // console.log('end')
        // console.log('lastpos' , this.pageStayingTimes[pageNumber-1].at(lastTimestampPos))
      } else {
        // console.log('start')
        const readState = { type: this.viewType, start_dt: Date.now(), end_dt: null }
        this.pageStayingTimes.at(pageNumber - 1).times.push(readState)
      }
    },
    pagesRenderedHandler (pdfApp) {
      // 페이지 랜더링 관련 처리 함수
      pdfApp.pdfViewer.container.addEventListener('scroll', this.scrollListner)


      if( this.pageStayingTimes.length ==0 ){
        this.pageStayingTimes = []
        for (let i = 0; i < pdfApp.pagesCount; i++) {
          // this.pageStayingTimes.push(JSON.parse(JSON.stringify(this.readingState)))
          this.pageStayingTimes.push(JSON.parse(JSON.stringify(this.readingState)))
        }
        // 페이지 첫 로딩시, 열람 시작시간 초기화
        this.pageStayingTimes[0].times.at(0).start_dt = Date.now()
      }

      setTimeout(() => (this.idConfig.pageNumber = pdfApp.pdfViewer.currentPageNumber))

      this.pdfApp = pdfApp
      pdfApp.pdfViewer.eventBus.on('pagechanging', ({ pageNumber }) => {
        this.setPageStayingInfo(this.pageNumber, 'end')
        this.setPageStayingInfo(pageNumber, 'start')
        this.pageNumber = pageNumber
      })// 페이지 변환이 일어났을 경우
    },
    checkTimer5minute () {
      this.timeCount++
      // const d = new Date()
      // console.log(`${d.getTime()} ${this.timeCount}`)

      if (this.timeCount >= 300 && this.timeCount < 359) {
        // alert('5분간 활동이 없습니다.!!')
        this.$refs.modal_waring.show()
      } else if (this.timeCount > 360) {
        this.$router.back()// 6분이 지나면 뒤로 이동
      }
    },
    async storingStatisticsDateInDB () {
      try {
        // params type
        //
        // const params = {

        // }
        // const data = await this.$axios.put()
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
