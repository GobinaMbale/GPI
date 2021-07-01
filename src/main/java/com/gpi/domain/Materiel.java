package com.gpi.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Materiel.
 */
@Entity
@Table(name = "materiel")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Materiel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false, unique = true)
    private String nom;

    @NotNull
    @Column(name = "date_creation", nullable = false)
    private Instant dateCreation;

    @Column(name = "etat")
    private Boolean etat;

    @ManyToOne
    private TypeMateriel type;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Materiel id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Materiel nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Instant getDateCreation() {
        return this.dateCreation;
    }

    public Materiel dateCreation(Instant dateCreation) {
        this.dateCreation = dateCreation;
        return this;
    }

    public void setDateCreation(Instant dateCreation) {
        this.dateCreation = dateCreation;
    }

    public Boolean getEtat() {
        return this.etat;
    }

    public Materiel etat(Boolean etat) {
        this.etat = etat;
        return this;
    }

    public void setEtat(Boolean etat) {
        this.etat = etat;
    }

    public TypeMateriel getType() {
        return this.type;
    }

    public Materiel type(TypeMateriel typeMateriel) {
        this.setType(typeMateriel);
        return this;
    }

    public void setType(TypeMateriel typeMateriel) {
        this.type = typeMateriel;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Materiel)) {
            return false;
        }
        return id != null && id.equals(((Materiel) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Materiel{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", dateCreation='" + getDateCreation() + "'" +
            ", etat='" + getEtat() + "'" +
            "}";
    }
}
