import React, { Component } from "react";
import firebase from "../../services/firebase";

export default class EventosIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listaEventos: []
    };
  }

  listarEventosRealTime()
  {
    firebase.firestore().collection("eventos")
    .where("ativo", "==", true)
    .onSnapshot(eventos => {
        let eventosArray = [];

        eventos.forEach(evento => {
          eventosArray.push({
            id: evento.id,
            titulo: evento.data().titulo,
            descricao: evento.data().descricao,
            data: evento.data().data,
            acessoLivre: evento.data().acessoLivre,
            ativo: evento.data().ativo
          });
        });

        this.setState({ listaEventos: eventosArray }, () => {
          console.log(this.state.listaEventos);
        });
    })
  }

  listarEventos() {
    firebase
      .firestore()
      .collection("eventos")
      .where("ativo", "==", true)
      .get()
      .then(eventos => {
        let eventosArray = [];

        eventos.forEach(evento => {
          eventosArray.push({
            id: evento.id,
            titulo: evento.data().titulo,
            descricao: evento.data().descricao,
            data: evento.data().data,
            acessoLivre: evento.data().acessoLivre,
            ativo: evento.data().ativo
          });
        });

        this.setState({ listaEventos: eventosArray }, () => {
          console.log(this.state.listaEventos);
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.listarEventosRealTime();
  }

  render() {
    return (
      <div>
        <h2>Eventos - Index</h2>

        {this.state.listaEventos.map((evento, index) => {
          return (
            <div>
              <hr />
              <h2>Evento {index + 1}</h2>
              <h3>Id: {evento.id}</h3>
              <h3>Título: {evento.titulo}</h3>
              <h3>Descrição: {evento.descricao}</h3>
              {evento.ativo === true ? (
                <h3>Ativo: Verdadeiro</h3>
              ) : (
                <h3>Ativo: Falso</h3>
              )}
              {evento.acessoLivre === true ? (
                <h3>Acesso Livre: Liberado</h3>
              ) : (
                <h3>Acesso Livre: Recusado</h3>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}
