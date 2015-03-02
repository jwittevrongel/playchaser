#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
SRC=$1
DEST=$2
INKSCAPE=/Applications/Inkscape.app/Contents/Resources/bin/inkscape

if [ ! -d "${SRC}" ] ; then
	echo "Must supply source directory."
	exit 1
fi

if [ ! -d "${DEST}" ] ; then
	mkdir -p "${DEST}"
fi

for INFILE in "${SRC}"/*.svg ; do
	TMPFILE=$( mktemp -t processSvgs )
	OUTFILE="${DEST}"/$( basename "${INFILE}" )z
	echo "${INFILE}" -\> "${OUTFILE}"
	"${INKSCAPE}" -z -T -l "${TMPFILE}" "`pwd`/${INFILE}" 2> /dev/null
	xsltproc --novalid "${DIR}/optimizeAndClip.xsl" "${TMPFILE}" | gzip -cfq9 > "${OUTFILE}"
	rm -f "${TMPFILE}"
done
