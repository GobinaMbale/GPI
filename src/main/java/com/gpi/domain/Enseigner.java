package com.gpi.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Enseigner.
 */
@Entity
@Table(name = "enseigner")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Enseigner implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "date_debut", nullable = false)
    private Instant dateDebut;

    @NotNull
    @Column(name = "date_fin", nullable = false)
    private Instant dateFin;

    @ManyToOne
    private Matiere matiere;

    @ManyToOne
    @JsonIgnoreProperties(value = { "departement", "grade" }, allowSetters = true)
    private UserMgr enseignant;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Enseigner id(Long id) {
        this.id = id;
        return this;
    }

    public Instant getDateDebut() {
        return this.dateDebut;
    }

    public Enseigner dateDebut(Instant dateDebut) {
        this.dateDebut = dateDebut;
        return this;
    }

    public void setDateDebut(Instant dateDebut) {
        this.dateDebut = dateDebut;
    }

    public Instant getDateFin() {
        return this.dateFin;
    }

    public Enseigner dateFin(Instant dateFin) {
        this.dateFin = dateFin;
        return this;
    }

    public void setDateFin(Instant dateFin) {
        this.dateFin = dateFin;
    }

    public Matiere getMatiere() {
        return this.matiere;
    }

    public Enseigner matiere(Matiere matiere) {
        this.setMatiere(matiere);
        return this;
    }

    public void setMatiere(Matiere matiere) {
        this.matiere = matiere;
    }

    public UserMgr getEnseignant() {
        return this.enseignant;
    }

    public Enseigner enseignant(UserMgr userMgr) {
        this.setEnseignant(userMgr);
        return this;
    }

    public void setEnseignant(UserMgr userMgr) {
        this.enseignant = userMgr;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Enseigner)) {
            return false;
        }
        return id != null && id.equals(((Enseigner) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Enseigner{" +
            "id=" + getId() +
            ", dateDebut='" + getDateDebut() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            "}";
    }
}
