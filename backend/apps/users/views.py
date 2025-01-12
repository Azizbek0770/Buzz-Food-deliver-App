from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, TokenObtainPairResponseSerializer, ProfileImageSerializer
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser

User = get_user_model()

class TokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairResponseSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': serializer.data,
                'token': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Profil rasmini alohida ko'rib chiqish
        if 'profile_image' in request.FILES:
            image_serializer = ProfileImageSerializer(instance, data={'profile_image': request.FILES['profile_image']}, partial=True)
            if image_serializer.is_valid():
                image_serializer.save()
            else:
                return Response(image_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        # Qolgan ma'lumotlarni yangilash
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def delete(self, request):
        request.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)