import { filterFuncs, firstToUpper } from "../../src/utils";
import { IPageFunctions } from "../../types";

// 生成react文件
export function handleModelFile(modelName: string, functions: IPageFunctions[]): string {
  // let modelName = handleAuthPath(authPath, 'modal')
  // 模板ts数据
  const modelTsData = `I${firstToUpper(modelName)}`
  // api路径
  // let apiPath = handleAuthPath(authPath, 'api')

  // 功能拆分
  const {
    isCreate,
    isPagination,
    isDelete,
    isBatchDelete
  } = filterFuncs(functions)

  // 渲染数据
  let render = `
import { Reducer } from 'redux'
import { Effect } from 'dva'
import API from '@/services/xxx'
import { message } from 'antd'

export type ${modelTsData} = {
  data: any;
  manager: any;
  total: number;${isCreate ? `
  isCreate: boolean;
  updateId: string;` : ''}
  query: ${isPagination ? 'IQuery' : 'ITreeQuery'};
  initQuery: ${isPagination ? 'IQuery' : 'ITreeQuery'};
  initFormData: any;
}

interface IModelType {
  namespace: string;
  state: ${modelTsData};
  effects: {
    handleGetPage: Effect;
    handleSetInitFormData: Effect;${
      isCreate ?  `
    handleChangeCreate: Effect;
    handleChangeUpdate: Effect;
    handleCreate: Effect;
    handleUpdate: Effect;` : ''
    }${
      isDelete ? `
    handleDelete: Effect;` : ''
    }${
      isBatchDelete ? `
    handleBatchDelete: Effect;` : ''
    }
    handleRefresh: Effect;
  };
  reducers: {
    handleGetPageState: Reducer<${modelTsData}>;
    handleSetInitFormDataState: Reducer<${modelTsData}>;
    handleChangeQuery: Reducer<${modelTsData}>;${
      isCreate ?
      `
    handleChangeCreateState: Reducer<${modelTsData}>;
    handleChangeUpdateState: Reducer<${modelTsData}>;` : ''
    }
  };
}

const Modal: IModelType = {
  namespace: '${modelName}',
  state: {${
    isCreate ?
    `
    isCreate: false,
    updateId: '',` : ''
  }
    initFormData: {},
    manager: [],
    data: [],
    total: 0,
    initQuery: {${
      isPagination ? `
      page: 1,
      pageSize: 20,` : ''
    }
    },
    query: {${
      isPagination ? `
      page: 1,
      pageSize: 20,` : ''
    }
    }
  },
  effects: {
    // 获取接口数据
    *handleGetPage({ payload }, { call, put }) {
      const response = yield call(API.find_page, payload)
      if (response?.code === 200) {
        yield put({
          type: 'handleGetPageState',
          payload: { data: response.data, query: payload }
        })
      }
    },
    // 刷新当前页
    *handleRefresh({ payload }, { call, put, select }) {
      const query = yield select((state: any) => state.platformPlatformServerOwner.initQuery)
      const response = yield call(API.find_page, query)
      
      if (response?.code === 200) {
        yield put({
          type: 'handleGetPageState',
          payload: { data: response.data, query: payload }
        })
        yield put({
          type: 'handleChangeQuery',
          payload: query
        })
        message.success({ content: '刷新成功!', key: 'refresh' });
      }
    },
    // 更新初始化值
    *handleSetInitFormData({ payload }, { call, put }) {
      yield put({
        type: 'handleSetInitFormDataState',
        payload
      })
    },${
      isCreate ? 
      `
    // 更改新增弹窗状态
    *handleChangeCreate({ payload }, { call, put }) {
      yield put({
        type: 'handleChangeCreateState',
        payload
      })
    },
    // 更改修改弹窗状态
    *handleChangeUpdate({ payload }, { call, put }) {
      const { id, state } = payload
      if (id) {
        const response = yield call(API.find_one, id)
        yield put({
          type: 'handleChangeUpdateState',
          payload: {
            id,
            state,
            data: response.data,
          }
        })
      }
    },
    // 处理新增
    *handleCreate({ payload }, { call, put }) {
      const { values, query } = payload
      const response = yield call(API.create, values)
      if (response?.code === 200) {
        message.success(response?.message || '新增成功!')
        const pageResponse = yield call(API.find_page, query)
        yield put({
          type: 'handleGetPageState',
          payload: { data: pageResponse.data, query }
        })
        yield put({
          type: 'handleChangeCreateState',
          payload: {
            id: '',
            state: false
          }
        })
      }
    },
    // 处理修改
    *handleUpdate({ payload }, { call, put }) {
      const { id, query, values } = payload
      const response = yield call(API.update, id, values)
      if (response?.code === 200) {
        message.success(response?.message || '编辑成功!')
        const pageResponse = yield call(API.find_page, query)
        yield put({
          type: 'handleGetPageState',
          payload: pageResponse
        })
        yield put({
          type: 'handleChangeCreateState',
          payload: {
            id: '',
            state: false
          }
        })
      }
    },` : ''
    }${
      isDelete ?
      `
    // 处理删除
    *handleDelete({ payload }, { call, put }) {
      const { id, query } = payload
      const response = yield call(API.batch_del, id)
      if (response?.code === 200) {
        message.success(response?.message || '删除成功!')
        const pageResponse = yield call(API.find_page, query)
        yield put({
          type: 'handleGetPageState',
          payload: { data: pageResponse.data, query }
        })
      }
    },` : ''
    }${
      isBatchDelete ? 
      `
    // 处理批量删除
    *handleBatchDelete({ payload }, { call, put }) {
      const { ids, query } = payload
      const response = yield call(API.batch_del, ids)
      if (response?.code === 200) {
        message.success(response?.message || '删除成功!')
        const pageResponse = yield call(API.find_page, query)
        yield put({
          type: 'handleGetPageState',
          payload: { data: pageResponse.data, query }
        })
      }
    }` : ''
    }
  },
  reducers: {
    // 返回接口数据
    handleGetPageState(state, { payload }) {
      const _state = JSON.parse(JSON.stringify(state))
      _state.data = payload?.data?.items || []
      _state.total = payload?.data?.total || 0
      _state.query = payload.query
      
      return {
        ..._state,
        initFormData: {},
      }
    },
    // 处理初始化值
    handleSetInitFormDataState(state, { payload }) {
      const _state = JSON.parse(JSON.stringify(state))
      _state.initFormData = payload || _state.initFormData

      return {
        ..._state,
      }
    },
    // 处理当前搜索条件
    handleChangeQuery(state, { payload }) {
      const _state = JSON.parse(JSON.stringify(state))
      _state.query = payload
      
      return {
        ..._state,
        initFormData: {},
      }
    },${
      isCreate ? 
      `
    // 更改新增/修改状态
    handleChangeCreateState(state, { payload }) {
      const _state = JSON.parse(JSON.stringify(state))
      _state.isCreate = payload?.state
      _state.updateId = ''

      return {
        ..._state,
        initFormData: {},
      }
    },
    
    // 更改修改状态
    handleChangeUpdateState(state, { payload }) {
      const _state = JSON.parse(JSON.stringify(state))
      _state.initFormData = payload?.data
      _state.updateId = payload?.id
      _state.isCreate = payload?.state

      return {
        ..._state,
      }
    },` : ''
    }
  }
}

export default Modal
`

  return render
}