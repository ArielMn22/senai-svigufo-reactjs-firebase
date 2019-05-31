import React, { Component } from "react";
import firebase from "../../services/firebase";
import "../../assets/style.css";

export default class EventosIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listaEventos: [],
      titulo: "",
      descricao: "",
      ativo: false,
      acessoLivre: false,
      data: "",
      hora: "",
      idEvento: 0
    };
  }

  limparForm() {
    // this.setState({
    //   idEvento: 0,
    //   titulo: "",
    //   descricao: "",
    //   data: "",
    //   hora: ""
    // });

    this.setState({ idEvento: 0 });
    this.setState({ titulo: "" });
    this.setState({ descricao: "" });
    this.setState({ data: "" });
    this.setState({ hora: "" });
    this.setState({ ativo: !this.state.ativo });
    this.setState({ acessoLivre: !this.state.acessoLivre });
  }

  atualizaEstado(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  atualizaEstadoAtivo(event) {
    this.setState({ ativo : !this.state.ativo });
  }

  atualizaEstadoAcessoLivre(event) {
    this.setState({ acessoLivre : !this.state.acessoLivre });
  } 

  listarEventosRealTime() {
    firebase
      .firestore()
      .collection("eventos")
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
      });
  }

  removerEvento(event) {
    event.preventDefault();

    let check = window.confirm(
      "Deseja realmente excluir este evento? Id: " + event.target.id
    );

    if (check) {
      firebase
        .firestore()
        .collection("eventos")
        .doc(event.target.id)
        .delete()
        .then(() => {
          alert("Evento removido com sucesso!");
        })
        .catch(erro => {
          console.log("erro", erro);
        });
    }
  }

  removerTodosEventos(event) {
    event.preventDefault();

    if (window.confirm("Deseja realmente apagar todos os eventos?")) {
      let eventos = this.state.listaEventos;

      eventos.forEach(evento => {
        firebase
          .firestore()
          .collection("eventos")
          .doc(evento.id)
          .delete()
          .then(() => {
            console.log("Evento " + evento.id + " excluído com sucesso!");
          });
      });
      alert("Todas os eventos foram excluídos!");
    }
  }

  buscarPorId(event) {
    event.preventDefault();

    firebase
      .firestore()
      .collection("eventos")
      .doc(event.target.id)
      .get()
      .then(evento => {
        this.setState({
          idEvento: evento.id,
          titulo: evento.data().titulo,
          descricao: evento.data().descricao,
          ativo: evento.data().ativo,
          acessoLivre: evento.data().acessoLivre,
          data: evento
            .data()
            .data.toDate()
            .toISOString()
            .split("T")[0],
          hora: evento
            .data()
            .data.toDate()
            .toTimeString()
            .slice(0, 5)
        });
      });
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

  cadastrarEvento(event) {
    event.preventDefault();

    let evento = {
      titulo: this.state.titulo,
      descricao: this.state.descricao,
      ativo: Boolean(this.state.ativo),
      acessoLivre: Boolean(this.state.acessoLivre),
      data: firebase.firestore.Timestamp.fromDate(
        new Date(this.state.data + " " + this.state.hora)
      )
    };

    if (this.state.idEvento === 0) {
      firebase
        .firestore()
        .collection("eventos")
        .add(evento)
        .then(() => {
          alert("Evento Cadastrado!");
        })
        .catch(erro => {
          console.log("tag", erro);
        });
    } else {
      firebase
        .firestore()
        .collection("eventos")
        .doc(this.state.idEvento)
        .set(evento)
        .then(() => {
          alert("Evento alterado!");
        })
        .catch(erro => {
          console.log("erro", erro);
        });
    }
    this.limparForm();
  }

  componentDidMount() {
    this.listarEventosRealTime();
  }

  render() {
    return (
      <div>
        <header id="header">
          <h2>Eventos - Index</h2>
        </header>

        <section id="listaEventos">
          <button
            className="btn-orange"
            onClick={this.removerTodosEventos.bind(this)}
          >
            Excluir todos
          </button>
          <ul>
            {this.state.listaEventos.map((evento, index) => {
              return (
                <li key={index} className="listaEventosItem">
                  {/* <hr /> */}
                  <h2 className="evento">Evento {index + 1}</h2>
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

                  <button
                    id={evento.id}
                    className="btn-orange"
                    onClick={this.buscarPorId.bind(this)}
                  >
                    Editar
                  </button>
                  <button
                    id={evento.id}
                    className="btn-orange"
                    onClick={this.removerEvento.bind(this)}
                  >
                    Excluir
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
        <section id="cadastrarEvento">
          <form id="cadastrarForm" onSubmit={this.cadastrarEvento.bind(this)}>
            <label>
              Título
              <input
                name="titulo"
                type="text"
                placeholder="Insira o título do evento"
                onChange={this.atualizaEstado.bind(this)}
                value={this.state.titulo}
              />
            </label>

            <label>
              Descrição
              <input
                name="descricao"
                type="text"
                onChange={this.atualizaEstado.bind(this)}
                value={this.state.descricao}
                placeholder="Insira a descrição do evento."
              />
            </label>

            <label>
              Ativo
              <input
                unchecked
                name="ativo"
                onChange={this.atualizaEstadoAtivo.bind(this)}
                value={this.state.ativo}
                type="checkbox"
              />
            </label>
            <label>
              Acesso livre
              <input
                unchecked
                name="acessoLivre"
                onChange={this.atualizaEstadoAcessoLivre.bind(this)}
                value={this.state.acessoLivre}
                type="checkbox"
              />
            </label>

            <label>
              Data
              <input
                type="date"
                name="data"
                value={this.state.data}
                onChange={this.atualizaEstado.bind(this)}
              />
            </label>

            <label>
              Hora
              <input
                type="time"
                name="hora"
                value={this.state.hora}
                onChange={this.atualizaEstado.bind(this)}
              />
            </label>
            <label>
              <input
                className="btn-orange"
                type="submit"
                value="Cadastrar Evento"
              />
            </label>
          </form>
        </section>
      </div>
    );
  }
}
