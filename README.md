## Deep Link

1. Tham khảo:
 * https://viblo.asia/p/deep-linking-voi-react-native-GrLZDXGVZk0
 * https://facebook.github.io/react-native/docs/linking
 * https://medium.com/the-react-native-log/handle-deep-links-in-react-native-apps-b22055149b3a

1. Gọi Deep Link đã đăng ký:
  - Sử dụng thư viện Linking của React Native. 
    Xem file src/components/HomeMain.js

    ```jsx
    import { Linking } from "react-native";
    //...
    <View style={styles.dlink}>
      <TextInput
        style={styles.input_link}
        onChangeText={this.onChangeDeepLink}
        value={this.state.link}
      />
      <TouchableOpacity onPress={this.linkToUrl} >
        <Text>GO</Text>
      </TouchableOpacity>
    </View>
    //...
    onChangeDeepLink = (link) => this.setState({ link });

    linkToUrl = () => {
      const { link } = this.state;
      Linking.openURL(link).catch((err) => {
        alert("Can't handle url: " + link);
        console.log(err)
      });
    };
    ```

1. Đăng ký Deep Link
    1. Cấu hình Android: Update file android/app/src/main/AndroidManifest.xml
      ```xml
      <activity
        android:name=".MainActivity"
        android:launchMode="singleTask"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenSize"
        android:windowSoftInputMode="adjustResize">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
        
        <intent-filter>      <!-- ADD THESE -->
          <action android:name="android.intent.action.VIEW"/>
          <category android:name="android.intent.category.DEFAULT"/>
          <category android:name="android.intent.category.BROWSABLE"/>
          <data android:scheme="pwrnet"
              android:host="home"     
              android:pathPrefix="/" 
          />
        </intent-filter>     <!-- END -->
      </activity>
      ```

    1. Cấu hình iOS:
        - Sử dụng thư viện RCTLinking có sẵn trong React Native => Link thư viện này manually vào project:
            * B1: Kéo RCTLinking.xcodeproj từ node_modules/react-native/Libraries/LinkingIOS đến thư mục Libraries của project.
            * B2: Chọn project > tab Build Phases > kéo libRCTLinking.a từ thư mục RTCLinking Products đến Link Binary With Libraries
            * B3: tab Header Search Paths > nhập $(SRCROOT)/../node_modules/react-native/Libraries
            * B4: tab Info > thêm URL type > URL Schemes nhập "pwrnet" (giống với scheme ở cấu hình Android)
            * B5: Edit AppDelegate.m
                ```swift
                // iOS 9.x or newer
                #import <React/RCTLinkingManager.h>

                - (BOOL)application:(UIApplication *)application
                            openURL:(NSURL *)url
                            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
                {
                  return [RCTLinkingManager application:application openURL:url options:options];
                }
                ```
        - Note: trong project PowerNet có sử dụng openURL của FacebookSDK để login, nên ở B5 phải merge code hàm openURL với FB


    1. Xử lý Route để đi vào đúng component: 
        - Sau khi app đã được cấu hình listen URL (deep link). Cần phải đọc các params của URL để điều hướng đúng nơi.
        - B1: cài đặt thư viện crossroads để parse URL gửi đến
        - B2: src/Router.js
            ```jsx
            import { Linking } from "react-native";
            import { Actions } from "react-native-router-flux";
            import crossroads from 'crossroads';
            //...
            componentDidMount() {
              // Route incoming URL: chuẩn bị format URL gửi đến để tách biến, nếu thoả format => gọi callback xử lý và điều hướng vào đúng trang
              crossroads.addRoute('home/{someone}/{token}', (someone, token) => Actions.HomeMain({ someone, token }));

              // Handle deep-link
              Linking
                .getInitialURL()
                .then(url => {
                  if (url) {
                    // console.log('Initial url is: ' + url);
                    this.handleOpenURL({ url });
                  }
                })
                .catch(console.error);

              Linking.addEventListener('url', this.handleOpenURL);
            }

            handleOpenURL(event) {
              const scheme = "pwrnet";	// Nếu thay đổi phải sửa tương ứng trong AndroidManifest.xml. Config lại URL Schemes trong xcode 
              if (event.url && event.url.indexOf(scheme + '://') === 0) {
                crossroads.parse(event.url.slice(scheme.length + 3));   // parse URL gửi đến
              }
            }

            componentWillUnMount() {
              //...
              Linking.removeEventListener('url', this.handleOpenURL);
            }
            ```