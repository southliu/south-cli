import type { IPageFunctions } from "../../src/types"
import { filterFuncs, firstToUpper } from "../../src/utils/utils"

// 生成react文件
export function handleFile(title: string, modelName: string, authPath: string, functions: IPageFunctions[]): string {
  // 模板ts数据
  const modelTsData = `I${firstToUpper(modelName)}`

  // 功能拆分
  const {
    isSearch,
    isCreate,
    isPagination,
    isDelete,
    isBatchDelete
  } = filterFuncs(functions)

  // 渲染数据
  const render = `
import { useCallback, useEffect${ isBatchDelete ? ', useState' : '' } } from 'react'${ isSearch ? `\nimport Searchs from '@/components/Searchs'` : '' }${ isPagination ? `\nimport Paginations from '@/components/Paginations'` : '' }${ isCreate ? `\nimport Create from '@/components/Create'` : '' }
import { connect } from 'dva'
import { ColumnsType } from 'antd/es/table'${
  (isCreate || isDelete || isBatchDelete) ? 
  `\nimport { Popconfirm, Tooltip${isBatchDelete ? ', Button, message' : ''} } from 'antd'` : ''
}
import { initData } from '@/utils/initData'
import { IAuthorityLoginState, ${modelTsData} } from '@/models'
import checkPermission from '@/utils/permission'
import { useTitleHook } from '@/hooks'
import Tables from '@/components/Tables'
import { DISABLED_ENABLE } from '@/utils/constant'
import { findMapColor, findMapValue } from '@/utils/filter'

type IProps = {
  data: any;
  status: ${modelTsData};
  loginStatus: IAuthorityLoginState;
} & IPublic${
  isCreate ?
  `\n
const CreateLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};` : ''
}

function Page(props: IProps) {
  useTitleHook('${title}');
  const {
    dispatch,
    status,
    loginStatus,
    isLoading,${
    isCreate ? `
    isCreateLoading,` : ''
    }
  } = props;
  const {${
    isCreate ? `
    isCreate,
    updateId,` : ''
  }${
    isPagination ? `
    total,` : ''
  }
    data,
    query,
  } = status;
  let { initFormData } = status;
  const { permissions } = loginStatus;${
    isCreate ?
    `
  const isNotCreateBtn: boolean = !checkPermission({ value: \`${authPath}/create\`, permissions });` : ''
  }${
    isSearch ?
    `
  const isNotSearchBtn: boolean = !checkPermission({ value: \`${authPath}\`, permissions });` : ''
  }${
    isBatchDelete ? `
  const [selectIds, setSelectIds] = useState<React.Key[]>([]);` : ''
  }

  const defaultData: IDefaultData[] = [
    { label: 'ID', key: 'id', width: 120, isNotCreate: true },
    { label: '小程序appid', key: 'appid', width: 80, searchWidth: 240, type: 'string', isRequired: true, isSearch: true },
    { label: '状态', key: 'status', width: 130, searchWidth: 160, type: 'select', selectList: DISABLED_ENABLE, isSearch: true,
      render: (text, record) => (
        <span
          style={{ color: findMapColor(text as string, DISABLED_ENABLE) }}
        >{ findMapValue(text as string, DISABLED_ENABLE)  }</span>
      )
    },
    { label: '版本号', key: 'version', width: 80, type: 'string' },
    { label: '创建日期', key: 'created_at', width: 140, type: 'string', isNotCreate: true },
    { label: '更新日期', key: 'updated_at', width: 140, type: 'string', isNotCreate: true },${
      (isCreate || isDelete) ?
      `
    { label: '操作', key: 'operation', fixed: 'right', width: 70, isNotCreate: true, align: 'center',
      render: (text, record, index) => (
        <div className={\`options_box\`}>${
          isCreate ?
          `
          {
            checkPermission({ value: \`${authPath}/update\`, permissions }) &&
            <Tooltip title='修改'>
              <div
                className={\`options_btn iconfont\`}
                onClick={() => handleUpdate(record.id)}
              >
                &#xe612;
              </div>
            </Tooltip>
          }` : ''
        }${
          isDelete ?
          `
          {
            checkPermission({ value: \`${authPath}/delete\`, permissions }) &&
            <Popconfirm title='确定删除?' cancelText='取消' okText='确定' onConfirm={() => handleDelete(record.id)}>
              <Tooltip title='删除'>
                <div
                  className={\`options_btn iconfont\`}
                >
                  &#xe60e;
                </div>
              </Tooltip>
            </Popconfirm>
          }` : ''
        }
        </div>
      ),
    },` : ''
    }
  ];
  const datus = initData(defaultData, initFormData);
  const columnLists: ColumnsType<IDefaultData> = datus.columns;${
    isCreate ? `
  const createList = datus.createList;` : ''
  }
  const searchList = datus.searchList;
  initFormData = datus.initFormData;

  const handleGetPage = useCallback(() => {
    if (!isNotSearchBtn && data?.length === 0) {
      dispatch({
        type: '${modelName}/handleGetPage',
        payload: query,
      });
    }
  }, [isNotSearchBtn]);

  useEffect(() => {
    handleGetPage();
  }, [handleGetPage]);${
    isSearch ?
    `\n
  // 搜索
  const handleSearch = (values: any) => {
    query.page = 1;
    for (let key in values) {
      values.hasOwnProperty(key) && values[key] !== undefined && values[key] !== '' ? query[key] = values[key] : delete query[key];
    }
    dispatch({
      type: '${modelName}/handleGetPage',
      payload: query,
    });
  };` : ''
  }${
    isCreate ?
    `\n
  // 新增
  const handleClickCreate = () => {
    dispatch({
      type: '${modelName}/handleChangeCreate',
      payload: {
        id: '',
        state: true
      },
    });
  };

  // 修改
  const handleUpdate = (id: string) => {
    dispatch({
      type: '${modelName}/handleChangeUpdate',
      payload: {
        id,
        state: true
      },
    });
  };

  // 关闭新增/修改
  const handleCloseCreate = () => {
    dispatch({
      type: '${modelName}/handleChangeCreate',
      payload: {
        id: '',
        state: false,
        initFormData: {},
      },
    });
  };

  // 提交表单
  const handleCreateSubmit = (values: Record<string, any>) => {
    if (updateId) {
      dispatch({
        type: '${modelName}/handleUpdate',
        payload: {
          id: updateId,
          values,
          query,
        },
      });
    } else {
      dispatch({
        type: '${modelName}/handleCreate',
        payload: {
          values,
          query,
        },
      });
    }
  };` : ''
  }${
    isDelete ?
    `\n
  // 删除
  const handleDelete = (id: string) => {
    dispatch({
      type: '${modelName}/handleBatchDelete',
      payload: { id, query },
    });
  };` : ''
  }${
    isBatchDelete ?
    `\n
  // row选择
  const handleRowSelect = (selectedRowKeys: React.Key[], selectedRows: any[]) => {
    setSelectIds(selectedRowKeys);
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectIds.length === 0) {
      return message.warning({ content: '请勾选!', key: 'check_please' });
    }
    dispatch({
      type: '${modelName}/handleDelete',
      payload: { ids: selectIds, query },
    });
  };` : ''
  }${
    isPagination ?
    `\n
  // 处理分页
  const handleChangePage = (page: number, pageSize?: number) => {
    query.page = page;
    query.pageSize = pageSize || 20;

    dispatch({
      type: '${modelName}/handleGetPage',
      payload: query,
    });
  };` : ''
  }${
    isBatchDelete ?
    `\n
  // 搜索额外添加
  const addSearchElement = () => {
    return (
      <>
        {checkPermission({ value: \`${authPath}/batch-delete\`, permissions }) && (
          <Popconfirm
            title="确定批量删除?"
            cancelText="取消"
            okText="确定"
            onConfirm={handleBatchDelete}
          >
            <Button
              loading={isLoading}
              style={{ marginRight: 10 }}
              icon={<i className="iconfont icon-xiazai14" />}
            >
              批量删除
            </Button>
          </Popconfirm>
        )}
      </>
    );
  };` : ''
  }

  return (
    <>
      ${
      isSearch ?
      `<Searchs
        isLoading={isLoading}
        query={query}
        list={searchList}
        isNotSearch={${isSearch ? 'isNotSearchBtn' : 'true'}}
        isNotCreate={${isCreate ? 'isNotCreateBtn' : 'true'}}
        handleSearch={handleSearch}${
          isBatchDelete ? `
        addElement={addSearchElement}` : ''
        }${
          isCreate ? `
        handleClickCreate={handleClickCreate}` : ''
        }
      />
      ` : ''
      }
      <Tables
        loading={isLoading}
        data={data}
        isPagination={true}
        columnLists={columnLists}${
          isBatchDelete ? `
        handleRowSelect={handleRowSelect}` : ''
        }
      />${
        isPagination ? 
        `\n
      <Paginations
        query={query}
        total={total}
        handleChangePage={handleChangePage}
      />` : ''
      }${
        isCreate ? 
        `\n
      <Create
        isVisible={isCreate}
        list={createList}
        initFormData={initFormData}
        layout={CreateLayout}
        updateId={updateId}
        isLoading={isCreateLoading}
        handleCloseCreate={handleCloseCreate}
        handleCreateSubmit={handleCreateSubmit}
      />` : ''
      }
    </>
  );
}


export default connect(
  ({
     ${modelName},
     authorityLogin,
     loading,
   }: {
    ${modelName}: ${modelTsData},
    authorityLogin: IAuthorityLoginState;
    loading: {
      models: Record<string, boolean>,
      effects: Record<string, boolean>;
    }
  }) => (
    {
      status: ${modelName},
      loginStatus: authorityLogin,
      isLoading: loading.effects['${modelName}/handleGetPage'],${
        isCreate ? `
      isCreateLoading: loading.models.${modelName},` : ''
      }
    }
  ),
)(Page);
`

  return render
}