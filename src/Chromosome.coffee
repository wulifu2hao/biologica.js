class BioLogica.Chromosome

  constructor: (@species, @chromosome, side, alleles) ->
    @alleles = alleles.sort (a,b) =>
      return if @getAllelesPosition(a) > @getAllelesPosition(b) then 1 else -1

    if typeof(side) is "object"
      @side = side[0]
    else
      @side = side

    @allelesWithSides = []
    for i in [0...@alleles.length]
      al = @alleles[i]
      s = if typeof(side) is "object" then side[i] else @side
      @allelesWithSides.push {allele: al, side: s}

  clone: (newSide) ->
    new BioLogica.Chromosome(@species, @chromosome, newSide or @side, @alleles[..])

  lengthInCentimorgans: 100

  getlengthInBasePairs: ->
    @species.chromosomesLength[@chromosome]

  getGeneOfAllele: (allele) ->
    for own geneName, gene of @species.geneList
      return geneName if ~gene.alleles.indexOf allele

  getAllelesPosition: (allele) ->
    geneName = @getGeneOfAllele allele
    @species.geneList[geneName]?.start or -1

BioLogica.Chromosome.createChromosome = (chr1, chr2, crossPoint) ->
  newAlleles = []
  newSides = []
  for allele, i in chr1.alleles
    if chr1.getAllelesPosition(allele) < crossPoint
      newAlleles.push allele
      newSides.push chr1.allelesWithSides[i].side
    else
      newAlleles.push chr2.alleles[i]
      newSides.push chr2.allelesWithSides[i].side
  return new BioLogica.Chromosome(chr1.species, chr1.chromosome, newSides, newAlleles)
