/**
 * Single place to tweak parliament chart sizing (senado ring + congreso ring).
 * Edit `CONGRESO_CHART_LAYOUT` or pass a partial override to `resolveCongresoChartLayout`.
 */

export const CONGRESO_CHART_LAYOUT = {
  svg: {
    maxWidth: 640,
    minWidth: 320,
    fallbackWidth: 600,
    /** viewBox width below this uses the "mobile" branch */
    mobileBreakpoint: 420,
    heightRatio: {
      mobile: 0.65,
      /** desktop: width / 2 */
      desktop: 0.5,
    },
  },
  /** Shared base gap for congreso sectionGap; senado adds senadoExtraGap */
  baseSectionGap: 5,
  senado: {
    /** One continuous arc: data index matches angular order. Multiple sections merge wedges and sort by angle, breaking party adjacency. */
    sections: 1,
    /** added to baseSectionGap for outer ring */
    sectionGapExtra: 14,
    radius: {
      min: 6,
      max: { mobile: 10, desktop: 13 },
      /** multiplies SVG width before clamping to max */
      widthFactor: { mobile: 0.05, desktop: 0.018 },
    },
    rowHeightMultiplier: { mobile: 2.15, desktop: 2.3 },
  },
  congreso: {
    sections: 3,
    innerWidthFactor: { mobile: 0.82, desktop: 0.72 },
    minRadialGapFromSenado: 1,
    /** upper bound fed into Math.min with senado radius minus gap */
    rawInnerRadiusCap: 8,
    radius: {
      min: 4,
      max: { mobile: 6, desktop: 9 },
    },
    rowHeightVsSenado: { mobile: 0.85, desktop: 0.8 },
    rowHeightMin: 10,
  },
  /**
   * Two stacked charts (senado + congreso each full-width) — used under `md` in the UI.
   */
  split: {
    senadoHeightRatio: 0.58,
    congresoHeightRatio: 0.62,
    congreso: {
      sections: 3,
      sectionGap: 5,
      radius: {
        min: 4,
        max: 8,
        widthFactor: 0.024,
      },
      rowHeightMultiplier: 2.05,
    },
  },
}

function pickMobileDesktop(isMobile, obj) {
  return isMobile ? obj.mobile : obj.desktop
}

/**
 * @param {number} elWidth - measured or fallback width in px
 * @param {typeof CONGRESO_CHART_LAYOUT} [layout]
 */
export function resolveCongresoChartLayout(elWidth, layout = CONGRESO_CHART_LAYOUT) {
  const { svg, baseSectionGap, senado, congreso } = layout
  const ancho = Math.min(
    svg.maxWidth,
    Math.max(svg.minWidth, elWidth || svg.fallbackWidth)
  )
  const isMobile = ancho < svg.mobileBreakpoint
  const md = isMobile ? 'mobile' : 'desktop'

  const height =
    md === 'mobile'
      ? ancho * svg.heightRatio.mobile
      : ancho * svg.heightRatio.desktop

  const innerFactor = pickMobileDesktop(isMobile, congreso.innerWidthFactor)
  const innerAncho = Math.round(ancho * innerFactor)
  const offset = (ancho - innerAncho) / 2

  const radiusSenadoMax = senado.radius.max[md]
  const radiusSenadoFactor = senado.radius.widthFactor[md]
  const radiusSenado = Math.max(
    senado.radius.min,
    Math.min(radiusSenadoMax, ancho * radiusSenadoFactor)
  )
  const rowHeightSenado =
    radiusSenado * pickMobileDesktop(isMobile, senado.rowHeightMultiplier)

  const gapSenado = baseSectionGap + senado.sectionGapExtra

  const radiusCongresoMax = congreso.radius.max[md]
  const radiusCongreso = Math.max(
    congreso.radius.min,
    Math.min(
      radiusCongresoMax,
      congreso.rawInnerRadiusCap,
      radiusSenado - congreso.minRadialGapFromSenado
    )
  )
  const rowHeightCongreso = Math.max(
    congreso.rowHeightMin,
    rowHeightSenado * pickMobileDesktop(isMobile, congreso.rowHeightVsSenado)
  )

  return {
    isMobile,
    svg: { width: ancho, height },
    senado: {
      chartWidth: ancho,
      sections: senado.sections,
      sectionGap: gapSenado,
      seatRadius: radiusSenado,
      rowHeight: rowHeightSenado,
    },
    congreso: {
      chartWidth: innerAncho,
      translate: { x: offset, y: offset },
      sections: congreso.sections,
      sectionGap: baseSectionGap,
      seatRadius: radiusCongreso,
      rowHeight: rowHeightCongreso,
    },
  }
}

function clampChartWidth(elWidth, layout) {
  const { svg } = layout
  return Math.min(
    svg.maxWidth,
    Math.max(svg.minWidth, elWidth || svg.fallbackWidth)
  )
}

/**
 * Standalone senado semicircle (full chart width).
 * @param {number} elWidth
 * @param {typeof CONGRESO_CHART_LAYOUT} [layout]
 */
export function resolveSplitSenadoSvgLayout(elWidth, layout = CONGRESO_CHART_LAYOUT) {
  const { svg, baseSectionGap, senado, split } = layout
  const ancho = clampChartWidth(elWidth, layout)
  const isMobile = ancho < svg.mobileBreakpoint
  const md = isMobile ? 'mobile' : 'desktop'

  const radiusSenado = Math.max(
    senado.radius.min,
    Math.min(senado.radius.max[md], ancho * senado.radius.widthFactor[md])
  )
  const rowHeightSenado =
    radiusSenado * pickMobileDesktop(isMobile, senado.rowHeightMultiplier)
  const gapSenado = baseSectionGap + senado.sectionGapExtra
  const height = ancho * split.senadoHeightRatio

  return {
    svg: { width: ancho, height },
    ring: {
      chartWidth: ancho,
      sections: senado.sections,
      sectionGap: gapSenado,
      seatRadius: radiusSenado,
      rowHeight: rowHeightSenado,
    },
  }
}

/**
 * Standalone congreso semicircle (full chart width; not nested inside senado).
 * @param {number} elWidth
 * @param {typeof CONGRESO_CHART_LAYOUT} [layout]
 */
export function resolveSplitCongresoSvgLayout(elWidth, layout = CONGRESO_CHART_LAYOUT) {
  const { split } = layout
  const ancho = clampChartWidth(elWidth, layout)
  const c = split.congreso
  const radius = Math.max(
    c.radius.min,
    Math.min(c.radius.max, ancho * c.radius.widthFactor)
  )
  const rowHeight = radius * c.rowHeightMultiplier
  const height = ancho * split.congresoHeightRatio

  return {
    svg: { width: ancho, height },
    ring: {
      chartWidth: ancho,
      sections: c.sections,
      sectionGap: c.sectionGap,
      seatRadius: radius,
      rowHeight,
    },
  }
}
