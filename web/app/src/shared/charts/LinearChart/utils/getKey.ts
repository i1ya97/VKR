export const getKey = <GraphData extends { name: string; additionalName?: string }>(cd: GraphData) => {
  return `${cd.name}${cd.additionalName ? `-${cd.additionalName}` : ''}`;
};
