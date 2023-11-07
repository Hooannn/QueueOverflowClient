import Lottie from 'lottie-react';
import groovyWalkAnimation from './groovyWalk.json';
export default function Loading() {
  return <Lottie className="w-1/2" animationData={groovyWalkAnimation} loop={true} />;
}
