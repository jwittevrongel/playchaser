<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" exclude-result-prefixes="svg rdf" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <!-- copy by default -->
  <xsl:template match="@*|node()">
    <xsl:copy>
        <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>

  <!-- strip some nodes -->
  <xsl:template match="/svg:svg/svg:metadata" />
  <xsl:template match="/svg:svg/rdf:RDF" />
  <xsl:template match="/svg:svg/@id" />
  <xsl:template match="/svg:svg/svg:defs/@id" />
  <xsl:template match="/svg:svg//svg:g/@id" />
  <xsl:template match="/svg:svg//svg:path/@id" />
  <xsl:template match="/svg:svg//svg:path/@style[contains(.,'font-family')]" />
  <xsl:template match="/svg:svg/svg:defs/svg:font-face" />
  <xsl:template match="//svg:title" />
  <!-- inject clipping -->
  <xsl:template match="/svg:svg/svg:defs">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
      <clipPath id="gnostica-card-clip">
        <rect x="12" y="12" width="246" height="246" rx="6" ry="6"/>
      </clipPath>
    </xsl:copy>
  </xsl:template>
  <xsl:template match="/svg:svg/svg:g">
    <xsl:copy>
      <xsl:attribute name="clip-path">url(#gnostica-card-clip)</xsl:attribute>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>
</xsl:stylesheet>