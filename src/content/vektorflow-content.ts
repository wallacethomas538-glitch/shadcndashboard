import contentMap from './vektorflow-content-map.json';

export type VektorFlowContentNode = (typeof contentMap.nodes)[number] & {
  path?: string | null;
  pillar?: string | null;
  concepts?: string[];
  relatedAgents?: string[];
  linksInFrom?: string[];
  linksOutTo?: string[];
};

export type VektorFlowLinkableNode = VektorFlowContentNode & {
  path: string;
};

export type VektorFlowBreadcrumb = {
  id: string;
  title: string;
  path: string;
};

export type VektorFlowLinkSuggestion = {
  node: VektorFlowLinkableNode;
  score: number;
  reasons: string[];
};

export const vektorFlowContent = contentMap;
const contentNodes = contentMap.nodes as VektorFlowContentNode[];

function isLinkableNode(
  node: VektorFlowContentNode | undefined,
): node is VektorFlowLinkableNode {
  return Boolean(
    node &&
      node.status === 'existing' &&
      node.indexable &&
      typeof node.path === 'string' &&
      node.path.length > 0,
  );
}

export function getContentNode(id: string): VektorFlowContentNode | undefined {
  return contentNodes.find((node) => node.id === id);
}

export function getLinkableContentNodes(): VektorFlowLinkableNode[] {
  return contentNodes.filter(isLinkableNode);
}

/** Backward-compatible alias used by dashboard navigation. */
export function getExistingContentNodes(): VektorFlowLinkableNode[] {
  return getLinkableContentNodes();
}

export function getContentNodesByIds(
  ids: string[],
): VektorFlowContentNode[] {
  return ids
    .map((id) => getContentNode(id))
    .filter((node): node is VektorFlowContentNode => Boolean(node));
}

/**
 * Resolve registry relationships to actual published/indexable routes.
 * Planned, target, excluded, and non-indexable nodes are intentionally omitted.
 */
export function getLinkableContentNodesByIds(
  ids: string[] | undefined,
): VektorFlowLinkableNode[] {
  if (!ids?.length) return [];

  return ids
    .map((id) => getContentNode(id))
    .filter(isLinkableNode);
}

export function getCanonicalPath(id: string): string | undefined {
  const node = getContentNode(id);
  return isLinkableNode(node) ? node.path : undefined;
}

export function getDeclaredOutgoingLinks(
  id: string,
): VektorFlowLinkableNode[] {
  const node = getContentNode(id);
  return getLinkableContentNodesByIds(node?.linksOutTo);
}

export function getDeclaredIncomingLinks(
  id: string,
): VektorFlowLinkableNode[] {
  const node = getContentNode(id);
  return getLinkableContentNodesByIds(node?.linksInFrom);
}

/**
 * Finds all currently linkable nodes that explicitly point at the target.
 * This also catches one-way relationships declared only on the source node.
 */
export function getIncomingLinks(
  id: string,
): VektorFlowLinkableNode[] {
  return getLinkableContentNodes().filter((node) =>
    node.linksOutTo?.includes(id),
  );
}

function sharedConcepts(
  a: VektorFlowContentNode,
  b: VektorFlowContentNode,
): string[] {
  const conceptsA = new Set(a.concepts ?? []);
  return (b.concepts ?? []).filter((concept) => conceptsA.has(concept));
}

/**
 * Returns related, currently published/indexable content.
 * Explicit registry relationships always outrank concept-based matches.
 */
export function getRelatedContent(
  id: string,
  limit = 6,
): VektorFlowLinkableNode[] {
  return getSuggestedLinks(id, limit).map((item) => item.node);
}

/**
 * Generates deterministic internal-link candidates from the registry.
 *
 * Scoring:
 * - explicit outgoing relationship: +100
 * - explicit incoming relationship: +50
 * - shared concept: +10 per concept
 * - same pillar: +5
 *
 * Only existing + indexable + canonical-route nodes can be returned.
 */
export function getSuggestedLinks(
  id: string,
  limit = contentMap.generation.defaultContextualOutgoingLinks,
): VektorFlowLinkSuggestion[] {
  const source = getContentNode(id);
  if (!source || limit <= 0) return [];

  const explicitOut = new Set(source.linksOutTo ?? []);
  const explicitIn = new Set(source.linksInFrom ?? []);

  return getLinkableContentNodes()
    .filter((node) => node.id !== id)
    .map((node) => {
      const concepts = sharedConcepts(source, node);
      const reasons: string[] = [];
      let score = 0;

      if (explicitOut.has(node.id)) {
        score += 100;
        reasons.push('declared outgoing relationship');
      }

      if (explicitIn.has(node.id)) {
        score += 50;
        reasons.push('declared incoming relationship');
      }

      if (concepts.length) {
        score += concepts.length * 10;
        reasons.push(`shared concepts: ${concepts.join(', ')}`);
      }

      if (source.pillar && node.pillar === source.pillar) {
        score += 5;
        reasons.push('same pillar');
      }

      return { node, score, reasons };
    })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.node.title.localeCompare(b.node.title),
    )
    .slice(0, limit);
}

export function getBreadcrumbs(
  id: string,
): VektorFlowBreadcrumb[] {
  const node = getContentNode(id);
  if (!isLinkableNode(node)) return [];

  const breadcrumbs: VektorFlowBreadcrumb[] = [];
  const home = getContentNode('vf-home');

  if (isLinkableNode(home) && home.id !== node.id) {
    breadcrumbs.push({
      id: home.id,
      title: home.title,
      path: home.path,
    });
  }

  const pillar = contentMap.taxonomy.pillars.find(
    (item) => item.id === node.pillar,
  );

  if (pillar) {
    const pillarNode = getLinkableContentNodes().find(
      (candidate) => candidate.path === pillar.route,
    );

    if (
      pillarNode &&
      pillarNode.id !== node.id &&
      !breadcrumbs.some((item) => item.id === pillarNode.id)
    ) {
      breadcrumbs.push({
        id: pillarNode.id,
        title: pillarNode.title,
        path: pillarNode.path,
      });
    }
  }

  if (!breadcrumbs.some((item) => item.id === node.id)) {
    breadcrumbs.push({
      id: node.id,
      title: node.title,
      path: node.path,
    });
  }

  return breadcrumbs;
}

export function getRelatedAgents(id: string): string[] {
  return getContentNode(id)?.relatedAgents ?? [];
}

export function getIndexableContent(): VektorFlowLinkableNode[] {
  return getLinkableContentNodes();
}

export function getSitemapContent(): VektorFlowLinkableNode[] {
  return getLinkableContentNodes();
}

export function getCanonicalRouteMap(): Record<string, string> {
  return Object.fromEntries(
    getLinkableContentNodes().map((node) => [node.id, node.path]),
  );
}
