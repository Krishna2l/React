import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';


const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment:(dishId, rating, author, comment)=>dispatch(postComment(dishId, rating, author, comment))
})

function RenderDish(props) {

    const dish = props.dish;
    
        if (dish != null) {
            return(
              <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={style.rowContainer}>
          <Icon
            raised
            reverse
            name={props.favorite ? "heart" : "heart-o"}
            type="font-awesome"
            color="#f50"
            onPress={() =>
              props.favorite ? console.log("Already favorite") : props.onPress()
            }
          />
          <Icon
            raised
            reverse
            name="pencil"
            type="font-awesome"
            color="#512DA8"
            onPress={() => props.toggleModal()}
          />
        </View>
                </Card>
                </Animatable.View>
            );
        }
        else {
            return(<View></View>);
        }
}

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10, paddingBottom: 30 }}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating
          imageSize={15}
          readonly
          startingValue={item.rating}
          style={{ margin: 15 }}
        />
        <Text style={{ fontSize: 15 }}>
          {"-- " + item.author + ",\n" + item.date}{" "}</Text>
            </View>
        );
    };
    
    return (
      <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>        
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
        </Animatable.View>

    );
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favorites: [],
      showModal: false,
      rating: 5,
      author: "",
      comment: "",
        };
    }
    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }
    
    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
      }
      handleSubmit(dishId)
      {
        console.log(dishId);
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment)
        this.toggleModal()
      }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    toggleModal={() => this.toggleModal()}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showModal}
          onDismiss={() => this.toggleModal()}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={style.modal}>
          <Rating type="star"
                                fractions = { 0 }
                                startingValue = { 0 }
                                imageSize = { 38 }
                                onFinishRating = { rating => this.setState({ rating: rating })}
                                showRating/>
            <Input
              type="text"
              placeholder="   Author"
              defaultValue={this.state.author}
              leftIcon={{ type: "font-awesome", name: "user" }}
              onChangeText={(value) => this.setState({ author: value })}
            />
            <Input
              type="text"
              placeholder="   Comment"
              defaultValue={this.state.comment}
              onChangeText={(value) => this.setState({ comment: value })}
              leftIcon={{ type: "font-awesome", name: "comment" }}
            />
            <View style={{padding:10}}>
            <Button
              onPress={() => this.handleSubmit(dishId)}

              color="#512DA8"
              title="Submit"
            />
            </View>
            <View style={{padding:10}}>
            <Button
              onPress={() => {

                this.toggleModal();
              }}
              color="#AAA"
              title="Cancel"
            />
            </View>
          </View>
        </Modal>
            </ScrollView>
        );
    }
   
}

const style = {
    rowContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      justifyContent: "center",
      margin: 20,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      backgroundColor: "#512DA8",
      textAlign: "center",
      color: "white",
      marginBottom: 20,
    },
    modalText: {
      fontSize: 18,
      margin: 10,
    },
  };

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);