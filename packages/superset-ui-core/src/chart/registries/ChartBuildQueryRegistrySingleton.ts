import { Registry, makeSingleton, OverwritePolicy, QueryContext, SetDataMaskHook } from '../..';

// Ideally this would be <T extends QueryFormData>
export type BuildQuery = (
  formData: any,
  options?: { hooks?: { [key: string]: any; setDataMask?: SetDataMaskHook } },
) => QueryContext;

class ChartBuildQueryRegistry extends Registry<BuildQuery> {
  constructor() {
    super({ name: 'ChartBuildQuery', overwritePolicy: OverwritePolicy.WARN });
  }
}

const getInstance = makeSingleton(ChartBuildQueryRegistry);

export default getInstance;
