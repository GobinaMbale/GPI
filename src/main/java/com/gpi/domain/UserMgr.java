package com.gpi.domain;

import com.gpi.domain.enumeration.TypeEnseignant;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserMgr.
 */
@Entity
@Table(name = "user_mgr")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserMgr implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private TypeEnseignant type;

    @Column(name = "quota_horaire")
    private Integer quotaHoraire;

    @ManyToOne
    private Departement departement;

    @ManyToOne
    private Grade grade;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserMgr id(Long id) {
        this.id = id;
        return this;
    }

    public TypeEnseignant getType() {
        return this.type;
    }

    public UserMgr type(TypeEnseignant type) {
        this.type = type;
        return this;
    }

    public void setType(TypeEnseignant type) {
        this.type = type;
    }

    public Integer getQuotaHoraire() {
        return this.quotaHoraire;
    }

    public UserMgr quotaHoraire(Integer quotaHoraire) {
        this.quotaHoraire = quotaHoraire;
        return this;
    }

    public void setQuotaHoraire(Integer quotaHoraire) {
        this.quotaHoraire = quotaHoraire;
    }

    public Departement getDepartement() {
        return this.departement;
    }

    public UserMgr departement(Departement departement) {
        this.setDepartement(departement);
        return this;
    }

    public void setDepartement(Departement departement) {
        this.departement = departement;
    }

    public Grade getGrade() {
        return this.grade;
    }

    public UserMgr grade(Grade grade) {
        this.setGrade(grade);
        return this;
    }

    public void setGrade(Grade grade) {
        this.grade = grade;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserMgr)) {
            return false;
        }
        return id != null && id.equals(((UserMgr) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserMgr{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", quotaHoraire=" + getQuotaHoraire() +
            "}";
    }
}
