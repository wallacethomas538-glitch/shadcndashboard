import contentMap from './vektorflow-content-map.json';

export type VektorFlowContentNode = (typeof contentMap.nodes)[number];

export const vektorFlowContent = contentMap;

export function getContentNode(id: string): VektorFlowContentNode | undefined {
  return contentMap.nodes.find((node) => node.id === id);
}

export function getExistingContentNodes(): VektorFlowContentNode[] {
  return contentMap.nodes.filter(
    (node) => node.status === 'existing' && node.indexable && Boolean(node.path),
  );
}

export function getContentNodesByIds(ids: string[]): VektorFlowContentNode[] {
  return ids
    .map((id) => getContentNode(id))
    .filter((node): node is VektorFlowContentNode => Boolean(node));
}
