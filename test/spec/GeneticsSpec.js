describe("An organism's genetics", function() {
  it("is created when an organism is created", function() {
    var org = new BioLogica.Organism(BioLogica.Species.Drake, BioLogica.FEMALE, "");

    expect(org.genetics).toExist();
  });

  it("creates genotype when an organism is created with an alleleString", function() {
    var org = new BioLogica.Organism(BioLogica.Species.Drake, BioLogica.FEMALE, "a:h,b:H,a:t,b:Tk,b:dl,a:W,b:w,a:dl"),
        chromosomes = org.getGenotype().chromosomes;
window.org = org
console.log("chromosomes = ")
console.log(chromosomes)
    expect(chromosomes["1"].a).toContain("t");
    expect(chromosomes["1"].a).toContain("W");
    expect(chromosomes["1"].b).toContain("Tk");
    expect(chromosomes["1"].b).toContain("w");

    expect(chromosomes["2"].a).toContain("h");
    expect(chromosomes["2"].b).toContain("H");

    expect(chromosomes["XY"].a).toContain("dl");
  });

  it("creates genotype when an organism is created with a genotype specification", function() {
    var org = new BioLogica.Organism(BioLogica.Species.Drake, BioLogica.FEMALE,
                {
                  "1": {
                    "a": ["t", "W"],
                    "b": ["Tk", "w"]
                  },
                  "2": {
                    "a": ["h"],
                    "b": ["H"]
                  },
                  "XY": {
                    "a": ["dl"]
                  }
                }),
        chromosomes = org.getGenotype().chromosomes;

    expect(chromosomes["1"].a).toContain("t");
    expect(chromosomes["1"].a).toContain("W");
    expect(chromosomes["1"].b).toContain("Tk");
    expect(chromosomes["1"].b).toContain("w");

    expect(chromosomes["2"].a).toContain("h");
    expect(chromosomes["2"].b).toContain("H");

    expect(chromosomes["XY"].a).toContain("dl");
  });

  it("creates complete genotype when an organism is created with an under-specified alleleString", function() {
    var org = new BioLogica.Organism(BioLogica.Species.Drake, BioLogica.FEMALE, "a:h,b:H"),
        chromosomes = org.getGenotype().chromosomes;

    expect(chromosomes["1"].a.length).toBe(3);
    expect(chromosomes["1"].b.length).toBe(3);
    expect(chromosomes["2"].a.length).toBe(5);
    expect(chromosomes["2"].b.length).toBe(5);
    expect(chromosomes["XY"].a.length).toBe(3);
    expect(chromosomes["XY"].b.length).toBe(3);

    var chromo1A = chromosomes["1"].a;
    expect(chromo1A).toContainAnyOneOf(["t", "T", "Tk"]);
    expect(chromo1A).toContainAnyOneOf(["m", "M"]);
    expect(chromo1A).toContainAnyOneOf(["w", "W"]);
    expect(chromo1A).not.toContainAnyOneOf(["h", "H"]);
  });
});

describe("An species' genetics", function() {
  it("correctly identifies alleles as belonging to genes", function() {
    var genetics = new BioLogica.Genetics(BioLogica.Species.Drake, BioLogica.FEMALE, "");

    expect(genetics.isAlleleOfGene("T", "T")).toBe(true);
    expect(genetics.isAlleleOfGene("dl", "D")).toBe(true);
    expect(genetics.isAlleleOfGene("Rh", "rh")).toBe(true);
    expect(genetics.isAlleleOfGene("rh", "D")).toBe(false);
  });

  it("correctly finds the chromosome an allele belongs to", function() {
    var genetics = new BioLogica.Genetics(BioLogica.Species.Drake, BioLogica.FEMALE, "");

    expect(genetics.findChromosome("t")).toBe("1");
    expect(genetics.findChromosome("Fl")).toBe("2");
    expect(genetics.findChromosome("dl")).toBe("XY");

    expect(genetics.findChromosome("zzz")).toBe(false);
  });

  it("correctly filters a set of alleles", function() {
    var genetics = new BioLogica.Genetics(BioLogica.Species.Drake, BioLogica.FEMALE, ""),
        alleles = ["Tk", "m", "W", "dl"],
        geneFilter = ["T", "D"],
        filteredAlleles = genetics.filter(alleles, geneFilter);

    expect(filteredAlleles).toContain("Tk");
    expect(filteredAlleles).toContain("dl");
    expect(filteredAlleles).not.toContain("m");
    expect(filteredAlleles).not.toContain("W");
  });

  it("correctly converts an allele string into genotype", function() {
    var genetics = new BioLogica.Genetics(BioLogica.Species.Drake, BioLogica.FEMALE, ""),
        alleles = "a:h,b:H,a:t,b:Tk,b:dl,a:W,b:w,a:dl",
        chromosomes =genetics.convertAlleleStringToGenotypeHash(alleles);

    expect(chromosomes["1"].a).toContain("t");
    expect(chromosomes["1"].a).toContain("W");
    expect(chromosomes["1"].b).toContain("Tk");
    expect(chromosomes["1"].b).toContain("w");

    expect(chromosomes["2"].a).toContain("h");
    expect(chromosomes["2"].b).toContain("H");

    expect(chromosomes["XY"].a).toContain("dl");
  });

  it("finds if a chromosome contains a gene", function() {
    var genetics = new BioLogica.Genetics(BioLogica.Species.Drake, BioLogica.FEMALE, ""),
        chromosome = ["h", "A2"];

    expect(genetics.chromosomeContainsGene(chromosome, "h")).toBe(true);
    expect(genetics.chromosomeContainsGene(chromosome, "a")).toBe(true);
    expect(genetics.chromosomeContainsGene(chromosome, "hl")).toBe(false);
  });

  it("can create a random allele of a gene", function() {
    var genetics = new BioLogica.Genetics(BioLogica.Species.Drake, ""),
        allele1 = genetics.getRandomAllele("h"),
        allele2 = genetics.getRandomAllele("a");

    expect(allele1).toBeAnyOneOf(["h", "H"]);
    expect(allele2).toBeAnyOneOf(["A1", "A2", "a"]);
  });

  it("can create a random alleles that are uniformly distributed", function() {
    var genetics = new BioLogica.Genetics(BioLogica.Species.Drake, BioLogica.FEMALE, ""),
        alleleCounts = {A1: 0, A2: 0, a: 0},
        i = 10000,
        allele;
    while(i--)
    {
      allele = genetics.getRandomAllele("a");
      alleleCounts[allele]++;
    }

    // expect 3333 for all
    expect(alleleCounts.A1).toBeBetween(3200, 3500);
    expect(alleleCounts.A2).toBeBetween(3200, 3500);
    expect(alleleCounts.a).toBeBetween(3200, 3500);
  });

  it("can create a complete chromosome object from an under-specified alleleString", function() {
    var genetics = new BioLogica.Genetics(BioLogica.Species.Drake, BioLogica.FEMALE, "a:h,b:H"),
        chromosomes =genetics.genotype.chromosomes;

    expect(chromosomes["1"].a.length).toBe(3)
    expect(chromosomes["1"].b.length).toBe(3)
    expect(chromosomes["2"].a.length).toBe(5)
    expect(chromosomes["2"].b.length).toBe(5)
    expect(chromosomes["XY"].a.length).toBe(3)
    expect(chromosomes["XY"].b.length).toBe(3)

    var chromo1A = chromosomes["1"].a;
    expect(chromo1A).toContainAnyOneOf(["t", "T", "Tk"]);
    expect(chromo1A).toContainAnyOneOf(["m", "M"]);
    expect(chromo1A).toContainAnyOneOf(["w", "W"]);
    expect(chromo1A).not.toContainAnyOneOf(["h", "H"]);
  });

});

describe("The Genetics library", function() {
  it("correctly parses an allele string into the two sides", function() {
    var alleles = BioLogica.Genetics.parseAlleleString("a:h,b:H,a:t,b:t,a:Dl,b:D");

    expect(alleles.a).toContain("h");
    expect(alleles.a).toContain("t");
    expect(alleles.a).toContain("Dl");

    expect(alleles.b).toContain("H");
    expect(alleles.b).toContain("t");
    expect(alleles.b).toContain("D");
  });
});