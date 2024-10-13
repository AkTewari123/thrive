import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Touchable } from 'react-native';



interface StatisticProps{
    text: string;
    value: string;
    reviews?: string; 
}



const ChartBox: React.FC = () => {
    
    const [selectedChoice, setSelectedChoice] = useState('Orders')
    const images = [
        require('./images/example1.png'),
        require('./images/example2.png'),
        require('./images/example3.png'),
        require('./images/example4.png'),
    ]
    let imgNumber = 0;
    switch(selectedChoice){
        case 'Orders':
            imgNumber = 0; 
            break;
        case 'Views':
            imgNumber = 1;
            break;
        case 'Sales':
            imgNumber = 2; 
            break;
        case 'Reviews':
            imgNumber = 3;
            break;
    }

    return (
        <View style={styles.chartBox}>
            {/* Text and Buttons at the Top */}
            <View style={styles.chartText}>
                <Text style={styles.select}>Select Chart</Text> 
            </View>
    
            <View style={styles.row}>
                <TouchableOpacity style={styles.button} onPress={() => setSelectedChoice('Orders')}>
                    <Text style={styles.buttonText}>Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setSelectedChoice('Views')}>
                    <Text style={styles.buttonText}>Views</Text>
                </TouchableOpacity>
            </View>
    
            <View style={[styles.row, { marginBottom: 5 }]}>
                <TouchableOpacity style={styles.button} onPress={() => setSelectedChoice('Sales')}>
                    <Text style={styles.buttonText}>Sales</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setSelectedChoice('Reviews')}>
                    <Text style={styles.buttonText}>Reviews</Text>
                </TouchableOpacity>
            </View>
    
            {/* Image Below Text and Buttons */}
            <View style={styles.imageBox}>
                <Image style={styles.image} source={images[imgNumber]} />
            </View>
        </View>
    );
    
}    
    





const BusinessAnalytics: React.FC = () => {
    const data = [
        { impressions: 15, orders: 15, views: '2.5k', ratings: '4.7/5', numRatings: 7 },
        { impressions: 30, orders: 30, views: '5k', ratings: '4.6/5', numRatings: 14 },
        { impressions: 45, orders: 45, views: '8.5k', ratings: '3.8/5', numRatings: 20 },
        { impressions: 60, orders: 60, views: '10.5k', ratings: '4.9/5', numRatings: 59 },
    ]
    const [selectedChoice, setSelectedChoice] = useState('Day')

    const getDataIndex = (choice: string) => {
        switch (choice) {
            case 'Day':
                return 0;
            case 'Week':
                return 1;
            case 'Month':
                return 2;
            case 'Year':
                return 3;
            default:
                return 0;
        }
    };

    const currentData = data[getDataIndex(selectedChoice)];

    return(
        <View style={styles.parentContainer}>
            <ChartBox/>

            
            <View style={styles.statSelect}> 
                <Text style={styles.topHeaderText}>Select Timeframe</Text>
                <View style={styles.selectRow}>                             
                    <TouchableOpacity style={styles.button} onPress={() => setSelectedChoice('Day')}>
                       <Text style = {styles.buttonText}>Day</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => setSelectedChoice('Week')}>
                        <Text style = {styles.buttonText}>Week</Text>
                    </TouchableOpacity>
                </View> 

                <View style={styles.selectRow}> 
                    <TouchableOpacity style={styles.button} onPress={() => setSelectedChoice('Month')}>
                       <Text style = {styles.buttonText}>Month</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => setSelectedChoice('Year')}>
                        <Text style = {styles.buttonText}>Year</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={styles.statisticBox}>

                <View>
                    <View style={styles.statTextContainer}>
                        <Text style={styles.statType} numberOfLines={1}>Impressions</Text>
                        <Text style={styles.statValue}>{currentData.impressions}</Text>
                    </View>
                    <View style={styles.statTextContainer}>
                        <Text style={styles.statType} >Views</Text>
                        <Text style={styles.statValue}>{currentData.views}</Text>
                    </View>
                </View>
                    
                <View style={[{marginRight: 15}]}>
                    <View style={styles.statTextContainer}>
                        <Text style={styles.statType}>Orders</Text>
                        <Text style={styles.statValue}>{currentData.orders}</Text>
                    </View>
                    <View style={styles.statTextContainer}>
                        <Text style={styles.statType}>Ratings</Text>
                        <Text style={styles.statValue}>{currentData.ratings}</Text>
                        <Text style={styles.reviewText}>
                            from <Text style={{ color: '#618BDB' }}>{currentData.numRatings}</Text> reviews
                        </Text>
                    </View>
                </View>

            </View>

            
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E7EB', 
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'center',
    },
    parentContainer: {
        shadowColor: "#171717",
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    topBox: {
        marginTop: 24, 
        backgroundColor: 'white',
        alignItems: 'center',
        width: '88%',
        alignSelf: 'center',
        flexDirection: 'column',
        borderRadius: 15,
    },
    topHeaderText: {
        color:'black',
        fontWeight: 'bold',
        fontSize: 32,
        marginTop: 5,
        marginBottom: 5
    },
    topText: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
    },
    topTextBlue: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        alignContent: 'center'
        
    },
    chartBox: {
        width: '88%',
        alignSelf: 'center',
        marginTop: 15,
        borderRadius: 15,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    statisticBox: { 
        backgroundColor: 'white',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '88%',
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15
    }, 
    statType: {
        fontWeight: 'bold',
        fontSize: 24,
        marginTop: 5
    },
    statValue: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#618BDB'
    },
    reviewText: {
        fontSize: 12,
        fontWeight: 'bold',
        alignSelf: 'flex-end',
        marginRight: 5
    },
    imageBox: {
        marginTop: 10, 
        borderWidth: 5,
        width: 281, 
        height: 220,
        overflow: 'hidden',
        marginBottom: 10
    },
    image: {
        width: '100%',
        height: '100%'
    },
    select: {
        fontWeight: 'bold',
        fontSize: 32, 
        marginTop: 5
    },
    chartText: {
        flexDirection: 'column',
        alignItems  : 'center',
        alignSelf: 'center'
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',

    },
    selectBlue: {
        fontWeight: 'bold',
        fontSize: 24, 
        color: '#618BDB'
    },
    statTextContainer: {
        flexDirection: 'column',
        alignItems: 'center',  // Align text in the center,
        marginTop: 5
    },
    button: {
        backgroundColor: '#618BDB',
        alignItems: 'center',
        borderRadius: 5,
        width: '40%',
        marginTop: 5,
        shadowColor: "#618BDB",
        shadowOffset: { width: -1, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    statSelect: { 
        backgroundColor: 'white',
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15, 
        justifyContent: 'space-around',
        width: '88%',
        paddingBottom: 5
    }, 
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 28
    },
    selectRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignSelf: 'center',
        width: '100%'
    }

  },
);

export default BusinessAnalytics;
